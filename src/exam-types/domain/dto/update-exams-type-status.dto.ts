import { ApiProperty } from '@nestjs/swagger';

export class UpdateExamsTypeStatusDto {
  @ApiProperty({ type: Boolean })
  status: boolean;
}
