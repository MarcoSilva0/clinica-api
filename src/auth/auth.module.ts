import { Module } from '@nestjs/common';
import { AuthController } from './http/auth.controller';
import { AuthService } from './service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { MailerModule } from 'src/mailer/mailer.module';
import AuthRepository from './infra/auth.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: 7200000 },
    }),
    UsersModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
