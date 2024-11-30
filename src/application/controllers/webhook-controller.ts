import {
  created,
  HttpResponse,
  serverError,
} from '@/application/helpers';
import { WebhookHttp } from '@/domain/contracts/gateways';
import { MessageBroker } from '@/domain/contracts/message-broker';
import { Webhook } from '@/domain/contracts/repos';

export class WebhookController {
  constructor(
    private readonly webhookRepo: Webhook,
    private readonly messageBroker: MessageBroker
  ) {}

  // POST /checkout
  async handleProcessWebhook(
    webhookData: WebhookHttp.CreateInput
  ): Promise<HttpResponse<WebhookHttp.CreateOutput | Error>> {
    try {
      const webhookChannel = this.messageBroker.getChannel('webhook-status')
      await this.messageBroker.sendToQueue(
        webhookChannel,
        {
          queueName: 'webhook-status',
          message: webhookData
        }
      )
      await this.webhookRepo.saveWebhook({
        status: 'success',
        webhookData
      })
      return created({ ok: true });
    } catch (error: Webhook.GenericType) {
      console.log(error)
      await this.webhookRepo.saveWebhook({
        status: 'error',
        error: error.message,
        webhookData
      })
      return serverError(error);
    }
  }
}
