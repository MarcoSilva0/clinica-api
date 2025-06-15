import { ApiProperty } from '@nestjs/swagger';

export class UpdateSystemConfigDto {
  @ApiProperty()
  maxWaitTimeMin: number;
}
