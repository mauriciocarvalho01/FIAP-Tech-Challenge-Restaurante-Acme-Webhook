import { WebhookController } from '@/application/controllers/webhook-controller';
import { WebhookHttp } from '@/domain/contracts/gateways';
import { MessageBroker } from '@/domain/contracts/message-broker';
import { Webhook } from '@/domain/contracts/repos';
import { mock, MockProxy } from 'jest-mock-extended';
import { created, serverError } from '@/application/helpers';

describe('WebhookController', () => {
  let sut: WebhookController;
  let mockWebhookRepo: MockProxy<Webhook>;
  let mockMessageBroker: MockProxy<MessageBroker>;

  beforeEach(() => {
    mockWebhookRepo = mock();
    mockMessageBroker = mock();
    sut = new WebhookController(mockWebhookRepo, mockMessageBroker);
  });

  describe('handleProcessWebhook', () => {
    const webhookData: WebhookHttp.CreateInput = {
      id: 'webhook-123',
      type: 'order.created',
      created_at: new Date().toISOString(),
      data: {
        id: 'order-1',
        code: 'ABC123',
        amount: 100,
        currency: 'USD',
      },
    };

    it('should return created when webhook is processed successfully', async () => {
      const webhookChannel = { queueName: 'webhook-status' };

      mockMessageBroker.getChannel.mockReturnValue(webhookChannel);
      mockMessageBroker.sendToQueue.mockResolvedValue(true);
      mockWebhookRepo.saveWebhook.mockResolvedValue(true);

      const response = await sut.handleProcessWebhook(webhookData);

      expect(response).toEqual(created({ ok: true }));
      expect(mockMessageBroker.getChannel).toHaveBeenCalledWith('webhook-status');
      expect(mockMessageBroker.sendToQueue).toHaveBeenCalledWith(
        webhookChannel,
        { queueName: 'webhook-status', message: webhookData }
      );
      expect(mockWebhookRepo.saveWebhook).toHaveBeenCalledWith({
        status: 'success',
        webhookData,
      });
    });

    it('should return server error and save error webhook when an exception occurs', async () => {
      const error = new Error('Some unknown error');
      const webhookChannel = { queueName: 'webhook-status' };

      mockMessageBroker.getChannel.mockReturnValue(webhookChannel);
      mockMessageBroker.sendToQueue.mockRejectedValue(error);

      const response = await sut.handleProcessWebhook(webhookData);

      expect(response).toEqual(serverError(error));
      expect(mockMessageBroker.getChannel).toHaveBeenCalledWith('webhook-status');
      expect(mockMessageBroker.sendToQueue).toHaveBeenCalledWith(
        webhookChannel,
        { queueName: 'webhook-status', message: webhookData }
      );
      expect(mockWebhookRepo.saveWebhook).toHaveBeenCalledWith({
        status: 'error',
        error: error.message,
        webhookData,
      });
    });
  });
});
