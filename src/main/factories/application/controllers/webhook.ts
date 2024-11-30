import {
  makeWebhookRepo,
} from '@/main/factories/infra/repos/mongodb';
import { WebhookController } from '@/application/controllers';
import { makeMessageBroker } from '@/main/factories/infra/message-broker';

export const makeWebhookController = (): WebhookController => {
  return new WebhookController(
    makeWebhookRepo(),
    makeMessageBroker()
  );
};
