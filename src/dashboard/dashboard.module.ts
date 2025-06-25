import { Module } from '@nestjs/common';
import { DashboardController } from './http/dashboard.controller';
import { DashboardService } from './service/dashboard.service';
import { DashboardRepository } from './infra/dashboard.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}
