import { WebhookHttp } from '@/domain/contracts/gateways';
import {
  Route,
  Tags,
  Response,
  TsoaController,
  Post,
  Body,
  Security,
} from '.';
import { Example } from 'tsoa';

@Route('/checkout/webhook')
export class CreateWebhookDoc extends TsoaController {
  /**
   * @summary Rota para criação do checkout
   */
  @Post()
  @Example({
    "id": "hook_12345ABCDE",
    "type": "order.paid",
    "created_at": "2024-11-27T12:00:00",
    "data": {
      "id": "order_67890FGHIJ",
      "code": "ORD123456",
      "amount": 15000,
      "currency": "BRL"
    }
  })
  @Tags('Webhook')
  @Response<WebhookHttp.CreateOutput>(201, 'Created')
  CreateWebhook(@Body() _body: WebhookHttp.CreateInput): void {
    /* Documentation - Rout to create checkout */
  }
}


