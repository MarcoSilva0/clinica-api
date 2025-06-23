import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ enumName: 'Role', enum: Role })
  role: Role;

  @ApiProperty()
  active: boolean;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  photo?: Express.Multer.File;

  @ApiProperty()
  birth_date: string;
}
