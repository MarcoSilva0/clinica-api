import { Injectable } from '@nestjs/common';
import { AppoimentsStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export default class AppoimentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.appoiments.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.appoiments.findFirst({
      where: {
        id,
      },
    });
  }

  async createAppoiment(appoiment: any) {
    return this.prisma.appoiments.create({
      data: {
        ...appoiment,
      },
    });
  }

  async update(id: string, appoiment: any) {
    return this.prisma.appoiments.update({
      where: {
        id,
      },
      data: {
        ...appoiment,
      },
    });
  }

  async changeStatus(id: string, status: { status: AppoimentsStatus }) {
    return this.prisma.appoiments.update({
      where: {
        id,
      },
      data: {
        status: status.status,
      },
    });
  }
}
