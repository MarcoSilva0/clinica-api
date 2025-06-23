import { Module } from '@nestjs/common';
import { ExamTypesController } from './http/exam-types.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/infra/guard/auth/auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExamsTypeService } from './service/exams-type.service';
import { AppoimentsModule } from 'src/appoiments/appoiments.module';
import { ExamsTypeRepository } from './infra/exams-type.repository';

@Module({
  imports: [PrismaModule, AppoimentsModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    ExamsTypeService,
    ExamsTypeRepository,
  ],
  controllers: [ExamTypesController],
})
export class ExamTypesModule {}
