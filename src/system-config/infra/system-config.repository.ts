import { Injectable } from '@nestjs/common';
import { SystemConfig } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export default class SystemConfigRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSystemConfig(): Promise<SystemConfig | null> {
    return this.prisma.systemConfig.findUnique({
      where: { id: 1 },
    });
  }

  async createSystemConfig(data: {
    maxWaitTimeMin: number;
  }): Promise<SystemConfig> {
    return this.prisma.systemConfig.upsert({
      where: { id: 1 },
      update: {
        initialized: true,
        maxWaitTimeMin: data.maxWaitTimeMin,
      },
      create: {
        id: 1,
        initialized: true,
        maxWaitTimeMin: data.maxWaitTimeMin,
      },
    });
  }

  async updateSystemConfig(data: {
    maxWaitTimeMin: number;
  }): Promise<SystemConfig> {
    return this.prisma.systemConfig.update({
      where: { id: 1 },
      data: {
        maxWaitTimeMin: data.maxWaitTimeMin,
      },
    });
  }
}
