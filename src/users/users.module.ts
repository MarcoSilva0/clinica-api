import { Module } from '@nestjs/common';
import { UsersController } from './http/users.controller';
import { UsersService } from './service/users.service';
import UsersRepository from './infra/users.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/infra/guard/auth/auth.guard';
import { MulterModule } from '@nestjs/platform-express';
import multerConfig from 'src/upload/multer-config';
import { UploadModule } from 'src/upload/upload.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { RolesGuard } from 'src/auth/infra/guard/role/role.guard';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register(
      multerConfig({ customPath: 'user', customFolder: 'user' }),
    ),
    UploadModule,
    MailerModule,
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    UsersService,
    UsersRepository,
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
