import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  token: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  confirmPassword: string;
}
