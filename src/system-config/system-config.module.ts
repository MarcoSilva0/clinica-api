import { Body, Get, Module, Post } from '@nestjs/common';
import { SystemConfigController } from './http/system-config.controller';
import { SystemConfigService } from './services/system-config.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import SystemConfigRepository from './infra/system-config.repository';
import { MailerModule } from 'src/mailer/mailer.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/infra/guard/auth/auth.guard';
import { RolesGuard } from 'src/auth/infra/guard/role/role.guard';

@Module({
  imports: [PrismaModule, UsersModule, MailerModule],
  controllers: [SystemConfigController],
  providers: [
    SystemConfigService,
    SystemConfigRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class SystemConfigModule {}
