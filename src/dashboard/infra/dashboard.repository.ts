import { Injectable } from '@nestjs/common';
import { AppoimentsStatus, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminDashboardCounts() {
    // Definir o range de uma semana (últimos 7 dias)
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6); // 7 dias incluindo hoje
    startDate.setHours(0, 0, 0, 0);

    const [
      totalUsersActive,
      totalPatients,
      totalExamTypes,
      totalAppoiments,
      weeklyAppoiments,
    ] = await this.prisma.$transaction([
      this.prisma.users.count({ where: { active: true } }),
      this.prisma.appoiments.groupBy({
        by: ['patient_cpf'],
        _count: true,
        orderBy: undefined,
      }),
      this.prisma.examTypes.count(),
      this.prisma.appoiments.count(),
      this.prisma.appoiments.findMany({
        where: {
          date_start: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          date_start: true,
          status: true,
        },
      }),
    ]);

    // Processar dados para agrupar por dia e status
    const weeklyStatusCount = {};

    // Inicializar estrutura para os 7 dias
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dayKey = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD

      weeklyStatusCount[dayKey] = {
        SCHEDULED: 0,
        CONFIRMED: 0,
        WAITING_APPOIMENT: 0,
        IN_APPOINTMENT: 0,
        FINISIHED: 0,
        CANCELED: 0,
        GIVEN_UP: 0,
        NO_SHOW: 0,
      };
    }

    // Contar agendamentos por dia e status
    weeklyAppoiments.forEach((appoiment) => {
      const dayKey = appoiment.date_start.toISOString().split('T')[0];
      if (weeklyStatusCount[dayKey]) {
        weeklyStatusCount[dayKey][appoiment.status]++;
      }
    });

    return {
      totalUsersActive,
      totalPatients: totalPatients.length,
      totalExamTypes,
      totalAppoiments,
      weeklyStatusCount,
    };
  }

  async getSecretaryDashboardCounts() {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);
    const [
      totalPatients,
      totalAppoiments,
      totalConfirmed,
      totalFinished,
      appoimentsWithBothDates,
      weeklyAppoiments,
    ] = await this.prisma.$transaction([
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
      this.prisma.appoiments.count({
        where: {
          status: AppoimentsStatus.CONFIRMED,
          date_start: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      this.prisma.appoiments.count({
        where: {
          status: AppoimentsStatus.FINISIHED,
          date_start: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      this.prisma.appoiments.findMany({
        where: {
          confirmationDate: { not: null },
          finishedDate: { not: null },
          date_start: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
        select: {
          confirmationDate: true,
          finishedDate: true,
        },
      }),
      this.prisma.appoiments.findMany({
        where: {
          date_start: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          date_start: true,
          status: true,
        },
      }),
    ]);

    const totalConfirmedAndFinished = totalConfirmed + totalFinished;
    const finishedPercentage =
      totalConfirmedAndFinished > 0
        ? Math.round((totalFinished / totalConfirmedAndFinished) * 100)
        : 0;

    // Calcular tempo médio de espera em minutos
    let averageWaitingTimeMinutes = 0;
    if (appoimentsWithBothDates.length > 0) {
      const totalWaitingTime = appoimentsWithBothDates.reduce(
        (acc, appoiment) => {
          const confirmationTime = appoiment.confirmationDate!.getTime();
          const finishedTime = appoiment.finishedDate!.getTime();
          const waitingTime = finishedTime - confirmationTime; // em milissegundos
          return acc + waitingTime;
        },
        0,
      );

      averageWaitingTimeMinutes = Math.round(
        totalWaitingTime / appoimentsWithBothDates.length / (1000 * 60),
      );
    }

    // Processar dados para agrupar por dia e status
    const weeklyStatusCount = {};

    // Inicializar estrutura para os 7 dias
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dayKey = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD

      weeklyStatusCount[dayKey] = {
        SCHEDULED: 0,
        CONFIRMED: 0,
        WAITING_APPOIMENT: 0,
        IN_APPOINTMENT: 0,
        FINISIHED: 0,
        CANCELED: 0,
        GIVEN_UP: 0,
        NO_SHOW: 0,
      };
    }

    // Contar agendamentos por dia e status
    weeklyAppoiments.forEach((appoiment) => {
      const dayKey = appoiment.date_start.toISOString().split('T')[0];
      if (weeklyStatusCount[dayKey]) {
        weeklyStatusCount[dayKey][appoiment.status]++;
      }
    });

    return {
      totalPatients: totalPatients.length,
      totalAppoiments,
      totalConfirmed,
      totalFinished,
      finishedPercentage,
      averageWaitingTimeMinutes,
      weeklyStatusCount,
    };
  }
}
