import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/auth/infra/decorators/public/public.decorator';
import { SystemConfigService } from '../services/system-config.service';
import { SetupDto } from '../domain/dto/system-config.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Configuração do Sistema')
@Controller('setup')
export class SystemConfigController {
  constructor(private readonly configService: SystemConfigService) {}

  @Public()
  @Post('/')
  async setup(@Body() data: SetupDto) {
    return this.configService.setupSystem(data);
  }

  @Public()
  @Get('/status')
  async getStatus() {
    console.log('getStatus endpoint accessed');
    return this.configService.getStatus();
  }

  @Public()
  @Get('/max-wait-time')
  async getMaxWaitTimeMin() {
    return this.configService.getMaxWaitTimeMin();
  }
}
