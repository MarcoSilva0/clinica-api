import { Injectable } from '@nestjs/common';
import { CreateExamTypeDto } from '../domain/dto/create-exam-type.dto';
import { ExamTypes } from '@prisma/client';
import { ExamsTypeRepository } from '../infra/exams-type.repository';
import { PaginationResponse } from 'src/core/utils/paginationResponse';
import { AppoimentsService } from 'src/appoiments/services/appoiments.service';

@Injectable()
export class ExamsTypeService {
  constructor(
    private examsTypeRepository: ExamsTypeRepository,
    private readonly appoimentService: AppoimentsService,
  ) {}

  async createExamType(examType: CreateExamTypeDto): Promise<ExamTypes> {
    return this.examsTypeRepository.createExamType(examType);
  }

  async findAll(filters: any): Promise<PaginationResponse<any>> {
    return await this.examsTypeRepository.findAll(filters);
  }

  async remove(id: string) {
    const appoimentsWithExamType =
      await this.appoimentService.findAllAppoimentsByExamTypeId(id);

    if (appoimentsWithExamType > 0) {
      throw new Error(
        'Não é possível excluir este tipo de exame, pois existem agendamentos associados a ele.',
      );
    }
    return await this.examsTypeRepository.remove(id);
  }

  async findOne(id: string): Promise<ExamTypes | null> {
    return await this.examsTypeRepository.findOne(id);
  }

  async update(
    id: string,
    examType: CreateExamTypeDto,
  ): Promise<ExamTypes | null> {
    return await this.examsTypeRepository.update(id, examType);
  }

  async changeActiveStatus(
    id: string,
    status: { status: boolean },
  ): Promise<ExamTypes | null> {
    return await this.examsTypeRepository.changeActiveStatus(id, status);
  }
}
