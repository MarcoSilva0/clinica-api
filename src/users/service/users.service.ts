import { Injectable } from '@nestjs/common';
import UsersRepository from '../infra/users.repository';
import { hash } from 'bcryptjs';
import { ListAllUsersQueryDto } from '../domain/dto/list-all-users-query.dto';
import { UpdateUserStatusDto } from '../domain/dto/update-user-status.dto';
import { MailerService } from 'src/mailer/services/mailer.service';

export type User = any;

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailerService: MailerService,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findUserByEmail(email);
  }

  async createUser(user: User, photo?: Express.Multer.File): Promise<User> {
    const saltRounds = 10;

    const passwordCrypt = await hash(user.password, saltRounds);

    const userCreated = await this.usersRepository.createUser({
      ...user,
      active: Boolean(user.active),
      photo: photo?.path,
      password: passwordCrypt,
    });

    const emailSender = await this.mailerService.sendEmail(
      'marcoantonio02016@outlook.com',
      'Email Criado',
      `<html>Seu e-mail foi criado ${userCreated.email}</html>`,
    );

    return { userCreated, emailSended: emailSender.success };
  }

  async createAdminUser(user: User): Promise<User> {
    const saltRounds = 10;
    const passwordCrypt = await hash(user.password, saltRounds);
    const userCreated = await this.usersRepository.createUser({
      ...user,
      active: true,
      role: 'ADMIN',
      password: passwordCrypt,
    });
    return userCreated;
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

  async findFirstAdmin(): Promise<User | null> {
    return await this.usersRepository.findFirstAdmin();
  }
}
