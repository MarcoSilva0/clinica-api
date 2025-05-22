import { Injectable } from '@nestjs/common';
import UsersRepository from '../infra/users.repository';
import { hash } from 'bcryptjs';
import { ListAllUsersQueryDto } from '../domain/dto/list-all-users-query.dto';
import { UserEntity } from '../domain/entities/user.entity';
import { UpdateUserStatusDto } from '../domain/dto/update-user-status.dto';

export type User = any;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findUserByEmail(email);
  }

  async createUser(user: User): Promise<User> {
    const saltRounds = 10;
    const passwordCrypt = await hash(user.password, saltRounds);

    return this.usersRepository.createUser({
      ...user,
      password: passwordCrypt,
    });
  }

  async findAll(filters: ListAllUsersQueryDto): Promise<any> {
    return await this.usersRepository.findAll(filters);
  }

  async findOne(id: string): Promise<User | null> {
    return await this.usersRepository.findOne(id);
  }

  async remove(id: string) {
    return await this.usersRepository.remove(id);
  }

  async update(id: string, user: User): Promise<User | null> {
    return await this.usersRepository.update(id, user);
  }

  async changeActiveStatus(
    id: string,
    data: UpdateUserStatusDto,
  ): Promise<User | null> {
    return await this.usersRepository.changeActiveStatus(id, data);
  }
}
