import { BadRequestException, Injectable } from '@nestjs/common';
import ResetEmailRepository from '../infra/reset-email.repository';
import { MailerService } from 'src/mailer/services/mailer.service';
import { generateCode } from 'src/core/utils/genereta-random-code';
import { Users } from '@prisma/client';

@Injectable()
export class ResetEmailService {
  constructor(
    private readonly resetEmailRepository: ResetEmailRepository,
    private readonly mailerService: MailerService,
  ) {}

  async requestChangeEmail(user: Users, email: string): Promise<void> {
    this.sendRequestEmailToEmail(user, email);
  }

  async sendRequestEmailToEmail(user: Users, newEmail: string): Promise<void> {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    this.mailerService.sendEmail(
      user.email,
      'Solicitação de redefinição de E-mail',
      `<html>
          <p>Para redefinir seu e-mail, por favor use o seguinte código:</p>
          <p><strong>${code}</strong></p>
          <p>Esse código irá expirar em 15 minutos</p>
        </html>`,
    );

    await this.resetEmailRepository.saveEmailChangeRequest(
      user.id,
      newEmail,
      code,
      expiresAt,
      false,
    );
  }

  async validateChangeEmailToken(
    code: string,
    userId: string,
  ): Promise<string> {
    const resetToken = await this.resetEmailRepository.findEmailChangeRequest(
      code,
      userId,
    );

    if (!resetToken || resetToken.used)
      throw new BadRequestException('Token inválido');
    if (resetToken.expiresAt < new Date())
      throw new BadRequestException('Token expirado');

    await this.resetEmailRepository.updateEmailChangeRequestAsUsed(
      resetToken.id,
    );

    return resetToken.newEmail;
  }
}
