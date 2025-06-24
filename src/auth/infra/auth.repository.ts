import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export default class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async savePasswordResetCode(
    user: string,
    code: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.passwordResetToken.upsert({
      where: { userId: user },
      update: {
        token: code,
        expiresAt,
        used: false,
      },
      create: {
        userId: user,
        token: code,
        expiresAt,
        used: false,
      },
    });
  }

  async findPasswordResetCode(token: string, email: string) {
    return this.prisma.passwordResetToken.findFirst({
      where: {
        token,
        user: {
          email,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async findPasswordResetCodeByUserId(userId: string) {
    return this.prisma.passwordResetToken.findUnique({
      where: { id: userId },
      include: { user: true },
    });
  }

  async updateResetTokenAsUsed(resetTokenId: string) {
    return this.prisma.passwordResetToken.update({
      where: { id: resetTokenId },
      data: { used: true },
    });
  }
}
