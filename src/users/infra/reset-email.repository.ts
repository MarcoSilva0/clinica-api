import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export default class ResetEmailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveEmailChangeRequest(
    userId: string,
    newEmail: string,
    code: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.emailResetToken.upsert({
      where: { userId },
      update: {
        newEmail,
        token: code,
        expiresAt,
      },
      create: {
        userId,
        newEmail,
        token: code,
        expiresAt,
      },
    });
  }

  async findEmailChangeRequest(code: string, userId: string) {
    return this.prisma.emailResetToken.findFirst({
      where: {
        token: code,
        user: {
          id: userId,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async findEmailChangeRequestByUserId(userId: string) {
    return this.prisma.emailResetToken.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async updateEmailChangeRequestAsUsed(requestId: string) {
    return this.prisma.emailResetToken.update({
      where: { id: requestId },
      data: { used: true },
    });
  }
}
