import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationResponseDto } from 'src/auth/domain/dto/authentication-response.dto';
import { User } from 'src/core/decorators/user.decorator';
import { DashboardService } from '../service/dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get()
  async getDashboardChart(
    @User() user: AuthenticationResponseDto,
  ): Promise<any> {
    return await this.dashboardService.getDashboardChartData(user.role);
  }
}
