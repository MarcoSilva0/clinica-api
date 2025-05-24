import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { User } from '@prisma/client';
import { UserEntity } from '../domain/entities/user.entity';
import { ApiPaginatedResponse } from 'src/core/decorators/paginated-response.decorator';
import { ListAllUsersQueryDto } from '../domain/dto/list-all-users-query.dto';
import { PaginationResponse } from 'src/core/utils/paginationResponse';
import { UpdateUserStatusDto } from '../domain/dto/update-user-status.dto';
import { UpdateUserDto } from '../domain/dto/update-user.dto';

@ApiTags('Usuário')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserEntity,
  })
  async create(@Body() createUser: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(createUser);
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
