import { ApiProperty } from '@nestjs/swagger';
import { AppoimentsStatus } from '@prisma/client';

export class CreateAppoimentDto {
  @ApiProperty()
  patient_cpf: string;

  @ApiProperty()
  patient_name: string;

  @ApiProperty()
  patient_phone: string;

  @ApiProperty()
  patient_email: string;

  @ApiProperty()
  patient_birth_date: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  examsTypeId: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ enumName: 'AppoimentsStatus', enum: AppoimentsStatus })
  status: AppoimentsStatus;

  @ApiProperty()
  details: string;
}
