import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { DashboardFiltersDto } from '../domain/dto/dashboard-filters.dto';
import { Public } from 'src/auth/infra/decorators/public/public.decorator';

@Controller('dashboard')
@Public() // Permite acesso sem autenticação para toda a dashboard
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Endpoint para obter dados da dashboard em tempo real
   * Pode ser acessado sem autenticação para exibição em painéis públicos
   */
  @Get('real-time')
  async getRealTimeDashboard(@Query() filters: DashboardFiltersDto) {
    return this.dashboardService.getDashboardData(filters);
  }

  /**
   * Endpoint para obter resumo estatístico por tipo de exame
   */
  @Get('exam-types-summary')
  async getExamTypesSummary(@Query() filters: DashboardFiltersDto) {
    return this.dashboardService.getExamTypesSummary(filters);
  }

  /**
   * Endpoint para obter lista de tipos de exame ativos
   * Útil para configurar filtros na interface
   */
  @Get('exam-types')
  async getActiveExamTypes() {
    return this.dashboardService.getActiveExamTypes();
  }

  /**
   * Endpoint simplificado que retorna apenas a fila de espera
   */
  @Get('waiting-queue')
  async getWaitingQueue(@Query() filters: DashboardFiltersDto) {
    const data = await this.dashboardService.getDashboardData(filters);
    return {
      waitingPatients: data.confirmed,
      currentDateTime: data.currentDateTime,
      averageTimes: data.averageTimes,
    };
  }

  /**
   * Endpoint para obter apenas atendimentos finalizados do dia
   */
  @Get('finished-appointments')
  async getFinishedAppointments(@Query() filters: DashboardFiltersDto) {
    const data = await this.dashboardService.getDashboardData(filters);
    return {
      finishedAppointments: data.finished,
      currentDateTime: data.currentDateTime,
    };
  }

  /**
   * Endpoint para obter informações de tempo real (horário atual e estatísticas básicas)
   */
  @Get('time-info')
  async getTimeInfo(@Query() filters: DashboardFiltersDto) {
    const data = await this.dashboardService.getDashboardData(filters);
    return {
      currentDateTime: data.currentDateTime,
      totalWaiting: data.confirmed.length,
      totalFinished: data.finished.length,
      totalInProgress: data.inProgress.length,
      averageTimes: data.averageTimes,
    };
  }
}
