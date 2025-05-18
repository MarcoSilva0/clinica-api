import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExamType } from '../domain/entities/exam-type.entity';
import { CreateExamTypeDto } from '../domain/dto/create-exam-type';
import { ExamsType } from '@prisma/client';
import { ExamsTypeService } from '../service/exams-type.service';

@ApiTags('Tipos de Exames')
@Controller('exams-type')
export class ExamsTypeController {
    constructor(private examTypeService: ExamsTypeService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Type of exam created successfully',
    type: ExamType,
  })
  async create(@Body() examType: CreateExamTypeDto): Promise<ExamsType> {
    return await this.examTypeService.createExamType(examType);
  }
}
