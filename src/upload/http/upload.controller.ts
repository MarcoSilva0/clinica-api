import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { UPLOAD_PATH } from 'src/core/constants';

@Controller('upload')
export class UploadController {
  @Get(':path')
  viewImageByPath(@Param('path') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: UPLOAD_PATH });
  }

  @Get(':folder/:path')
  viewImage(
    @Param('folder') folder: string,
    @Param('path') image: string,
    @Res() res: Response,
  ) {
    return res.sendFile(folder + '/' + image, { root: UPLOAD_PATH });
  }
}
