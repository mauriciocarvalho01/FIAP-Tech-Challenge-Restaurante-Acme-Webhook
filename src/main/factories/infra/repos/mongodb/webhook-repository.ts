import { makeMongoDBConnection } from '@/main/factories/infra/repos/mongodb/helpers/connection';
import { WebhookRepository } from '@/infra/repos/mongodb';

export const makeWebhookRepo = (): WebhookRepository => {
  return new WebhookRepository(makeMongoDBConnection());
};
