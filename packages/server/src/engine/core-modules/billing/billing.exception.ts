/* @license Enterprise */

import { msg } from 'src/utils/bades-i18n';
import type { MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum BillingExceptionCode {
  BILLING_CUSTOMER_NOT_FOUND = 'BILLING_CUSTOMER_NOT_FOUND',
  BILLING_PLAN_NOT_FOUND = 'BILLING_PLAN_NOT_FOUND',
  BILLING_PRODUCT_NOT_FOUND = 'BILLING_PRODUCT_NOT_FOUND',
  BILLING_PRICE_NOT_FOUND = 'BILLING_PRICE_NOT_FOUND',
  BILLING_METER_NOT_FOUND = 'BILLING_METER_NOT_FOUND',
  BILLING_SUBSCRIPTION_NOT_FOUND = 'BILLING_SUBSCRIPTION_NOT_FOUND',
  BILLING_SUBSCRIPTION_ITEM_NOT_FOUND = 'BILLING_SUBSCRIPTION_ITEM_NOT_FOUND',
  BILLING_SUBSCRIPTION_INVALID = 'BILLING_SUBSCRIPTION_INVALID',
  BILLING_SUBSCRIPTION_EVENT_WORKSPACE_NOT_FOUND = 'BILLING_SUBSCRIPTION_EVENT_WORKSPACE_NOT_FOUND',
  BILLING_CUSTOMER_EVENT_WORKSPACE_NOT_FOUND = 'BILLING_CUSTOMER_EVENT_WORKSPACE_NOT_FOUND',
  BILLING_ACTIVE_SUBSCRIPTION_NOT_FOUND = 'BILLING_ACTIVE_SUBSCRIPTION_NOT_FOUND',
  BILLING_METER_EVENT_FAILED = 'BILLING_METER_EVENT_FAILED',
  BILLING_MISSING_REQUEST_BODY = 'BILLING_MISSING_REQUEST_BODY',
  BILLING_UNHANDLED_ERROR = 'BILLING_UNHANDLED_ERROR',
  BILLING_SUBSCRIPTION_NOT_IN_TRIAL_PERIOD = 'BILLING_SUBSCRIPTION_NOT_IN_TRIAL_PERIOD',
  BILLING_SUBSCRIPTION_INTERVAL_NOT_SWITCHABLE = 'BILLING_SUBSCRIPTION_INTERVAL_NOT_SWITCHABLE',
  BILLING_SUBSCRIPTION_INTERVAL_INVALID = 'BILLING_SUBSCRIPTION_INTERVAL_INVALID',
  BILLING_SUBSCRIPTION_PLAN_NOT_SWITCHABLE = 'BILLING_SUBSCRIPTION_PLAN_NOT_SWITCHABLE',
  BILLING_SUBSCRIPTION_ITEM_INVALID = 'BILLING_SUBSCRIPTION_ITEM_INVALID',
  BILLING_PRICE_INVALID_TIERS = 'BILLING_PRICE_INVALID_TIERS',
  BILLING_PRICE_INVALID = 'BILLING_PRICE_INVALID',
  BILLING_SUBSCRIPTION_PHASE_NOT_FOUND = 'BILLING_SUBSCRIPTION_PHASE_NOT_FOUND',
  BILLING_TOO_MUCH_SUBSCRIPTIONS_FOUND = 'BILLING_TOO_MUCH_SUBSCRIPTIONS_FOUND',
  BILLING_CREDITS_EXHAUSTED = 'BILLING_CREDITS_EXHAUSTED',
  BILLING_PAYMENT_REQUIRED = 'BILLING_PAYMENT_REQUIRED',
  BILLING_MIDTRANS_SIGNATURE_INVALID = 'BILLING_MIDTRANS_SIGNATURE_INVALID',
  BILLING_MIDTRANS_TRANSACTION_NOT_FOUND = 'BILLING_MIDTRANS_TRANSACTION_NOT_FOUND',
}

const getBillingExceptionUserFriendlyMessage = (code: BillingExceptionCode) => {
  switch (code) {
    case BillingExceptionCode.BILLING_CUSTOMER_NOT_FOUND:
      return msg`Data pelanggan tidak ditemukan.`;
    case BillingExceptionCode.BILLING_PLAN_NOT_FOUND:
      return msg`Paket langganan tidak ditemukan.`;
    case BillingExceptionCode.BILLING_PRODUCT_NOT_FOUND:
      return msg`Produk tidak ditemukan.`;
    case BillingExceptionCode.BILLING_PRICE_NOT_FOUND:
      return msg`Harga tidak ditemukan.`;
    case BillingExceptionCode.BILLING_METER_NOT_FOUND:
      return msg`Meter tagihan tidak ditemukan.`;
    case BillingExceptionCode.BILLING_SUBSCRIPTION_NOT_FOUND:
      return msg`Langganan tidak ditemukan.`;
    case BillingExceptionCode.BILLING_SUBSCRIPTION_ITEM_NOT_FOUND:
      return msg`Item langganan tidak ditemukan.`;
    case BillingExceptionCode.BILLING_SUBSCRIPTION_INVALID:
      return msg`Langganan tidak valid.`;
    case BillingExceptionCode.BILLING_SUBSCRIPTION_EVENT_WORKSPACE_NOT_FOUND:
      return msg`Workspace tidak ditemukan untuk event langganan.`;
    case BillingExceptionCode.BILLING_CUSTOMER_EVENT_WORKSPACE_NOT_FOUND:
      return msg`Workspace tidak ditemukan untuk event pelanggan.`;
    case BillingExceptionCode.BILLING_ACTIVE_SUBSCRIPTION_NOT_FOUND:
      return msg`Tidak ada langganan aktif.`;
    case BillingExceptionCode.BILLING_METER_EVENT_FAILED:
      return msg`Gagal mencatat event tagihan.`;
    case BillingExceptionCode.BILLING_MISSING_REQUEST_BODY:
      return msg`Isi permintaan tidak lengkap.`;
    case BillingExceptionCode.BILLING_UNHANDLED_ERROR:
      return msg`Terjadi kesalahan tak terduga pada sistem tagihan.`;
    case BillingExceptionCode.BILLING_SUBSCRIPTION_NOT_IN_TRIAL_PERIOD:
      return msg`Langganan tidak sedang dalam masa percobaan.`;
    case BillingExceptionCode.BILLING_SUBSCRIPTION_INTERVAL_NOT_SWITCHABLE:
      return msg`Interval langganan tidak dapat diubah saat ini.`;
    case BillingExceptionCode.BILLING_SUBSCRIPTION_INTERVAL_INVALID:
      return msg`Interval langganan tidak valid.`;
    case BillingExceptionCode.BILLING_SUBSCRIPTION_PLAN_NOT_SWITCHABLE:
      return msg`Paket langganan tidak dapat diganti saat ini.`;
    case BillingExceptionCode.BILLING_SUBSCRIPTION_ITEM_INVALID:
      return msg`Item langganan tidak valid.`;
    case BillingExceptionCode.BILLING_PRICE_INVALID_TIERS:
      return msg`Tingkatan harga tidak valid.`;
    case BillingExceptionCode.BILLING_PRICE_INVALID:
      return msg`Harga tidak valid.`;
    case BillingExceptionCode.BILLING_SUBSCRIPTION_PHASE_NOT_FOUND:
      return msg`Fase langganan tidak ditemukan.`;
    case BillingExceptionCode.BILLING_TOO_MUCH_SUBSCRIPTIONS_FOUND:
      return msg`Ditemukan lebih dari satu langganan, padahal seharusnya hanya satu.`;
    case BillingExceptionCode.BILLING_CREDITS_EXHAUSTED:
      return msg`Kredit Anda telah habis. Tingkatkan paket untuk melanjutkan.`;
    case BillingExceptionCode.BILLING_PAYMENT_REQUIRED:
      return msg`Pembayaran diperlukan. Silakan lakukan pembayaran terlebih dahulu.`;
    case BillingExceptionCode.BILLING_MIDTRANS_SIGNATURE_INVALID:
      return msg`Verifikasi tanda tangan pembayaran gagal.`;
    case BillingExceptionCode.BILLING_MIDTRANS_TRANSACTION_NOT_FOUND:
      return msg`Transaksi pembayaran tidak ditemukan.`;
    default:
      assertUnreachable(code);
  }
};

export class BillingException extends CustomException<BillingExceptionCode> {
  constructor(
    message: string,
    code: BillingExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? getBillingExceptionUserFriendlyMessage(code),
    });
  }
}
