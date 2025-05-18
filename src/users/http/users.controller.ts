import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { User } from '@prisma/client';
import { UserEntity } from '../domain/entities/user.entity';

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
}
