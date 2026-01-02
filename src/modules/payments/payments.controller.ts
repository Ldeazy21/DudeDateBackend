import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto';
import { GetUser } from 'src/common/decorators';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/core/guards';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtGuard)
  @Post('create-payment-intent')
  async payWithIntent(
    @GetUser() user: User,
    @Body() body: CreatePaymentIntentDto,
  ) {
    return this.paymentsService.createPaymentIntent(user, body);
  }
}
