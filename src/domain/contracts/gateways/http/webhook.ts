export namespace WebhookHttp {
  // API types contracts
  export type GenericType<T=any> = T

  // POST webhook
  export type CreateInput = {
    /**
     * Weebhook recebido do gateway de pagamento
     */
    id: string;
    type: string;
    created_at: string;
    data: {
      id: string;
      code: string;
      amount: number;
      currency: string;
    };
  };

  export type CreateOutput = {
    ok: boolean;
  };
}
