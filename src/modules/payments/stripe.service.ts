import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly config: ConfigService) {
    this.stripe = new Stripe(config.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-07-30.basil',
    });
  }

  async createCustomer(params: Stripe.CustomerCreateParams) {
    try {
      const { id } = await this.stripe.customers.create(params);
      return { stripe_customer_id: id };
    } catch (error) {
      throw error;
    }
  }

  async createPaymentIntent(params: Stripe.PaymentIntentCreateParams) {
    try {
      (params.confirm = true),
        (params.automatic_payment_methods = {
          enabled: true,
          allow_redirects: 'never',
        });

      const payment_intent = await this.stripe.paymentIntents.create(params);

      return {
        id: payment_intent.id,
        status: payment_intent.status,
        customer: payment_intent.customer,
      };
    } catch (error) {
      throw error;
    }
  }
}
