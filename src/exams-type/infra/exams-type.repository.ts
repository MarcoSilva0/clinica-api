import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamTypeDto } from '../domain/dto/create-exam-type';

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
}
