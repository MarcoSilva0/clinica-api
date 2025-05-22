import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  photo: string;

  @ApiProperty({ enumName: 'Role', enum: Role })
  role: Role;

  @ApiProperty()
  active: boolean;
}
