import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthenticationDto } from '../domain/dto/authentication.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../infra/guard/auth/auth.guard';
import { Public } from '../infra/decorators/public/public.decorator';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @Public()
  async login(@Body() body: AuthenticationDto) {
    return this.authService.validateUser(body.email, body.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
