import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UserEntity } from '../domain/entities/user.entity';
import { ApiPaginatedResponse } from 'src/core/decorators/paginated-response.decorator';
import { ListAllUsersQueryDto } from '../domain/dto/list-all-users-query.dto';
import { PaginationResponse } from 'src/core/utils/paginationResponse';
import { UpdateUserStatusDto } from '../domain/dto/update-user-status.dto';
import { UpdateUserDto } from '../domain/dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/infra/decorators/role/role.decorator';
import { requestChangeEmailDto } from '../domain/dto/request-change-email.dto';
import { confirmChangeEmailDto } from '../domain/dto/confirm-change-email.dto';

@ApiTags('Usuário')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserEntity,
  })
  async create(
    @Body() createUser: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 2000000 })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<any> {
    return await this.usersService.createUser(createUser, file);
  }

  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') userId: string) {
    return await this.usersService.remove(userId);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserEntity,
  })
  async update(
    @Param('id') userId: string,
    @Body() user: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 2000000 })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.usersService.update(userId, {
      ...user,
      photo: file ? file.path : undefined,
    });
  }

  @Patch(':id/status')
  async partialUpdate(
    @Param('id') userId: string,
    @Body() data: UpdateUserStatusDto,
  ) {
    return await this.usersService.changeActiveStatus(userId, data);
  }

  @Patch(':id/photo')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 200,
    description: 'User photo updated successfully',
    type: UserEntity,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updatePhoto(
    @Param('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 2000000 })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<UserEntity | null> {
    if (!file) {
      throw new NotFoundException('Photo not found');
    }
    const updatedUser = await this.usersService.updatePhoto(userId, file);

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return UserEntity.toHttpResponse(updatedUser);
  }

  @Get()
  @ApiPaginatedResponse(UserEntity)
  async listAll(
    @Query() filters: ListAllUsersQueryDto,
  ): Promise<PaginationResponse<UserEntity>> {
    return await this.usersService.findAll(filters);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: UserEntity,
  })
  async findOne(@Param('id') id: string): Promise<UserEntity | null> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserEntity.toHttpResponse(user);
  }

  @Post(':id/request-change-email')
  async requestChangeEmail(
    @Param('id') id: string,
    @Body() data: requestChangeEmailDto,
  ): Promise<void> {
    return await this.usersService.requestEmailChange(id, data.email);
  }

  @Post(':id/confirm-email-change')
  async confirmEmailChange(
    @Param('id') id: string,
    @Body() data: confirmChangeEmailDto,
  ): Promise<{ message: string }> {
    const emailChanged = await this.usersService.changeEmail(id, data.code);
    if (!emailChanged) {
      throw new NotFoundException('Email change request not found or expired');
    }
    return { message: 'Email changed successfully' };
  }
}
