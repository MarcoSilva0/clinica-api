import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExamsTypeModule } from './exams-type/exams-type.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, AuthModule, UsersModule, ExamsTypeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
