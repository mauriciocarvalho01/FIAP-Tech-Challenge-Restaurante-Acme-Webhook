import { NoSQLConnection } from '@/infra/repos/mongodb/helpers';
import { Webhook } from '@/domain/contracts/repos';
import { EntityError } from '@/infra/errors';

export class WebhookRepository implements Webhook {
  constructor(
    private readonly noSQLConnection: NoSQLConnection
  ) {}

  async saveWebhook(
    webhookData: Webhook.InsertWebhookInput
  ): Promise<boolean> {
    try {
      const webhookRepo = await this.noSQLConnection.collection('webhook-status')

      const saveResult = await webhookRepo.insertOne(webhookData);

      if (saveResult.insertedId !== undefined) return true
      return false
    } catch (error: any) {
      throw new EntityError(error.message);
    }
  }
}
