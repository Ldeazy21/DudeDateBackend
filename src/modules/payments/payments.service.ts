import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './dto';
import { StripeService } from './stripe.service';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { applyDeduction } from 'src/common/utils/payment.utils';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  async createCustomer(params: Stripe.CustomerCreateParams) {
    try {
      return await this.stripe.customers.create(params);
    } catch (error) {
      throw error;
    }
  }

  async createPaymentIntent(user: User, body: CreatePaymentIntentDto) {
    try {
      if (!user.stripe_customer_id) {
        const create_customer: Stripe.CustomerCreateParams = {
          email: user.email,
        };
        const { stripe_customer_id } =
          await this.stripeService.createCustomer(create_customer);
        const updated_user = await this.prisma.user.update({
          where: { id: user.id },
          data: { stripe_customer_id },
        });
        body.customer = updated_user.stripe_customer_id;
      }
      body.customer = user.stripe_customer_id
        ? user.stripe_customer_id
        : body.customer;

      const final_amount = applyDeduction(body.amount, 5);

      body.amount = Math.round(final_amount * 100);

      const { id, status, customer } =
        await this.stripeService.createPaymentIntent(body);

      return {
        message: `Payment is ${status}`,
        data: { id, status, customer },
      };
    } catch (error) {
      if (error.raw && error.raw.message) {
        throw new HttpException('Payment Failed', HttpStatus.PAYMENT_REQUIRED);
      }

      throw new InternalServerErrorException(
        'Payment processing failed, please try again later.',
      );
    }
  }
}
