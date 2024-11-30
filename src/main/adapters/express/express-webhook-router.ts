import { WebhookController } from '@/application/controllers';
import { RequestHandler } from 'express';

type WebhookAdapter = (controller: WebhookController) => RequestHandler;
type GenericType<T = any> = T;

const makeResponseHandler = (
  data: GenericType,
  statusCode: number,
  res: GenericType
) => {
  let errors = {};
  try {
    errors = { errors: JSON.parse(data.message) };
  } catch (error) {
    errors = { errors: data.message };
  }
  const json = [200, 201, 204].includes(statusCode) ? data : errors;
  res.status(statusCode).json(json);
};

export const adaptExpressProcessWebhookRoute: WebhookAdapter =
  (controller) => async (req, res) => {
    const { body } = req;
    const { statusCode, data } = await controller.handleProcessWebhook(body);

    makeResponseHandler(data, statusCode, res);
  };
