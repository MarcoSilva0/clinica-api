import { ApiProperty } from '@nestjs/swagger';

export class SystemConfigDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  maxWaitTimeMin: number;
}
