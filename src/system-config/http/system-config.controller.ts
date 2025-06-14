import { Body, Controller, Get, Post } from '@nestjs/common';
import { SystemConfigService } from '../services/system-config.service';
import { SetupDto } from '../domain/dto/system-config.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Configuração do Sistema')
@Controller('setup')
export class SystemConfigController {
  constructor(private readonly configService: SystemConfigService) {}

  @Post('/')
  async setup(@Body() data: SetupDto) {
    return this.configService.setupSystem(data);
  }

  @Get('/status')
  async getStatus() {
    return this.configService.getStatus();
  }
}
