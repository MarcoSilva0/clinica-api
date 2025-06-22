import { Injectable } from '@nestjs/common';
import { Appoiments, AppoimentsStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppoimentDto } from '../domain/dto/create-appoiment.dto';
import {
  mountPagination,
  PaginationResponse,
} from 'src/core/utils/paginationResponse';
import { ListAllAppoimentsQueryDto } from '../domain/dto/list-all-appoiments.dto';
import { AppoimentsEntity } from '../domain/entities/appoiments.entity';

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

    const totalAppoiments = await this.prisma.appoiments.count({
      where: {
        AND: [
          {
            date: {
              gte: filters.startDate,
              lte: filters.endDate,
            },
          },
        ],
        OR: [
          {
            patient_name: {
              contains: filters.search,
              mode: 'insensitive',
            },
          },
          {
            patient_email: {
              contains: filters.search,
              mode: 'insensitive',
            },
          },
          {
            patient_phone: {
              contains: filters.search,
              mode: 'insensitive',
            },
          },
          {
            patient_cpf: {
              contains: filters.search,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    const appoiments = await this.prisma.appoiments.findMany({
      skip,
      take,
      where: {
        AND: [
          {
            date:
              filters.startDate && filters.endDate
                ? {
                    gte: filters.startDate,
                    lte: filters.endDate,
                  }
                : undefined,
          },
        ],
        OR: filters.search
          ? [
              {
                patient_name: {
                  contains: filters.search,
                  mode: 'insensitive',
                },
              },
              {
                patient_email: {
                  contains: filters.search,
                  mode: 'insensitive',
                },
              },
              {
                patient_phone: {
                  contains: filters.search,
                  mode: 'insensitive',
                },
              },
              {
                patient_cpf: {
                  contains: filters.search,
                  mode: 'insensitive',
                },
              },
            ]
          : undefined,
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
        date: new Date(appoiment.date).toISOString(),
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
