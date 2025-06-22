import { BadRequestException, Injectable } from '@nestjs/common';
import UsersRepository from '../infra/users.repository';
import { hash } from 'bcryptjs';
import { ListAllUsersQueryDto } from '../domain/dto/list-all-users-query.dto';
import { UpdateUserStatusDto } from '../domain/dto/update-user-status.dto';
import { MailerService } from 'src/mailer/services/mailer.service';
import { Role, Users } from '@prisma/client';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { CreateUserAdminDto } from '../domain/dto/create-user-admin.dto';
import { UpdateUserDto } from '../domain/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailerService: MailerService,
  ) {}

  async findOneByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.findUserByEmail(email);
  }

  async createUser(
    user: CreateUserDto,
    photo?: Express.Multer.File,
  ): Promise<{
    userCreated: Users;
    emailSended: boolean;
  }> {
    const saltRounds = 10;
    if (user.role === Role.SECRETARIA) {
      user.password = await this.generateRandomPassword(10);
    }
    if (!user.password) {
      throw new BadRequestException('Password is required');
    }
    const passwordCrypt = await hash(user.password, saltRounds);

    const userCreated = await this.usersRepository.createUser({
      ...user,
      photo: photo?.path,
      tempPassword: user.role === Role.SECRETARIA,
      password: passwordCrypt,
    });

    const isSecretaria = user.role === Role.SECRETARIA;
    const welcomeMessage = isSecretaria
      ? `<html>
          <p>Seja bem-vindo(a), ${userCreated.email}!</p>
          <p>Seu acesso ao sistema foi criado com sucesso.</p>
          <p><strong>Senha provisória:</strong> ${user.password}</p>
          <p>Por favor, altere sua senha após o primeiro acesso.</p>
        </html>`
      : `<html>
          <p>Seja bem-vindo(a), ${userCreated.email}!</p>
          <p>Seu acesso ao sistema foi criado com sucesso.</p>
        </html>`;

    const emailSender = await this.mailerService.sendEmail(
      user.email,
      'Email Criado',
      welcomeMessage,
    );

    return { userCreated, emailSended: emailSender.success };
  }

  async createAdminUser(user: CreateUserAdminDto): Promise<Users> {
    const saltRounds = 10;
    const passwordCrypt = await hash(user.password, saltRounds);
    return await this.usersRepository.createUser({
      ...user,
      active: true,
      tempPassword: false,
      role: Role.ADMIN,
      password: passwordCrypt,
    });
  }

  async findAll(filters: ListAllUsersQueryDto): Promise<any> {
    return await this.usersRepository.findAll(filters);
  }

  async findOne(id: string): Promise<Users | null> {
    return await this.usersRepository.findOne(id);
  }

  async remove(id: string) {
    return await this.usersRepository.remove(id);
  }

  async update(id: string, user: UpdateUserDto): Promise<Users | null> {
    return await this.usersRepository.update(id, user);
  }

  async changeActiveStatus(
    id: string,
    data: UpdateUserStatusDto,
  ): Promise<Users | null> {
    return await this.usersRepository.changeActiveStatus(id, data);
  }

  async findFirstAdmin(): Promise<Users | null> {
    return await this.usersRepository.findFirstAdmin();
  }

  /**
   * Shuffles an array in place using the Fisher-Yates algorithm.
   * @param array - The array to shuffle.
   */
  private async shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Generates a random password of specified length.
   * @param length - The length of the password to generate (default is 20).
   * @returns A promise that resolves to a randomly generated password.
   */
  async generateRandomPassword(length = 20): Promise<string> {
    const characters =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';
    const passwordArray = Array.from(
      { length },
      () => characters[Math.floor(Math.random() * characters.length)],
    );
    await this.shuffleArray(passwordArray);
    return passwordArray.join('');
  }
}
