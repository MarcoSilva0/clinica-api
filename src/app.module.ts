import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExamsTypeModule } from './exams-type/exams-type.module';
import { AppoimentsModule } from './appoiments/appoiments.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    ExamsTypeModule,
    AppoimentsModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
