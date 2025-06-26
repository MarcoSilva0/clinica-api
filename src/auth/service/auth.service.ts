import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/service/users.service';
import { AuthenticationResponseDto } from '../domain/dto/authentication-response.dto';
import { MailerService } from 'src/mailer/services/mailer.service';
import AuthRepository from '../infra/auth.repository';
import { Users } from '@prisma/client';
import { generateCode } from 'src/core/utils/genereta-random-code';
import { ResetTemporaryPasswordDto } from '../domain/dto/reset-temporary-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly authRepository: AuthRepository,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticationResponseDto> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user || (!user.password && password)) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    if (
      user.password &&
      !(await this.usersService.comparePassword(password, user.password))
    ) {
      throw new UnauthorizedException('E-mail ou senha inválidos!');
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tempPassword: user.tempPassword,
      photo: user.photo,
    };

    const access_token = await this.jwtService.signAsync(payload);

    const expiresOn = await this.jwtService.decode(access_token).exp;

    if (!user.tempPassword) {
      await this.usersService.registerLogin(user.email);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      expiresOn,
      tempPassword: user.tempPassword,
      photo: user.photo,
      token: access_token,
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('E-mail not found');
    }

    this.sendResetPasswordEmail(user);
  }

  async sendResetPasswordEmail(user: Users): Promise<void> {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    this.mailerService.sendEmail(
      user.email,
      'Solicitação de redefinição de Senha',
      `<html>
        <h1>Solicitação de redefinição de Senha</h1>
        <p>Para redefinir sua senha, por favor use o seguinte código:</p>
        <p><strong>${code}</strong></p>
        <p>Esse código irá expirar em 15 minutos</p>
      </html>`,
    );

    await this.authRepository.savePasswordResetCode(user.id, code, expiresAt);
  }

  async resetPassword(
    code: string,
    email: string,
    newPassword: string,
  ): Promise<void> {
    const resetToken = await this.authRepository.findPasswordResetCode(
      code,
      email,
    );
    if (!resetToken || resetToken.used)
      throw new BadRequestException('Token inválido');
    if (resetToken.expiresAt < new Date())
      throw new BadRequestException('Token expirado');

    await this.usersService.updateUserPassword(resetToken.user.id, newPassword);

    await this.authRepository.updateResetTokenAsUsed(resetToken.id);
  }

  async resetTemporaryPassword({
    email,
    temporaryPassword,
    newPassword,
    confirmNewPassword,
  }: ResetTemporaryPasswordDto): Promise<void> {
    if (!email) {
      throw new BadRequestException('Todos os campos são obrigatórios');
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }

    if (temporaryPassword === newPassword) {
      throw new BadRequestException(
        'A nova senha não pode ser igual à senha temporária',
      );
    }

    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isTemporaryPasswordValid = await this.usersService.comparePassword(
      temporaryPassword,
      user.password,
    );

    if (!isTemporaryPasswordValid) {
      throw new UnauthorizedException('Senha temporária inválida');
    }

    await this.usersService.updateUserPassword(user.id, newPassword);
  }
}
