import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthenticationDto } from '../domain/dto/authentication.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../infra/guard/auth/auth.guard';
import { Public } from '../infra/decorators/public/public.decorator';
import { AuthenticationResponseDto } from '../domain/dto/authentication-response.dto';
import { ProfileResponseDto } from '../domain/dto/profile-response.dto';

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
}
