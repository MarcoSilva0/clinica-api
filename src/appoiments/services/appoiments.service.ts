import { BadRequestException, Injectable } from '@nestjs/common';
import AppoimentsRepository from '../infra/appoiments.repository';
import { CreateAppoimentDto } from '../domain/dto/create-appoiment.dto';
import { ListAllAppoimentsQueryDto } from '../domain/dto/list-all-appoiments.dto';
import { MailerService } from 'src/mailer/services/mailer.service';
import { ExamsTypeService } from 'src/exam-types/service/exams-type.service';

@Injectable()
export class AppoimentsService {
  constructor(
    private appoimentsRepository: AppoimentsRepository,
    private readonly mailerService: MailerService,
    private readonly examTypesService: ExamsTypeService,
  ) {}

  async createAppoiment(appoiment: CreateAppoimentDto): Promise<any> {
    const appoimentCreated =
      await this.appoimentsRepository.createAppoiment(appoiment);

    if (!appoimentCreated) {
      throw new BadRequestException('Erro ao criar agendamento');
    }

    const examType = await this.examTypesService.findOne(
      appoimentCreated.examsTypeId,
    );

    const message = `
        <h1>Agendamento Confirmado</h1>
        <p>Olá ${appoiment.patient_name},</p>
        <p>Seu agendamento foi confirmado com sucesso!</p>
        <p>Data: ${appoiment.date_start}</p>
        <p>Horário: ${appoiment.date_start}</p>
        <p>Exame: ${examType?.name}</p>
        <br />
        <p><b>Instruções:</b></p>
        <p>${examType?.preparationInstruction}</p>
        <br />
      `;

    await this.mailerService.sendEmail(
      appoimentCreated.patient_email,
      'Confirmação de Agendamento',
      message,
    );

    return appoimentCreated;
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

  async findAllAppoimentsByExamTypeId(examTypeId: string): Promise<number> {
    return this.appoimentsRepository.findAllAppoimentsByExamTypeId(examTypeId);
  }

  async confirmPatientTodayAppoiments(patientCpf: string): Promise<any[]> {
    return this.appoimentsRepository.confirmPatientTodayAppoiments(patientCpf);
  }
}
