import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { DashboardRepository } from '../infra/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getDashboardChartData(role: Role): Promise<any> {
    console.log('Dashboard accessed by user:', role);
    if (role === Role.ADMIN) {
      return this.dashboardRepository.getAdminDashboardCounts();
    }
    if (role === Role.SECRETARIA) {
      return this.dashboardRepository.getSecretaryDashboardCounts();
    }
  }
}
