import { ApiProperty } from '@nestjs/swagger';

export class confirmChangeEmailDto {
  @ApiProperty()
  code: string;
}
