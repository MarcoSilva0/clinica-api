import { ApiProperty } from '@nestjs/swagger';
import { AppoimentsStatus } from '@prisma/client';

export class UpdateAppoimentStatusDto {
  @ApiProperty({ enumName: 'AppoimentsStatus', enum: AppoimentsStatus })
  status: AppoimentsStatus;

  @ApiProperty({ required: false })
  details?: string;

  @ApiProperty({ required: false })
  finishedTime?: Date;
}
