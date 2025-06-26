import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { Public } from 'src/auth/infra/decorators/public/public.decorator';
import { SystemConfigService } from '../services/system-config.service';
import { SystemConfigDto } from '../domain/dto/system-config.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateSystemConfigDto } from '../domain/dto/update-system-config.dto';
import { Roles } from 'src/auth/infra/decorators/role/role.decorator';

@ApiTags('Configuração do Sistema')
@Controller('setup')
export class SystemConfigController {
  constructor(private readonly configService: SystemConfigService) {}

  @Public()
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

  @Public()
  @Get('/max-wait-time')
  async getMaxWaitTimeMin() {
    return this.configService.getMaxWaitTimeMin();
  }
}
