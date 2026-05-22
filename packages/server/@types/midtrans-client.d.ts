/**
 * Deklarasi tipe minimal untuk paket midtrans-client.
 * Dibuat karena @types/midtrans-client tidak tersedia.
 * Referensi: https://docs.midtrans.com
 */
declare module 'midtrans-client' {
  export type MidtransOptions = {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  };

  export type SnapCreateTransactionParam = {
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    customer_details?: {
      email?: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
    };
    item_details?: Array<{
      id: string;
      price: number;
      quantity: number;
      name: string;
    }>;
    credit_card?: {
      secure?: boolean;
    };
    callbacks?: {
      finish?: string;
      error?: string;
      pending?: string;
    };
    expiry?: {
      start_time?: string;
      unit: 'minute' | 'hour' | 'day';
      duration: number;
    };
    custom_field1?: string;
    custom_field2?: string;
    custom_field3?: string;
  };

  export type SnapTransactionResult = {
    token: string;
    redirect_url: string;
  };

  /**
   * Respons status transaksi dari Midtrans Core API / notifikasi webhook.
   */
  export type MidtransTransactionStatus = {
    transaction_id: string;
    order_id: string;
    gross_amount: string;
    currency: string;
    payment_type?: string;
    transaction_time?: string;
    transaction_status: string;
    fraud_status?: string;
    status_code: string;
    status_message?: string;
    bank?: string;
    va_numbers?: Array<{ bank: string; va_number: string }>;
    payment_amounts?: Array<{ paid_at: string; amount: string }>;
    signature_key?: string;
    merchant_id?: string;
    [key: string]: unknown;
  };

  export class Snap {
    constructor(options: MidtransOptions);
    createTransaction(
      parameter: SnapCreateTransactionParam,
    ): Promise<SnapTransactionResult>;
    createTransactionToken(
      parameter: SnapCreateTransactionParam,
    ): Promise<string>;
    createTransactionRedirectUrl(
      parameter: SnapCreateTransactionParam,
    ): Promise<string>;
    transaction: Transaction;
  }

  export class CoreApi {
    constructor(options: MidtransOptions);
    charge(parameter: Record<string, unknown>): Promise<MidtransTransactionStatus>;
    transaction: Transaction;
  }

  export class Transaction {
    status(transactionId: string): Promise<MidtransTransactionStatus>;
    approve(transactionId: string): Promise<MidtransTransactionStatus>;
    cancel(transactionId: string): Promise<MidtransTransactionStatus>;
    deny(transactionId: string): Promise<MidtransTransactionStatus>;
    expire(transactionId: string): Promise<MidtransTransactionStatus>;
    refund(
      transactionId: string,
      parameter?: Record<string, unknown>,
    ): Promise<MidtransTransactionStatus>;
  }

  export class MidtransError extends Error {
    httpStatusCode: number | null;
    ApiResponse: unknown | null;
    rawHttpClientData: unknown | null;
    constructor(
      message: string,
      httpStatusCode?: number,
      ApiResponse?: unknown,
      rawHttpClientData?: unknown,
    );
  }
}
