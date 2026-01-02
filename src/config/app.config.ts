import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

@Injectable()
export class AppConfig {
  constructor(private readonly configService: ConfigService) {}

  // Enable or disable CORS
  getCorsOptions(): CorsOptions {
    return {
      origin: this.configService.get<string>('CORS_ORIGIN')?.split(',') || '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    };
  }

  // App port
  getPort(): number {
    return this.configService.get<number>('PORT');
  }

  // Environment: development | production | test
  getEnvironment(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }
}
