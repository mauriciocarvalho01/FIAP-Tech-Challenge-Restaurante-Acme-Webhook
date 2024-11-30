import { WebhookRepository } from '@/infra/repos/mongodb/webhook-repository';
import { Db, Collection, ObjectId } from 'mongodb';
import { jest } from '@jest/globals';

describe('WebhookRepository', () => {
  let sut: WebhookRepository;
  let mockDb: jest.Mocked<Db>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(() => {
    // Mock da coleção
    mockCollection = {
      insertOne: jest.fn(),
    } as unknown as jest.Mocked<Collection>;

    // Mock do Db
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<Db>;

    sut = new WebhookRepository(mockDb);
  });

  describe('saveWebhook', () => {
    const webhookData = {
      id: 'webhook-123',
      type: 'order.created',
      created_at: new Date().toISOString(),
      status: 'PENDING',
      webhookData: {
        id: 'order-1',
        code: 'ABC123',
        amount: 100,
        currency: 'USD',
      },
    };

    it('should return true when the webhook is successfully saved', async () => {
      mockCollection.insertOne.mockResolvedValue({ insertedId: new ObjectId(), acknowledged: true });

      const result = await sut.saveWebhook(webhookData);

      expect(result).toBe(true);
      expect(mockDb.collection).toHaveBeenCalledWith('webhook-status');
      expect(mockCollection.insertOne).toHaveBeenCalledWith(webhookData);
    });

    it('should return false when insertOne does not insert a document', async () => {
      mockCollection.insertOne.mockResolvedValue({ insertedId: undefined as unknown as ObjectId,  acknowledged: false });

      const result = await sut.saveWebhook(webhookData);

      expect(result).toBe(false);
      expect(mockDb.collection).toHaveBeenCalledWith('webhook-status');
      expect(mockCollection.insertOne).toHaveBeenCalledWith(webhookData);
    });

    it('should throw an EntityError when an exception occurs', async () => {
      const errorMessage = 'Database connection failed';
      mockCollection.insertOne.mockRejectedValue(new Error(errorMessage));

      await expect(sut.saveWebhook(webhookData)).rejects.toThrowError(errorMessage);
      expect(mockDb.collection).toHaveBeenCalledWith('webhook-status');
      expect(mockCollection.insertOne).toHaveBeenCalledWith(webhookData);
    });
  });
});
