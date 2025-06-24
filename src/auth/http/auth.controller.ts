import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthenticationDto } from '../domain/dto/authentication.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../infra/guard/auth/auth.guard';
import { Public } from '../infra/decorators/public/public.decorator';
import { AuthenticationResponseDto } from '../domain/dto/authentication-response.dto';
import { ProfileResponseDto } from '../domain/dto/profile-response.dto';
import { RequestResetPasswordDto } from '../domain/dto/request-reset-password.dto';
import { ResetPasswordDto } from '../domain/dto/reset-password.dto';
import { ResetTemporaryPasswordDto } from '../domain/dto/reset-temporary-password.dto';
import { User } from 'src/core/decorators/user.decorator';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthenticationResponseDto,
  })
  async login(
    @Body() body: AuthenticationDto,
  ): Promise<AuthenticationResponseDto> {
    return this.authService.validateUser(body.email, body.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário',
    type: ProfileResponseDto,
  })
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('request-password-reset')
  async requestReset(@Body() dto: RequestResetPasswordDto) {
    await this.authService.requestPasswordReset(dto.email);
    return { message: 'Código enviado por e-mail' };
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }
    await this.authService.resetPassword(dto.token, dto.email, dto.password);
    return { message: 'Senha redefinida com sucesso' };
  }

  @Post('reset-temporary-password')
  async resetTemporaryPassword(
    @Body() data: ResetTemporaryPasswordDto,
    @User('email') email: string,
  ) {
    return await this.authService.resetTemporaryPassword({...data, email});
  }
}
