import { Injectable } from '@nestjs/common';
import AppoimentsRepository from '../infra/appoiments.repository';
import { CreateAppoimentDto } from '../domain/dto/create-appoiment.dto';
import { ListAllAppoimentsQueryDto } from '../domain/dto/list-all-appoiments.dto';

@Injectable()
export class AppoimentsService {
  constructor(private appoimentsRepository: AppoimentsRepository) {}

  async createAppoiment(appoiment: CreateAppoimentDto): Promise<any> {
    return this.appoimentsRepository.createAppoiment(appoiment);
  }

  async findAll(filters: ListAllAppoimentsQueryDto): Promise<any> {
    return this.appoimentsRepository.findAll(filters);
  }

  async findOne(id: string): Promise<any | null> {
    return this.appoimentsRepository.findOne(id);
  }

  async update(id: string, appoiment: any): Promise<any | null> {
    return this.appoimentsRepository.update(id, appoiment);
  }

  async changeStatus(id: string, status: { status: any }): Promise<any | null> {
    return this.appoimentsRepository.changeStatus(id, status);
  }
}
