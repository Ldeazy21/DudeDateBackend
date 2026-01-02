import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from 'src/modules/user/user.service';
import { UserUtils } from 'src/common/utils/user.utils';
import dayjs from 'dayjs';
import { SendOtpDto, SendOtpPurpose, VerifyOtpDto } from './dto';
import { NotificationService } from 'src/modules/notification/notification.service';
import { OTPMessageResponse } from 'src/common/constants';

interface SendEmail {
  email: string;
  subject: string;
  otp: string;
  template: string;
}
@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userUtils: UserUtils,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  private buildEmailVerificationPayload(data): SendEmail {
    const email = data.email;
    const subject = 'Email Verification From Dawg Pound';
    const otp = data.code;
    const template = 'email-verification';
    return { email, subject, otp, template };
  }

  private async validateOtpPurpose(email: string, purpose: SendOtpPurpose) {
    const existing_user = await this.userService.findByEmail(email);

    if (purpose === SendOtpPurpose.EMAIL_VERIFICATION) {
      if (existing_user) {
        throw new ConflictException('User already exists');
      }
    }

    if (purpose === SendOtpPurpose.FORGOT_PASSWORD) {
      if (!existing_user) {
        throw new NotFoundException('User not found');
      }
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.otp.findFirst({
      where: {
        email,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.otp.findFirst({
      where: {
        id,
      },
    });
  }

  async otpUsed(id: string) {
    return await this.prisma.otp.findFirst({
      where: {
        id,
        is_used: true,
      },
    });
  }

  async sendOTP(body: SendOtpDto) {
    try {
      if (body.purpose === SendOtpPurpose.EMAIL_VERIFICATION) {
        const existing_user = await this.userService.findByEmail(body.email);
        if (existing_user) {
          throw new ConflictException('User is already exist');
        }
      }

      if (body.purpose === SendOtpPurpose.FORGOT_PASSWORD) {
        const existing_user = await this.userService.findByEmail(body.email);
        if (!existing_user) {
          throw new NotFoundException('User not found');
        }
      }

      await this.validateOtpPurpose(body.email, body.purpose);

      const otp = this.userUtils.generateSixDigitCode();

      const expiration_time = this.userUtils.generateExpirationTime();

      const existing_user_otp = await this.findByEmail(body.email);

      if (existing_user_otp?.email) {
        existing_user_otp.code = otp;
        const send_email_paylaod: SendEmail =
          this.buildEmailVerificationPayload(existing_user_otp);

        const updated_data = await this.prisma.otp.update({
          where: {
            id: existing_user_otp.id,
          },
          data: {
            code: otp,
            is_used: false,
            is_verified: false,
            expire_at: expiration_time,
          },
        });

        await this.notificationService.sendEmail(send_email_paylaod);

        const new_data = this.userUtils.extractOTPDataFromPayload(updated_data);

        return {
          message: OTPMessageResponse.send,
          data: new_data,
        };
      } else {
        const new_otp = await this.prisma.otp.create({
          data: {
            email: body.email,
            code: otp,
            expire_at: expiration_time,
          },
        });

        const send_email_paylaod: SendEmail =
          this.buildEmailVerificationPayload(new_otp);

        await this.notificationService.sendEmail(send_email_paylaod);
        const new_data = this.userUtils.extractOTPDataFromPayload(new_otp);

        return {
          message: OTPMessageResponse.send,
          data: new_data,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async verifyOTP(body: VerifyOtpDto) {
    try {
      const expiration_time = dayjs().toISOString();
      if (!body.id || !body.otp) {
        throw new NotAcceptableException('Missing required fields');
      }
      const existing_user_otp = await this.findById(body.id);

      if (!existing_user_otp) {
        throw new NotFoundException('OTP record not found');
      }

      if (existing_user_otp.is_used == true) {
        throw new ForbiddenException('OTP is already used');
      }

      if (existing_user_otp.code !== body.otp) {
        throw new NotAcceptableException('OTP is invalid');
      }

      if (existing_user_otp.expire_at < expiration_time) {
        throw new ForbiddenException('OTP is Expired');
      }

      await this.prisma.otp.update({
        where: {
          id: body.id,
          code: body.otp,
        },
        data: {
          is_used: true,
          is_verified: true,
        },
      });

      return {
        message: OTPMessageResponse.verify,
        data: {
          email: existing_user_otp.email,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async resendOTP(id: string) {
    try {
      const otp = this.userUtils.generateSixDigitCode();
      const expiration_time = this.userUtils.generateExpirationTime();

      const updated_data = await this.prisma.otp.update({
        where: {
          id,
        },
        data: {
          code: otp,
          is_verified: false,
          is_used: false,
          expire_at: expiration_time,
        },
      });

      updated_data.code = otp;

      const send_email_paylaod =
        this.buildEmailVerificationPayload(updated_data);
      await this.notificationService.sendEmail(send_email_paylaod);

      const new_data = this.userUtils.extractOTPDataFromPayload(updated_data);

      return {
        message: OTPMessageResponse.resend,
        data: new_data,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.otp.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async verifyUser(email: string) {
    try {
      const user = await this.prisma.otp.findFirst({
        where: {
          email,
        },
        orderBy: {
          updated_at: 'desc',
        },
      });
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      if (user.is_verified === false) {
        throw new UnauthorizedException('User is not verified.');
      }
      return;
    } catch (error) {
      throw error;
    }
  }
}
