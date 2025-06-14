import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExamTypesModule } from './exam-types/exam-types.module';
import { AppoimentsModule } from './appoiments/appoiments.module';
import { UploadModule } from './upload/upload.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    ExamTypesModule,
    AppoimentsModule,
    UploadModule,
    MailerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
