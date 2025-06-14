import { ApiProperty } from '@nestjs/swagger';

export class ExamType {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  defaultDuration: string;

  @ApiProperty()
  preparationInstruction: string;

  @ApiProperty()
  active: Boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
