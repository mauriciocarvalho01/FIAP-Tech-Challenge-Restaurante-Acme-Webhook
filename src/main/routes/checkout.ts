import {
  adaptExpressProcessWebhookRoute as updateWebhookStatus
} from '@/main/adapters';
import { makeWebhookController } from '@/main/factories/application/controllers';

import { Router } from 'express';

export default (router: Router): void => {
  router.post('/checkout/webhook', updateWebhookStatus(makeWebhookController()));
};
