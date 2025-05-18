import { Injectable } from '@nestjs/common';
import { CreateExamTypeDto } from '../domain/dto/create-exam-type.dto';
import { ExamsType } from '@prisma/client';
import examsTypeRepository from '../infra/exams-type.repository';
import { PaginationResponse } from 'src/core/utils/paginationResponse';

@Injectable()
export class ExamsTypeService {
  constructor(private examsTypeRepository: examsTypeRepository) {}

  async createExamType(examType: CreateExamTypeDto): Promise<ExamsType> {
    return this.examsTypeRepository.createExamType(examType);
  }

  async findAll(filters: any): Promise<PaginationResponse<any>> {
    return await this.examsTypeRepository.findAll(filters);
  }

  async remove(id: string) {
    return await this.examsTypeRepository.remove(id);
  }

  async findOne(id: string): Promise<ExamsType | null> {
    return await this.examsTypeRepository.findOne(id);
  }
}
