/* @license Enterprise */

/**
 * Status transaksi Midtrans yang dikembalikan oleh API.
 * Referensi: https://docs.midtrans.com/reference/transaction-status
 */
export const MIDTRANS_TRANSACTION_STATUS = {
  /** Pembayaran berhasil dikonfirmasi (untuk non-kartu kredit) */
  SETTLEMENT: 'settlement',
  /** Pembayaran berhasil diotorisasi (untuk kartu kredit) */
  CAPTURE: 'capture',
  /** Menunggu pembayaran dari pelanggan */
  PENDING: 'pending',
  /** Transaksi ditolak oleh bank / penerbit */
  DENY: 'deny',
  /** Transaksi kadaluarsa sebelum dibayar */
  EXPIRE: 'expire',
  /** Transaksi dibatalkan oleh merchant */
  CANCEL: 'cancel',
  /** Transaksi gagal */
  FAILURE: 'failure',
  /** Refund berhasil diproses */
  REFUND: 'refund',
  /** Chargeback diterima */
  CHARGEBACK: 'chargeback',
  /** Partial refund berhasil */
  PARTIAL_REFUND: 'partial_refund',
  /** Partial chargeback */
  PARTIAL_CHARGEBACK: 'partial_chargeback',
} as const;

export type MidtransTransactionStatusValue =
  (typeof MIDTRANS_TRANSACTION_STATUS)[keyof typeof MIDTRANS_TRANSACTION_STATUS];

/**
 * Status Midtrans yang dianggap sebagai transaksi berhasil / lunas.
 */
export const MIDTRANS_SUCCESS_STATUSES: MidtransTransactionStatusValue[] = [
  MIDTRANS_TRANSACTION_STATUS.SETTLEMENT,
  MIDTRANS_TRANSACTION_STATUS.CAPTURE,
];

/**
 * Status Midtrans yang dianggap sebagai transaksi gagal / tidak valid.
 */
export const MIDTRANS_FAILED_STATUSES: MidtransTransactionStatusValue[] = [
  MIDTRANS_TRANSACTION_STATUS.DENY,
  MIDTRANS_TRANSACTION_STATUS.EXPIRE,
  MIDTRANS_TRANSACTION_STATUS.CANCEL,
  MIDTRANS_TRANSACTION_STATUS.FAILURE,
];
