import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { OtpService } from './otp.service';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Prisma, Role, User } from '@prisma/client';

interface AssignToken {
  id: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  private async assignToken(payload: AssignToken) {
    return await this.jwtService.signAsync({
      id: payload.id,
    });
  }

  private validatePassword(payload: ForgotPasswordDto) {
    if (payload.password !== payload.confirm_password) {
      throw new ForbiddenException('Password not match');
    }
    return;
  }

  private validateChangePassword(payload: ChangePasswordDto) {
    const validate_password_payload: ForgotPasswordDto = {
      password: payload.new_password,
      confirm_password: payload.confirm_password,
    };
    this.validatePassword(validate_password_payload);
    if (payload.old_password === payload.new_password) {
      throw new ForbiddenException(
        'New password must be different from old password',
      );
    }
    return;
  }

  private hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
  }

  async signup(body: CreateUserDto) {
    try {
      await this.otpService.verifyUser(body.email);
      await this.userService.findByEmail(body.email);
      body.password = this.hashPassword(body.password);
      if (body.is_owner === true) {
        body.role = Role.TEAM_OWNER;
      }

      const user = await this.userService.create(body);
      const { id, email } = user;
      return {
        message: 'Signup Successfully',
        data: {
          id,
          email,
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          if (error.meta.target == 'email') {
            throw new ConflictException(
              `User with this email ${body.email} is already taken.`,
            );
          }
          if (error.meta.target == 'phone_number') {
            throw new ConflictException(
              `User with this phone number ${body.phone_number} is already taken.`,
            );
          }
        }
      }
      throw error;
    }
  }

  async login(body: LoginDto) {
    try {
      const existingUser = await this.userService.findByEmail(body.email);
      if (!existingUser) {
        throw new ForbiddenException('Invalid Credentials');
      }
      const matchPassword = bcrypt.compareSync(
        body.password,
        existingUser.password,
      );
      if (!matchPassword) {
        throw new ForbiddenException('Invalid Credentials');
      }

      const accessToken = await this.assignToken(existingUser);
      const { password, ...rest } = existingUser;

      return {
        message: 'Login Successfully',
        data: {
          ...rest,
          access_token: accessToken,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async sendOTP(body: SendOtpDto) {
    try {
      return await this.otpService.sendOTP(body);
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(id: string, body: ForgotPasswordDto) {
    try {
      this.validatePassword(body);
      const check_otp_status = await this.otpService.findById(id);

      if (check_otp_status.is_used === false) {
        throw new NotAcceptableException('OTP Process is not completed yet');
      }
      body.password = this.hashPassword(body.confirm_password);

      await this.userService.updatePassword(
        check_otp_status.email,
        body.password,
      );
      return {
        message: 'Password reset successfully',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }
      throw error;
    }
  }

  async verifyOTP(body: VerifyOtpDto) {
    try {
      return await this.otpService.verifyOTP(body);
    } catch (error) {
      throw error;
    }
  }

  async resendOTP(id: string) {
    try {
      return await this.otpService.resendOTP(id);
    } catch (error) {
      throw error;
    }
  }

  async changePassword(user_id: string, body: ChangePasswordDto) {
    try {
      this.validateChangePassword(body);

      const existing_user_otp = await this.userService.findById(user_id);

      const match_password = bcrypt.compareSync(
        body.old_password,
        existing_user_otp.password,
      );
      if (!match_password) {
        throw new ForbiddenException('Old password is incorrect');
      }

      this.validateChangePassword(body);
      body.new_password = this.hashPassword(body.new_password);
      await this.userService.updatePassword(
        existing_user_otp.email,
        body.new_password,
      );
      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
