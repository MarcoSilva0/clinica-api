import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExamType } from '../domain/entities/exam-type.entity';
import { CreateExamTypeDto } from '../domain/dto/create-exam-type.dto';
import { ExamsType } from '@prisma/client';
import { ExamsTypeService } from '../service/exams-type.service';
import { PaginationResponse } from 'src/core/utils/paginationResponse';
import { ListAllExamsTypeQueryDto } from '../domain/dto/list-all-exams-type-query.dto';
import { ApiPaginatedResponse } from 'src/core/decorators/paginated-response.decorator';

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

  @Get('/')
  @ApiPaginatedResponse(ExamType)
  async listAll(
    @Query() filters: ListAllExamsTypeQueryDto,
  ): Promise<PaginationResponse<ExamType>> {
    return await this.examTypeService.findAll(filters);
  }
}
