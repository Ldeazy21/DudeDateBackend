import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserUtils } from 'src/common/utils/user.utils';
import { PaymentsModule } from 'src/modules/payments/payments.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PaymentsModule, NotificationModule],
  controllers: [UserController],
  providers: [UserService, UserUtils],
  exports: [UserService],
})
export class UserModule {}
