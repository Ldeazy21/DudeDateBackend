import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailNotificationInterface } from './interface';

// export interface EmailNotification {
//   email: string;
//   otp?: string;
//   message?: string;
//   template: string;
//   subject?: string;
//   team_name?: string;
//   invitor_name?: string;
// }

@Injectable()
export class EmailNotificationService {
  constructor(private readonly mailService: MailerService) {}

  async sendEmail(data: EmailNotificationInterface) {
    try {
      return await this.mailService.sendMail({
        to: data.email,
        subject: data.subject,
        template: data.template,
        context: { data: { ...data } },
      });
    } catch (error) {
      throw error;
    }
  }
}
