import { Controller, Get, Patch, Post, Put } from '@nestjs/common';
import { AppoimentsService } from '../services/appoiments.service';
import { PaginationResponse } from 'src/core/utils/paginationResponse';
import { ApiPaginatedResponse } from 'src/core/decorators/paginated-response.decorator';
import { AppoimentsEntity } from '../domain/entities/appoiments.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Agendamentos')
@Controller('appoiments')
export class AppoimentsController {
  constructor(private appoimentsService: AppoimentsService) {}

  @Post()
  async createAppoiment(appoiment: any): Promise<any> {
    return this.appoimentsService.createAppoiment(appoiment);
  }

  @Get()
  @ApiPaginatedResponse(AppoimentsEntity)
  async findAll(): Promise<PaginationResponse<AppoimentsEntity>> {
    return this.appoimentsService.findAll();
  }

  @Get(':id')
  async findOne(id: string): Promise<any | null> {
    return this.appoimentsService.findOne(id);
  }

  @Put(':id')
  async update(id: string, appoiment: any): Promise<any | null> {
    return this.appoimentsService.update(id, appoiment);
  }

  @Patch(':id/status')
  async changeStatus(id: string, status: { status: any }): Promise<any | null> {
    return this.appoimentsService.changeStatus(id, status);
  }
}
