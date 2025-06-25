import { Injectable } from '@nestjs/common';
import { Appoiments, AppoimentsStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppoimentDto } from '../domain/dto/create-appoiment.dto';
import {
  mountPagination,
  PaginationResponse,
} from 'src/core/utils/paginationResponse';
import { ListAllAppoimentsQueryDto } from '../domain/dto/list-all-appoiments.dto';

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
  ): Promise<PaginationResponse<Appoiments>> {
    const { page, pageSize, skip, take } = mountPagination({
      page: filters.page,
      pageSize: filters.pageSize,
    });

    const conditionAnd: any[] = [];
    const conditionOr: any[] = [];

    if (filters.startDate && filters.endDate) {
      conditionAnd.push({
        date_start: {
          gte: new Date(filters.startDate),
        },
      });

      conditionAnd.push({
        date_end: {
          lte: new Date(filters.endDate),
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
        ...[
          {
            patient_name: {
              contains: filters.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            patient_email: {
              contains: filters.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            patient_phone: {
              contains: filters.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            patient_cpf: {
              contains: filters.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
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
        date_end: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      data: {
        status: AppoimentsStatus.CONFIRMED,
      },
    });

    const appoiments = await this.prisma.appoiments.findMany({
      where: {
        patient_cpf: patientCpf.replace(/\D/g, ''),
        date_start: {
          gte: startOfDay,
          lte: endOfDay,
        },
        date_end: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: AppoimentsStatus.CONFIRMED,
      },
    });

    return appoiments;
  }
}
