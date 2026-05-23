/* @license Enterprise */

import type {
  MidtransTransactionStatus,
  SnapTransactionResult,
} from 'midtrans-client';

/**
 * Mock Snap untuk keperluan unit test — tidak memanggil API Midtrans sungguhan.
 */
export class MidtransSnapMock {
  createTransaction(_parameter: unknown): Promise<SnapTransactionResult> {
    return Promise.resolve({
      token: 'mock-snap-token',
      redirect_url:
        'https://app.sandbox.midtrans.com/snap/v3/redirection/mock-snap-token',
    });
  }

  createTransactionToken(_parameter: unknown): Promise<string> {
    return Promise.resolve('mock-snap-token');
  }

  createTransactionRedirectUrl(_parameter: unknown): Promise<string> {
    return Promise.resolve(
      'https://app.sandbox.midtrans.com/snap/v3/redirection/mock-snap-token',
    );
  }

  transaction = {
    status: (_transactionId: string): Promise<MidtransTransactionStatus> =>
      Promise.resolve({
        transaction_id: 'mock-transaction-id',
        order_id: 'mock-order-id',
        gross_amount: '100000.00',
        currency: 'IDR',
        payment_type: 'bank_transfer',
        transaction_status: 'settlement',
        fraud_status: 'accept',
        status_code: '200',
        status_message: 'Success',
      }),
  };
}

/**
 * Mock CoreApi untuk keperluan unit test.
 */
export class MidtrasCoreApiMock {
  transaction = {
    status: (_transactionId: string): Promise<MidtransTransactionStatus> =>
      Promise.resolve({
        transaction_id: 'mock-transaction-id',
        order_id: 'mock-order-id',
        gross_amount: '100000.00',
        currency: 'IDR',
        payment_type: 'bank_transfer',
        transaction_status: 'settlement',
        fraud_status: 'accept',
        status_code: '200',
        status_message: 'Success',
      }),
  };
}
