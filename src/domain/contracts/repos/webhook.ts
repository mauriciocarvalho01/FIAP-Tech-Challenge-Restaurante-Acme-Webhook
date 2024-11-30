export interface Webhook {
  saveWebhook: (
    input: Webhook.InsertWebhookInput
  ) => Promise<boolean>;
}

export namespace Webhook {
  export type GenericType<T = any> = T;

  // Webhook properties
  export type InsertWebhookInput = {
    status: string;
    error?: string;
    webhookData: GenericType;
  };
}