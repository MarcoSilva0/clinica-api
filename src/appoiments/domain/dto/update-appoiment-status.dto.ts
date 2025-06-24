import { ApiProperty } from '@nestjs/swagger';
import { AppoimentsStatus } from '@prisma/client';

export class UpdateAppoimentStatusDto {
  @ApiProperty({ enumName: 'AppoimentsStatus', enum: AppoimentsStatus })
  status: AppoimentsStatus;
}
