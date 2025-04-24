import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
