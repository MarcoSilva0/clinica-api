import { Injectable } from '@nestjs/common';
import { Appoiments, AppoimentsStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppoimentDto } from '../domain/dto/create-appoiment.dto';
import {
  mountPagination,
  PaginationResponse,
} from 'src/core/utils/paginationResponse';
import { ListAllAppoimentsQueryDto } from '../domain/dto/list-all-appoiments.dto';
import { UpdateAppoimentStatusDto } from '../domain/dto/update-appoiment-status.dto';
import { fromZonedTime } from 'date-fns-tz';
import moment from 'moment';

@Injectable()
export default class AppoimentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByExamTypeId(examsTypeId: string) {
    return this.prisma.appoiments.findMany({
      where: {
        examsTypeId,
      },
    });
  }

  async findAll(
    filters: ListAllAppoimentsQueryDto,
  ): Promise<PaginationResponse<any>> {
    const { page, pageSize, skip, take } = mountPagination({
      page: filters.page,
      pageSize: filters.pageSize,
    });

    const conditionAnd: any[] = [];
    const conditionOr: any[] = [];

    if (filters.startDate && filters.endDate) {
      let startDateStr = filters.startDate;
      let endDateStr = filters.endDate;

      if (new Date(startDateStr) > new Date(endDateStr)) {
        [startDateStr, endDateStr] = [endDateStr, startDateStr];
      }

      const startDate = new Date(`${startDateStr}T00:00:00.000`);
      const endDate = new Date(`${endDateStr}T23:59:59.999`);

      conditionAnd.push({
        date_start: {
          gte: startDate,
        },
      });

      conditionAnd.push({
        date_start: {
          lte: endDate,
        },
      });
    }

    if (filters.status) {
      conditionAnd.push({
        status: filters.status,
      });
    }

    if (filters.examsTypeId) {
      conditionAnd.push({
        examsTypeId: filters.examsTypeId,
      });
    }

    if (filters.search) {
      conditionOr.push({
        patient_name: {
          contains: filters.search,
          mode: Prisma.QueryMode.insensitive,
        },
      });

      conditionOr.push({
        patient_email: {
          contains: filters.search,
          mode: Prisma.QueryMode.insensitive,
        },
      });

      conditionOr.push({
        patient_phone: {
          contains: filters.search,
          mode: Prisma.QueryMode.insensitive,
        },
      });

      conditionOr.push({
        patient_cpf: {
          contains: filters.search,
          mode: Prisma.QueryMode.insensitive,
        },
      });
    }

    const whereInput: Prisma.AppoimentsWhereInput = {
      AND: conditionAnd.length > 0 ? conditionAnd : undefined,
      OR: conditionOr.length > 0 ? conditionOr : undefined,
    };

    const totalAppoiments = await this.prisma.appoiments.count({
      where: whereInput,
    });

    const appoiments = await this.prisma.appoiments.findMany({
      skip,
      take,
      where: {
        AND: conditionAnd.length > 0 ? conditionAnd : undefined,
        OR: conditionOr.length > 0 ? conditionOr : undefined,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        examsType: true,
      },
    });

    return {
      data: appoiments,
      totalPages: Math.ceil(totalAppoiments / pageSize) ?? 1,
      currentPage: page,
      totalItems: totalAppoiments ?? 0,
    };
  }

  async findOne(id: string) {
    return this.prisma.appoiments.findFirst({
      where: {
        id,
      },
    });
  }

  async createAppoiment(appoiment: CreateAppoimentDto) {
    return this.prisma.appoiments.create({
      data: {
        ...appoiment,
        patient_cpf: appoiment.patient_cpf.replace(/\D/g, ''),
        patient_phone: appoiment.patient_phone.replace(/\D/g, ''),
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

  async changeStatus(id: string, data: UpdateAppoimentStatusDto) {
    return this.prisma.appoiments.update({
      where: {
        id,
      },
      data: {
        status: data.status,
        statusDetails: data.details,
      },
    });
  }

  async cancelAppoiment(
    id: string,
    canceledTime: Date,
    details: string,
  ): Promise<Appoiments> {
    return this.prisma.appoiments.update({
      where: {
        id,
      },
      data: {
        status: AppoimentsStatus.CANCELED,
        date_end: canceledTime,
        statusDetails: details,
        canceledDate: canceledTime,
      },
    });
  }

  async noShowAppoiment(id: string, noShowTime): Promise<Appoiments> {
    return this.prisma.appoiments.update({
      where: {
        id,
      },
      data: {
        status: AppoimentsStatus.NO_SHOW,
        statusDetails: 'Paciente não compareceu',
        date_end: noShowTime,
        givenUpDate: noShowTime,
      },
    });
  }

  async finishAppoiment(id: string, finishedTime: Date): Promise<Appoiments> {
    return this.prisma.appoiments.update({
      where: {
        id,
      },
      data: {
        status: AppoimentsStatus.FINISIHED,
        date_end: finishedTime,
        finishedDate: finishedTime,
      },
    });
  }

  async findAllAppoimentsByExamTypeId(examTypeId: string): Promise<number> {
    return this.prisma.appoiments.count({
      where: {
        examsTypeId: examTypeId,
      },
    });
  }

  async confirmPatientTodayAppoiments(
    patientCpf: string,
  ): Promise<Appoiments[]> {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    await this.prisma.appoiments.updateMany({
      where: {
        patient_cpf: patientCpf.replace(/\D/g, ''),
        date_start: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      data: {
        status: AppoimentsStatus.CONFIRMED,
        confirmationDate: new Date(),
      },
    });

    const appoiments = await this.prisma.appoiments.findMany({
      where: {
        patient_cpf: patientCpf.replace(/\D/g, ''),
        date_start: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: AppoimentsStatus.CONFIRMED,
      },
    });

    return appoiments;
  }

  /**
   * Busca agendamentos confirmados do dia atual ordenados por horário de início
   * Para exibição na página de acompanhamento em tempo real
   */
  async findTodayConfirmedAppoiments(examTypeIds?: string[]) {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    const whereCondition: Prisma.AppoimentsWhereInput = {
      status: AppoimentsStatus.CONFIRMED,
      date_start: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (examTypeIds && examTypeIds.length > 0) {
      whereCondition.examsTypeId = {
        in: examTypeIds,
      };
    }

    return this.prisma.appoiments.findMany({
      where: whereCondition,
      orderBy: {
        date_start: 'asc',
      },
      include: {
        examsType: true,
      },
    });
  }

  /**
   * Busca agendamentos finalizados do dia atual
   * Para exibir histórico de atendimentos realizados
   */
  async findTodayFinishedAppoiments(examTypeIds?: string[]) {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    const whereCondition: Prisma.AppoimentsWhereInput = {
      status: AppoimentsStatus.FINISIHED,
      date_start: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (examTypeIds && examTypeIds.length > 0) {
      whereCondition.examsTypeId = {
        in: examTypeIds,
      };
    }

    return this.prisma.appoiments.findMany({
      where: whereCondition,
      orderBy: {
        finishedDate: 'desc',
      },
      include: {
        examsType: true,
      },
    });
  }

  /**
   * Calcula o tempo médio de atendimento por tipo de exame para o dia atual
   * Retorna em minutos
   */
  async calculateAverageAttendanceTimeByExamType(examTypeId: string): Promise<number> {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    // Buscar agendamentos finalizados do dia para o tipo de exame específico
    const finishedAppoiments = await this.prisma.appoiments.findMany({
      where: {
        examsTypeId: examTypeId,
        status: AppoimentsStatus.FINISIHED,
        date_start: {
          gte: startOfDay,
          lte: endOfDay,
        },
        finishedDate: {
          not: null,
        },
      },
      select: {
        date_start: true,
        finishedDate: true,
      },
    });

    if (finishedAppoiments.length === 0) {
      return 0;
    }

    // Calcular duração de cada atendimento em minutos
    const durations = finishedAppoiments.map(appoiment => {
      const startTime = new Date(appoiment.date_start).getTime();
      const endTime = new Date(appoiment.finishedDate!).getTime();
      return Math.round((endTime - startTime) / (1000 * 60)); // Converter para minutos
    });

    // Calcular média
    const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
    return Math.round(totalDuration / durations.length);
  }

  /**
   * Busca estatísticas de tempo médio para todos os tipos de exame do dia atual
   */
  async getTodayExamTypesAverageTime(examTypeIds?: string[]) {
    const examTypes = await this.prisma.examTypes.findMany({
      where: examTypeIds && examTypeIds.length > 0 ? {
        id: {
          in: examTypeIds,
        },
        active: true,
      } : {
        active: true,
      },
    });

    const averageTimes = await Promise.all(
      examTypes.map(async (examType) => {
        const averageTime = await this.calculateAverageAttendanceTimeByExamType(examType.id);
        return {
          examTypeId: examType.id,
          examTypeName: examType.name,
          defaultDuration: examType.defaultDuration,
          averageTimeMinutes: averageTime,
        };
      })
    );

    return averageTimes;
  }

  /**
   * Busca agendamentos em andamento (IN_APPOINTMENT) do dia atual
   */
  async findTodayInProgressAppoiments(examTypeIds?: string[]) {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    const whereCondition: Prisma.AppoimentsWhereInput = {
      status: AppoimentsStatus.IN_APPOINTMENT,
      date_start: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (examTypeIds && examTypeIds.length > 0) {
      whereCondition.examsTypeId = {
        in: examTypeIds,
      };
    }

    return this.prisma.appoiments.findMany({
      where: whereCondition,
      include: {
        examsType: true,
      },
    });
  }

  /**
   * Busca dados completos para a página de acompanhamento em tempo real
   */
  async getDashboardData(examTypeIds?: string[]) {
    const [
      confirmedAppoiments,
      finishedAppoiments,
      inProgressAppoiments,
      averageTimes,
    ] = await Promise.all([
      this.findTodayConfirmedAppoiments(examTypeIds),
      this.findTodayFinishedAppoiments(examTypeIds),
      this.findTodayInProgressAppoiments(examTypeIds),
      this.getTodayExamTypesAverageTime(examTypeIds),
    ]);

    return {
      confirmed: confirmedAppoiments,
      finished: finishedAppoiments,
      inProgress: inProgressAppoiments,
      averageTimes,
      currentDateTime: new Date(),
    };
  }
}
