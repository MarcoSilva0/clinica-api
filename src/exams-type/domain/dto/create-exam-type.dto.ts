import { ApiProperty } from '@nestjs/swagger';

export class CreateExamTypeDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  defautlDuration: string;

  @ApiProperty()
  preparationInstruction: string;
}
