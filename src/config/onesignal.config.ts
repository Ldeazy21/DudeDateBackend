import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface OneSignalOptions {
  appId: string;
  restApiKey: string;
}

@Injectable()
export class OneSignalConfig {
  constructor(private readonly config: ConfigService) {}

  createOneSignalOptions(): OneSignalOptions {
    return {
      appId: this.config.get<string>('ONESIGNAL_APP_ID'),
      restApiKey: this.config.get<string>('ONESIGNAL_API_AUTHENTICATION_KEY'),
    };
  }
}
