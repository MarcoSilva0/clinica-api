import { Module } from '@nestjs/common';
import { ExamsTypeController } from './http/exams-type.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/infra/guard/auth/auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExamsTypeService } from './service/exams-type.service';
import examsTypeRepository from './infra/exams-type.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    ExamsTypeService,
    examsTypeRepository,
  ],
  controllers: [ExamsTypeController],
})
export class ExamsTypeModule {}
