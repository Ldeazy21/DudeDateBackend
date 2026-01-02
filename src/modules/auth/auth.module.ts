import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OtpService } from './otp.service';
import { UserUtils } from 'src/common/utils/user.utils';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { JwtConfig } from 'src/config';

@Module({
  imports: [
    UserModule,
    NotificationModule,
    JwtModule.registerAsync({
      useClass: JwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OtpService, UserUtils],
  exports: [JwtStrategy],
})
export class AuthModule {}
