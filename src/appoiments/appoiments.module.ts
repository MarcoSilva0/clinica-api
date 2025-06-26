import { forwardRef, Module } from '@nestjs/common';
import { AppoimentsController } from './http/appoiments.controller';
import { DashboardController } from './http/dashboard.controller';
import { AppoimentsService } from './services/appoiments.service';
import { DashboardService } from './services/dashboard.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthGuard } from 'src/auth/infra/guard/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import AppoimentsRepository from './infra/appoiments.repository';
import { MailerModule } from 'src/mailer/mailer.module';
import { ExamTypesModule } from 'src/exam-types/exam-types.module';
import { SystemConfigModule } from 'src/system-config/system-config.module';

@Module({
  imports: [
    PrismaModule,
    MailerModule,
    SystemConfigModule,
    forwardRef(() => ExamTypesModule),
  ],
  controllers: [AppoimentsController, DashboardController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppoimentsService,
    DashboardService,
    AppoimentsRepository,
  ],
  exports: [AppoimentsService, DashboardService, AppoimentsRepository],
})
export class AppoimentsModule {}
