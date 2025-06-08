import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import multerConfig from './multer-config';
import { UploadController } from './http/upload.controller';
import { UploadService } from './service/upload.service';

@Module({
  imports: [MulterModule.register(multerConfig({}))],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
