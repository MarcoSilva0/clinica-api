import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AppoimentsService } from '../services/appoiments.service';
import { PaginationResponse } from 'src/core/utils/paginationResponse';
import { ApiPaginatedResponse } from 'src/core/decorators/paginated-response.decorator';
import { AppoimentsEntity } from '../domain/entities/appoiments.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAppoimentDto } from '../domain/dto/create-appoiment.dto';
import { Appoiments } from '@prisma/client';
import { ListAllAppoimentsQueryDto } from '../domain/dto/list-all-appoiments.dto';
import { Public } from 'src/auth/infra/decorators/public/public.decorator';
import { UpdateAppoimentStatusDto } from '../domain/dto/update-appoiment-status.dto';

@ApiTags('Agendamentos')
@Controller('appoiments')
export class AppoimentsController {
  constructor(private appoimentsService: AppoimentsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Agendamento criado com sucesso',
    type: AppoimentsEntity,
  })
  async createAppoiment(
    @Body() appoiment: CreateAppoimentDto,
  ): Promise<Appoiments> {
    return this.appoimentsService.createAppoiment(appoiment);
  }

  @Public()
  @Get()
  @ApiPaginatedResponse(AppoimentsEntity)
  async findAll(
    @Query() filters: ListAllAppoimentsQueryDto,
  ): Promise<PaginationResponse<AppoimentsEntity>> {
    return this.appoimentsService.findAll(filters);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Agendamento encontrado com sucesso',
    type: AppoimentsEntity,
  })
  async findOne(@Param('id') id: string): Promise<any | null> {
    return this.appoimentsService.findOne(id);
  }

  @Public()
  @Post(':cpf/confirmed')
  @ApiResponse({
    status: 200,
    description: 'Lista de agendamentos do paciente encontrada com sucesso',
    type: AppoimentsEntity,
    isArray: true,
  })
  async findAllAppoimentsByPatientCpf(
    @Param('cpf') patientCpf: string,
  ): Promise<Appoiments[]> {
    return this.appoimentsService.confirmPatientTodayAppoiments(patientCpf);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() appoiment: CreateAppoimentDto,
  ): Promise<any | null> {
    return this.appoimentsService.update(id, appoiment);
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body() data: UpdateAppoimentStatusDto,
  ): Promise<any | null> {
    return this.appoimentsService.changeStatus(id, data);
  }
}
