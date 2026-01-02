import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { JwtGuard } from '../../core/guards/jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUser } from 'src/common/decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(200)
  async signup(@Body() body: CreateUserDto) {
    return await this.authService.signup(body);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('send-otp')
  @HttpCode(200)
  async sendOTP(@Body() body: SendOtpDto) {
    return await this.authService.sendOTP(body);
  }

  @Get('resend-otp/:id')
  @HttpCode(200)
  async resendOTP(@Param('id') id: string) {
    return await this.authService.resendOTP(id);
  }

  @Post('verify-otp')
  @HttpCode(200)
  async verifyOTP(@Body() body: VerifyOtpDto) {
    return await this.authService.verifyOTP(body);
  }

  @Patch('forgot-password/:id')
  @HttpCode(200)
  async forgotPassword(
    @Param('id') id: string,
    @Body() body: ForgotPasswordDto,
  ) {
    return await this.authService.forgotPassword(id, body);
  }

  @UseGuards(JwtGuard)
  @Post('change-password')
  @HttpCode(200)
  async changePassword(
    @GetUser('id') user_id: string,
    @Body() body: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(user_id, body);
  }
}
