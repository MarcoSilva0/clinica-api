import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminDashboardCounts() {
    const [totalUsersActive, totalPatients, totalExamTypes, totalAppoiments] =
      await this.prisma.$transaction([
        this.prisma.users.count({ where: { active: true } }),
        this.prisma.appoiments.groupBy({
          by: ['patient_cpf'],
          _count: true,
          orderBy: undefined,
        }),
        this.prisma.examTypes.count(),
        this.prisma.appoiments.count(),
      ]);

    return {
      totalUsersActive,
      totalPatients: totalPatients.length,
      totalExamTypes,
      totalAppoiments,
    };
  }

  async getSecretaryDashboardCounts() {
    const [totalPatients, totalAppoiments] = await this.prisma.$transaction([
      this.prisma.appoiments.groupBy({
        by: ['patient_cpf'],
        _count: true,
        orderBy: undefined,
      }),
      this.prisma.appoiments.count({
        where: {
          date_start: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
    ]);

    return {
      totalPatients: totalPatients.length,
      totalAppoiments,
    };
  }
}
