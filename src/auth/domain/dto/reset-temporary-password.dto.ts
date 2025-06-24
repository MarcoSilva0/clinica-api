import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class ResetTemporaryPasswordDto {
  email?: string;
  
  @ApiProperty()
  temporaryPassword: string;

  @ApiProperty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  newPassword: string;

  @ApiProperty()
  confirmNewPassword: string;
}
