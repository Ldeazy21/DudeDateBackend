import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Injectable()
export class MailConfig implements MailerOptionsFactory {
  constructor(private readonly config: ConfigService) {}
  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: this.config.get<string>('EMAIL_HOST_SERVICE'),
        port: 465,
        secure: true,
        auth: {
          user: this.config.get<string>('EMAIL_HOST_USER'),
          pass: this.config.get<string>('EMAIL_HOST_PASSWORD'),
        },
        tls: { rejectUnauthorized: false },
      },
      defaults: { from: this.config.get<string>('EMAIL_HOST_USER') },
      template: {
        dir: join(process.cwd(), 'src/infrastructure/mail/templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: false },
      },
    };
  }
}
