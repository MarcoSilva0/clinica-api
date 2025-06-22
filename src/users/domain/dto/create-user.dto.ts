import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.role !== Role.SECRETARIA)
  @IsString()
  @IsNotEmpty()
  password?: string;

  @ApiProperty({ enumName: 'Role', enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @ApiProperty()
  birth_date: string;
}
