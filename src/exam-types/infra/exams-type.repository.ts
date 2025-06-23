import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import AppoimentsRepository from 'src/appoiments/infra/appoiments.repository';
import { CreateExamTypeDto } from '../domain/dto/create-exam-type.dto';
import {
  mountPagination,
  PaginationResponse,
} from 'src/core/utils/paginationResponse';
import { ExamTypes } from '@prisma/client';
import { ListAllExamsTypeQueryDto } from '../domain/dto/list-all-exams-type-query.dto';

@Injectable()
export class ExamsTypeRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly appoimentsRepository: AppoimentsRepository,
  ) {}

  async createExamType(examType: CreateExamTypeDto) {
    return this.prisma.examTypes.create({
      data: {
        ...examType,
        active: true,
      },
    });
  }

  async findAll(
    filters: ListAllExamsTypeQueryDto,
  ): Promise<PaginationResponse<ExamTypes>> {
    const { page, pageSize, skip, take } = mountPagination({
      page: filters.page,
      pageSize: filters.pageSize,
    });

    const totalExamsType = await this.prisma.examTypes.count();

    const examsTypes = await this.prisma.examTypes.findMany({
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
    const linkedAppointments =
      await this.appoimentsRepository.findByExamTypeId(id);

    if (linkedAppointments.length > 0) {
      throw new Error(
        'Este tipo de exame está vinculado a agendamentos e não pode ser excluído.',
      );
    }

    return this.prisma.examTypes.delete({
      where: {
        id,
      },
    });
  }

  async findOne(id: string): Promise<ExamTypes | null> {
    return this.prisma.examTypes.findFirst({
      where: {
        id,
      },
    });
  }

  async update(id: string, examType: CreateExamTypeDto) {
    return this.prisma.examTypes.update({
      where: {
        id,
      },
      data: {
        ...examType,
      },
    });
  }

  async changeActiveStatus(id: string, data: { status: boolean }) {
    return this.prisma.examTypes.update({
      where: {
        id,
      },
      data: {
        active: data.status,
      },
    });
  }
}
