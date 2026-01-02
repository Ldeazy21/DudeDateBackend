import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsIn,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({
    description: 'Stripe PaymentMethod ID (e.g., pm_1Nx123456789)',
    example: 'pm_1Nx123456789',
  })
  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @ApiProperty({
    description: 'Amount to charge in whole currency units (e.g., 20 for $20)',
    example: 20,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Currency code (default: usd)',
    example: 'usd',
    default: 'usd',
  })
  @IsString()
  @IsIn(['usd', 'eur', 'gbp', 'inr']) // restrict to currencies you support
  currency: string = 'usd';

  @ApiProperty({
    description: 'ID of the Customer',
    example: 'cus_123xxxxx',
  })
  @IsString()
  @IsOptional()
  customer?: string;

  @ApiProperty({
    description: 'Metadata for storing structured key-value info.',
    example: {
      event_id: 'd97b1de0-56d9-4de4-ae0d-4329df878a7e',
      user_id: 'd97b1de0-56d9-4de4-ae0d-4329df878a7e',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata: Record<string, any>;
}
