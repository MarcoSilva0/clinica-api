import { Injectable } from '@nestjs/common';
import SystemConfigRepository from '../infra/system-config.repository';
import { SetupDto } from '../domain/dto/system-config.dto';
import { UsersService } from 'src/users/service/users.service';
import { MailerService } from 'src/mailer/services/mailer.service';

@Injectable()
export class SystemConfigService {
  constructor(
    private readonly systemConfigRepository: SystemConfigRepository,
    private readonly userService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async getStatus() {
    const config = await this.systemConfigRepository.findSystemConfig();
    return { initialized: config?.initialized ?? false };
  }

  async setupSystem(data: SetupDto) {
    const config = await this.systemConfigRepository.findSystemConfig();
    const userExist = await this.userService.findFirstAdmin();

    if (config?.initialized || userExist) {
      throw new Error('System already initialized or admin user exists');
    }

    const userAdmin = await this.userService.createAdminUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    await this.systemConfigRepository.createSystemConfig({
      maxWaitTimeMin: data.maxWaitTimeMin,
    });

    await this.mailerService.sendEmail(
      userAdmin.email,
      'Welcome to the System',
      `<html>Your admin account has been created with email: ${userAdmin.email}</html>`,
    );

    return { message: 'System initialized successfully' };
  }
}
