import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamTypeDto } from '../domain/dto/create-exam-type.dto';
import {
  mountPagination,
  PaginationResponse,
} from 'src/core/utils/paginationResponse';
import { ExamsType } from '@prisma/client';
import { ListAllExamsTypeQueryDto } from '../domain/dto/list-all-exams-type-query.dto';

@Injectable()
export default class examsTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createExamType(examType: CreateExamTypeDto) {
    return this.prisma.examsType.create({
      data: {
        ...examType,
        active: true,
      },
    });
  }

  async findAll(
    filters: ListAllExamsTypeQueryDto,
  ): Promise<PaginationResponse<ExamsType>> {
    const { page, pageSize, skip, take } = mountPagination({
      page: filters.page,
      pageSize: filters.pageSize,
    });

    const totalExamsType = await this.prisma.examsType.count();

    const examsTypes = await this.prisma.examsType.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: examsTypes,
      currentPage: page,
      totalPages: Math.ceil(totalExamsType / pageSize) ?? 1,
      totalItems: totalExamsType ?? 0,
    };
  }

  async remove(id: string) {
    return this.prisma.examsType.delete({
      where: {
        id,
      },
    });
  }

  async findOne(id: string): Promise<ExamsType | null> {
    return this.prisma.examsType.findFirst({
      where: {
        id,
      },
    });
  }
}
