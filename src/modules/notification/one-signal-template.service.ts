import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { getTakeAndSkip, PaginationRequest } from 'src/common/dtos';

@Injectable()
export class OneSignalTemplateService {
  constructor(private readonly config: ConfigService) {}

  private readonly app_id = this.config.get<string>('ONESIGNAL_APP_ID');
  private readonly app_api_authentication_key = this.config.get<string>(
    'ONESIGNAL_API_AUTHENTICATION_KEY',
  );

  async getAllTemplates(query: PaginationRequest) {
    try {
      if (!query.page || !query.size) {
        throw new BadRequestException('page and size must be provided');
      }
      const { take, skip } = getTakeAndSkip(query.page, query.size);

      const resposne = await axios.get(
        `https://api.onesignal.com/templates?app_id=${this.app_id}&limit=${take}&offset=${skip}`,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
            Authorization: `Key ${this.app_api_authentication_key}`,
          },
        },
      );

      return JSON.stringify(resposne.data);
    } catch (error) {
      throw error;
    }
  }
}
