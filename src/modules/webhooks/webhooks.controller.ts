import { Body, Controller, Post, Res } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('update-event-status')
  async updateEventStatus(@Body() body: any, @Res() res) {
    console.log(
      `[Webhook] Event received: ${body.type || 'unknown'} | ID: ${body.id || 'no-id'} | Status: ${body.data?.object?.status || 'N/A'}`,
    );

    try {
      const result = await this.webhooksService.updateEventStatus(body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(200).json({
        status: false,
        message: error.message || 'Payment failed',
      });
    }
  }
}
