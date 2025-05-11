import { Injectable } from '@nestjs/common';
import UsersRepository from '../infra/users.repository';
import { hash } from 'bcryptjs';

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
}
