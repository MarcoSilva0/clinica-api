import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { SystemConfigService } from '../services/system-config.service';
import { SystemConfigDto } from '../domain/dto/system-config.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateSystemConfigDto } from '../domain/dto/update-system-config.dto';
import { Public } from 'src/auth/infra/decorators/public/public.decorator';
import { Roles } from 'src/auth/infra/decorators/role/role.decorator';

@ApiTags('Configuração do Sistema')
@Controller('setup')
export class SystemConfigController {
  constructor(private readonly configService: SystemConfigService) {}

  @Post('/')
  @Public()
  async setup(@Body() data: SystemConfigDto) {
    return this.configService.setupSystem(data);
  }

  @Put('/max-wait-time')
  @Roles('ADMIN')
  async update(@Body() data: UpdateSystemConfigDto) {
    return this.configService.updateSystem(data);
  }

  @Get('/status')
  @Public()
  async getStatus() {
    return this.configService.getStatus();
  }
}
