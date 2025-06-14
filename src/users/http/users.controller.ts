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
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UserEntity } from '../domain/entities/user.entity';
import { ApiPaginatedResponse } from 'src/core/decorators/paginated-response.decorator';
import { ListAllUsersQueryDto } from '../domain/dto/list-all-users-query.dto';
import { PaginationResponse } from 'src/core/utils/paginationResponse';
import { UpdateUserStatusDto } from '../domain/dto/update-user-status.dto';
import { UpdateUserDto } from '../domain/dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Delete(':id')
  async remove(@Param('id') userId: string) {
    return await this.usersService.remove(userId);
  }

  @Put(':id')
  async update(@Param('id') userId: string, @Body() examType: UpdateUserDto) {
    return await this.usersService.update(userId, examType);
  }

  @Patch(':id/status')
  async partialUpdate(
    @Param('id') userId: string,
    @Body() data: UpdateUserStatusDto,
  ) {
    return await this.usersService.changeActiveStatus(userId, data);
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
}
