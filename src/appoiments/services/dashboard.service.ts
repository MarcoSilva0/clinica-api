import { Injectable } from '@nestjs/common';
import AppoimentsRepository from '../infra/appoiments.repository';
import { DashboardFiltersDto } from '../domain/dto/dashboard-filters.dto';
import {
  DashboardDataResponse,
  WaitingPatient,
  FinishedAppointment,
  ExamTypeAverageTime,
} from '../domain/dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly appoimentsRepository: AppoimentsRepository) {}

  async getDashboardData(
    filters: DashboardFiltersDto,
  ): Promise<DashboardDataResponse> {
    const rawData = await this.appoimentsRepository.getDashboardData(
      filters.examTypeIds,
    );

    const waitingPatients = this.calculateWaitingTimes(
      rawData.confirmed,
      rawData.averageTimes,
      rawData.inProgress,
    );

    const finishedAppointments = this.processFinishedAppointments(
      rawData.finished,
    );

    return {
      confirmed: waitingPatients,
      finished: finishedAppointments,
      inProgress: rawData.inProgress,
      averageTimes: rawData.averageTimes,
      currentDateTime: rawData.currentDateTime,
    };
  }

  private calculateWaitingTimes(
    confirmedAppoiments: any[],
    averageTimes: ExamTypeAverageTime[],
    inProgressAppoiments: any[],
  ): WaitingPatient[] {
    const now = new Date();

    const appointmentsByExamType = this.groupByExamType(confirmedAppoiments);
    const inProgressByExamType = this.groupByExamType(inProgressAppoiments);

    const waitingPatients: WaitingPatient[] = [];

    Object.keys(appointmentsByExamType).forEach((examTypeId) => {
      const appointments = appointmentsByExamType[examTypeId];
      const inProgress = inProgressByExamType[examTypeId] || [];
      const averageTime = averageTimes.find(
        (avg) => avg.examTypeId === examTypeId,
      );

      if (!averageTime) return;

      const estimatedDurationMinutes =
        averageTime.averageTimeMinutes > 0
          ? averageTime.averageTimeMinutes
          : this.parseDefaultDuration(averageTime.defaultDuration);

      appointments.forEach((appointment, index) => {
        const positionInQueue = index + 1;

        const inProgressRemainingTime =
          inProgress.length * (estimatedDurationMinutes / 2);
        const queueWaitTime = index * estimatedDurationMinutes;
        const estimatedWaitTimeMinutes = Math.round(
          inProgressRemainingTime + queueWaitTime,
        );

        waitingPatients.push({
          id: appointment.id,
          patient_name: appointment.patient_name,
          patient_cpf: appointment.patient_cpf,
          date_start: appointment.date_start,
          examsType: appointment.examsType,
          estimatedWaitTimeMinutes,
          positionInQueue,
        });
      });
    });

    return waitingPatients.sort(
      (a, b) =>
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime(),
    );
  }

  private processFinishedAppointments(
    finishedAppoiments: any[],
  ): FinishedAppointment[] {
    return finishedAppoiments.map((appointment) => {
      const startTime = new Date(appointment.date_start).getTime();
      const endTime = new Date(appointment.finishedDate).getTime();
      const actualDurationMinutes = Math.round(
        (endTime - startTime) / (1000 * 60),
      );

      return {
        id: appointment.id,
        patient_name: appointment.patient_name,
        patient_cpf: appointment.patient_cpf,
        date_start: appointment.date_start,
        finishedDate: appointment.finishedDate,
        examsType: appointment.examsType,
        actualDurationMinutes,
      };
    });
  }

  private groupByExamType(appointments: any[]): Record<string, any[]> {
    return appointments.reduce((groups, appointment) => {
      const examTypeId = appointment.examsTypeId;
      if (!groups[examTypeId]) {
        groups[examTypeId] = [];
      }
      groups[examTypeId].push(appointment);
      return groups;
    }, {});
  }

  private parseDefaultDuration(defaultDuration: string): number {
    const duration = defaultDuration.toLowerCase();

    if (duration.includes('hora')) {
      const hours = parseInt(duration.match(/\d+/)?.[0] || '1');
      return hours * 60;
    } else if (duration.includes('minuto')) {
      const minutes = parseInt(duration.match(/\d+/)?.[0] || '30');
      return minutes;
    }

    const number = parseInt(duration.match(/\d+/)?.[0] || '30');
    return number;
  }

  /**
   * Método auxiliar para obter apenas os tipos de exame ativos
   */
  async getActiveExamTypes() {
    return this.appoimentsRepository.getTodayExamTypesAverageTime();
  }

  /**
   * Método para obter estatísticas resumidas por tipo de exame
   */
  async getExamTypesSummary(filters: DashboardFiltersDto) {
    const data = await this.getDashboardData(filters);

    const summary = data.averageTimes.map((examType) => {
      const confirmedCount = data.confirmed.filter(
        (appointment) => appointment.examsType.id === examType.examTypeId,
      ).length;

      const finishedCount = data.finished.filter(
        (appointment) => appointment.examsType.id === examType.examTypeId,
      ).length;

      const inProgressCount = data.inProgress.filter(
        (appointment) => appointment.examsTypeId === examType.examTypeId,
      ).length;

      return {
        examType,
        stats: {
          confirmed: confirmedCount,
          finished: finishedCount,
          inProgress: inProgressCount,
          total: confirmedCount + finishedCount + inProgressCount,
        },
      };
    });

    return summary;
  }
}
