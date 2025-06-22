import { Module } from '@nestjs/common';
import { ExamTypesController } from './http/exam-types.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/infra/guard/auth/auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExamsTypeService } from './service/exams-type.service';
import examsTypeRepository from './infra/exams-type.repository';
import AppoimentsRepository from 'src/appoiments/infra/appoiments.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    ExamsTypeService,
    examsTypeRepository,
    AppoimentsRepository,
  ],
  controllers: [ExamTypesController],
})
export class ExamTypesModule {}
