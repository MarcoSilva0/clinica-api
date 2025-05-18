import { Injectable } from '@nestjs/common';
import { CreateExamTypeDto } from '../domain/dto/create-exam-type';
import { ExamsType } from '@prisma/client';
import examsTypeRepository from '../infra/exams-type.repository';

@Injectable()
export class ExamsTypeService {
  constructor(private examsTypeRepository: examsTypeRepository) {}

  async createExamType(examType: CreateExamTypeDto): Promise<ExamsType> {
    return this.examsTypeRepository.createExamType(examType);
  }
}
