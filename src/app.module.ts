import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExamTypesModule } from './exam-types/exam-types.module';
import { AppoimentsModule } from './appoiments/appoiments.module';
import { UploadModule } from './upload/upload.module';
import { MailerModule } from './mailer/mailer.module';
import { SystemConfigModule } from './system-config/system-config.module';
import { CheckInitializedMiddleware } from './core/middlewares/check-initialized.middleware';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthController } from './health.controller';

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
    SystemConfigModule,
    DashboardModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckInitializedMiddleware).forRoutes('*');
  }
}
