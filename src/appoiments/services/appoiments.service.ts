import { Injectable } from '@nestjs/common';
import AppoimentsRepository from '../infra/appoiments.repository';

@Injectable()
export class AppoimentsService {
  constructor(private appoimentsRepository: AppoimentsRepository) {}

  async createAppoiment(appoiment: any): Promise<any> {
    return this.appoimentsRepository.createAppoiment(appoiment);
  }

  async findAll(): Promise<any> {
    return this.appoimentsRepository.findAll();
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
