import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/service/users.service';
import { AuthenticationResponseDto } from '../domain/dto/authentication-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticationResponseDto> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || (!user.password && password)) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    const expiresOn = await this.jwtService.decode(access_token).exp;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      expiresOn,
      token: access_token,
    };
  }
}
