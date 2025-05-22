import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExamType } from '../domain/entities/exam-type.entity';
import { CreateExamTypeDto } from '../domain/dto/create-exam-type.dto';
import { ExamsType } from '@prisma/client';
import { ExamsTypeService } from '../service/exams-type.service';
import { PaginationResponse } from 'src/core/utils/paginationResponse';
import { ListAllExamsTypeQueryDto } from '../domain/dto/list-all-exams-type-query.dto';
import { ApiPaginatedResponse } from 'src/core/decorators/paginated-response.decorator';
import { UpdateExamsTypeStatusDto } from '../domain/dto/update-exams-type-status.dto';

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

  @Delete(':id')
  async remove(@Param('id') examTypeId: string) {
    return await this.examTypeService.remove(examTypeId);
  }

  @Put(':id')
  async update(
    @Param('id') examTypeId: string,
    @Body() examType: CreateExamTypeDto,
  ) {
    return await this.examTypeService.update(examTypeId, examType);
  }

  @Patch(':id')
  async partialUpdate(
    @Param('id') examTypeId: string,
    @Body() status: UpdateExamsTypeStatusDto,
  ) {
    return await this.examTypeService.changeActiveStatus(examTypeId, status);
  }

  @Get()
  @ApiPaginatedResponse(ExamType)
  async listAll(
    @Query() filters: ListAllExamsTypeQueryDto,
  ): Promise<PaginationResponse<ExamType>> {
    return await this.examTypeService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ExamsType | null> {
    return await this.examTypeService.findOne(id);
  }
}
