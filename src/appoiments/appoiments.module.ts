import { Module } from '@nestjs/common';
import { AppoimentsController } from './http/appoiments.controller';
import { AppoimentsService } from './services/appoiments.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthGuard } from 'src/auth/infra/guard/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import AppoimentsRepository from './infra/appoiments.repository';
import { ExamTypesModule } from 'src/exam-types/exam-types.module';

@Module({
  imports: [PrismaModule],
  controllers: [AppoimentsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppoimentsService,
    AppoimentsRepository,
  ],
  exports: [AppoimentsService, AppoimentsRepository],
})
export class AppoimentsModule {}
