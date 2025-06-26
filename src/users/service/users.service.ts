import { BadRequestException, Injectable } from '@nestjs/common';
import UsersRepository from '../infra/users.repository';
import { hash, compare } from 'bcryptjs';
import { ListAllUsersQueryDto } from '../domain/dto/list-all-users-query.dto';
import { UpdateUserStatusDto } from '../domain/dto/update-user-status.dto';
import { MailerService } from 'src/mailer/services/mailer.service';
import { Role, Users } from '@prisma/client';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { CreateUserAdminDto } from '../domain/dto/create-user-admin.dto';
import { UpdateUserDto } from '../domain/dto/update-user.dto';
import { ResetEmailService } from './reset-email.service';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateUserModel } from '../domain/dto/update-user-model.dto';
import { UserEntity } from '../domain/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailerService: MailerService,
    private readonly resetEmailService: ResetEmailService,
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
    const userExist = await this.usersRepository.findUserByEmail(user.email);

    if (userExist) {
      throw new BadRequestException('Usuário já cadastrado');
    }

    const userParsed = UserEntity.parseUserToCreateDto(user);

    const saltRounds = 10;
    if (user.role === Role.SECRETARIA) {
      user.password = await this.generateRandomPassword(10);
    }
    if (!user.password) {
      throw new BadRequestException('Senha é obrigatória');
    }
    const passwordCrypt = await hash(user.password, saltRounds);

    const userCreated = await this.usersRepository.createUser({
      ...userParsed,
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
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (user.role === Role.ADMIN) {
      throw new BadRequestException(
        'Não é possível remover um usuário administrador',
      );
    }

    if (user.lastLogin) {
      throw new BadRequestException(
        'Não é possível remover um usuário que já fez login',
      );
    }

    return await this.usersRepository.remove(id);
  }

  async update(id: string, user: UpdateUserModel): Promise<Users | null> {
    const existingUser = await this.usersRepository.findOne(id);
    if (!existingUser) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const userParsed = UserEntity.parseUserToUpdateDto(user);

    if (existingUser.photo && user.photo) {
      fs.unlink(existingUser.photo, (err) => {
        if (err) {
          console.error('Erro ao remover a foto antiga:', err);
        } else {
          console.log('Foto antiga removida com sucesso');
        }
      });
    }

    return await this.usersRepository.update(id, {
      ...userParsed,
    });
  }

  async updateUserPassword(
    id: string,
    password: string,
  ): Promise<Users | null> {
    const saltRounds = 10;
    const passwordCrypt = await hash(password, saltRounds);
    return await this.usersRepository.updateUserPassword(id, passwordCrypt);
  }

  async compareUserPassword(
    password_to: string,
    password_from: string,
  ): Promise<boolean> {
    return await compare(password_to, password_from);
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

  async registerLogin(email: string): Promise<void> {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    await this.usersRepository.updateLastLogin(user.id);
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

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  async requestEmailChange(id: string, newEmail: string): Promise<void> {
    const emailAlreadyExists =
      await this.usersRepository.findUserByEmail(newEmail);

    if (emailAlreadyExists) {
      throw new BadRequestException('E-mail já cadastrado');
    }

    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (user.email === newEmail) {
      throw new BadRequestException(
        'O novo e-mail não pode ser o mesmo do atual',
      );
    }

    await this.resetEmailService.requestChangeEmail(user, newEmail);
  }

  async changeEmail(userId: string, code: string) {
    const resetToken = await this.resetEmailService.validateChangeEmailToken(
      code,
      userId,
    );

    const codeFormatted = String(code).trim();
    if (codeFormatted.length !== 6) {
      throw new BadRequestException('Código inválido');
    }

    if (typeof resetToken !== 'string') {
      throw new BadRequestException('Token inválido ou expirado');
    }

    if (!resetToken) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    return await this.usersRepository.updateUserEmail(userId, resetToken);
  }

  async updatePhoto(
    userId: string,
    photo: Express.Multer.File,
  ): Promise<Partial<Users> | null> {
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (!photo || !photo.path) {
      throw new BadRequestException('Foto não encontrada');
    }

    if (user.photo) {
      fs.unlink(user.photo, (err) => {
        if (err) {
          console.error('Erro ao remover a foto antiga:', err);
        } else {
          console.log('Foto antiga removida com sucesso');
        }
      });
    }

    const { password, ...userWithoutPassword } =
      await this.usersRepository.updateUserPhoto(userId, photo.path);

    return userWithoutPassword;
  }
}
