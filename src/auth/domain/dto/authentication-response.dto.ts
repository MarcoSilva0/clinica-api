import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class AuthenticationResponseDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enumName: 'Role', enum: Role })
  role: Role;

  @ApiProperty()
  expiresOn: number;

  @ApiProperty()
  token: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  tempPassword?: boolean;

  @ApiProperty()
  photo?: string | null;
}
