import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import AppoimentsRepository from '../infra/appoiments.repository';
import { CreateAppoimentDto } from '../domain/dto/create-appoiment.dto';
import { ListAllAppoimentsQueryDto } from '../domain/dto/list-all-appoiments.dto';
import { MailerService } from 'src/mailer/services/mailer.service';
import { ExamsTypeService } from 'src/exam-types/service/exams-type.service';
import * as moment from 'moment';
import { AppoimentsStatus } from '@prisma/client';
import { UpdateAppoimentStatusDto } from '../domain/dto/update-appoiment-status.dto';
import { SystemConfigService } from 'src/system-config/services/system-config.service';
import { add, isBefore } from 'date-fns';

@Injectable()
export class AppoimentsService {
  constructor(
    private appoimentsRepository: AppoimentsRepository,
    private readonly mailerService: MailerService,
    private readonly configService: SystemConfigService,
    @Inject(forwardRef(() => ExamsTypeService))
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

    const appoimentDate = moment(appoimentCreated.date_start).format(
      'DD/MM/YYYY',
    );
    const appoimentHour = moment(appoiment.date_start).format('HH:mm');

    const message = `
        <h1>Agendamento Confirmado</h1>
        <p>Olá ${appoiment.patient_name},</p>
        <p>Seu agendamento foi confirmado com sucesso!</p>
        <p>Data: ${appoimentDate}</p>
        <p>Horário: ${appoimentHour}</p>
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

  async changeStatus(
    id: string,
    data: UpdateAppoimentStatusDto,
  ): Promise<any | null> {
    const appoiment = await this.appoimentsRepository.findOne(id);
    if (!appoiment) {
      throw new BadRequestException('Agendamento não encontrado');
    }
    if (appoiment?.status === AppoimentsStatus.NO_SHOW) {
      throw new BadRequestException(
        'Não é possível alterar o status de um agendamento que já foi marcado como "Ausente"',
      );
    }

    if (data.status === AppoimentsStatus.FINISIHED) {
      if (!data.finishedTime) {
        throw new BadRequestException('Hora de término é obrigatória');
      }
      if (
        isBefore(new Date(data.finishedTime), new Date(appoiment.date_start))
      ) {
        throw new BadRequestException(
          'Hora de término não pode ser anterior ao horário de início do agendamento',
        );
      }

      await this.appoimentsRepository.finishAppoiment(id, data.finishedTime);

      await this.mailerService.sendEmail(
        appoiment.patient_email,
        'Agendamento Finalizado',
        `<h1>Agendamento Finalizado</h1>
        <p>Olá ${appoiment.patient_name},</p>
        <p>Seu agendamento foi finalizado com sucesso.</p>
        `,
      );
    }

    if (data.status === AppoimentsStatus.CANCELED) {
      if (!data.details) {
        throw new BadRequestException('Motivo do cancelamento é obrigatório');
      }
      await this.appoimentsRepository.cancelAppoiment(
        id,
        new Date(),
        data.details,
      );

      await this.mailerService.sendEmail(
        appoiment.patient_email,
        'Cancelamento de Agendamento',
        `<h1>Agendamento Cancelado</h1>
        <p>Olá ${appoiment.patient_name},</p>
        <p>Seu agendamento foi cancelado.</p> 
        `,
      );
    }

    if (data.status === AppoimentsStatus.NO_SHOW) {
      const maxWaitTimeMin = await this.configService.getMaxWaitTimeMin();
      if (maxWaitTimeMin.maxWaitTimeMin === null) {
        throw new BadRequestException('Tempo máximo de espera não configurado');
      }

      const maxWaitTimeMinToThisAppoiment = add(new Date(), {
        minutes: maxWaitTimeMin.maxWaitTimeMin * 2 || 0,
      });

      if (
        isBefore(new Date(appoiment.date_start), maxWaitTimeMinToThisAppoiment)
      ) {
        throw new BadRequestException(
          'Não é possível atualizar para "Ausente" antes do tempo máximo de espera',
        );
      }

      await this.appoimentsRepository.noShowAppoiment(id, new Date());

      await this.mailerService.sendEmail(
        appoiment.patient_email,
        'Ausência no Agendamento',
        `<h1>Ausência Confirmada</h1>
        <p>Olá ${appoiment.patient_name},</p>
        <p>Seu agendamento foi cancelado devido a ausência.</p>
        `,
      );
    }

    return this.appoimentsRepository.changeStatus(id, data);
  }

  async findAllAppoimentsByExamTypeId(examTypeId: string): Promise<number> {
    return this.appoimentsRepository.findAllAppoimentsByExamTypeId(examTypeId);
  }

  async confirmPatientTodayAppoiments(patientCpf: string): Promise<any[]> {
    return this.appoimentsRepository.confirmPatientTodayAppoiments(patientCpf);
  }
}
