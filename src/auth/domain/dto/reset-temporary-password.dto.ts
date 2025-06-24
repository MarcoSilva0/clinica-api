import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class ResetTemporaryPasswordDto {
  email?: string;
  
  @ApiProperty()
  temporaryPassword: string;

  @ApiProperty()
  newPassword: string;

  @ApiProperty()
  confirmNewPassword: string;
}
