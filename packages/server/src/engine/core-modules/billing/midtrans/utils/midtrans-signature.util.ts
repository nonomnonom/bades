/* @license Enterprise */

import * as crypto from 'crypto';

/**
 * Memverifikasi signature_key dari notifikasi webhook Midtrans.
 *
 * Rumus: SHA512(order_id + status_code + gross_amount + ServerKey)
 * Referensi: https://docs.midtrans.com/docs/https-notification-webhooks
 *
 * @param orderId      - ID pesanan dari payload notifikasi
 * @param statusCode   - Kode status HTTP dari payload notifikasi
 * @param grossAmount  - Jumlah total transaksi (string, mis: "100000.00")
 * @param serverKey    - Server Key merchant dari Midtrans MAP
 * @param receivedSignature - signature_key yang diterima dari notifikasi
 * @returns true jika signature valid, false jika tidak valid
 */
export const verifyMidtransSignature = (
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  receivedSignature: string,
): boolean => {
  const rawString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const computedSignature = crypto
    .createHash('sha512')
    .update(rawString)
    .digest('hex');

  return computedSignature === receivedSignature;
};

/**
 * Menghitung signature_key untuk keperluan testing.
 * Gunakan hanya di test atau tooling internal.
 */
export const computeMidtransSignature = (
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
): string => {
  const rawString = `${orderId}${statusCode}${grossAmount}${serverKey}`;

  return crypto.createHash('sha512').update(rawString).digest('hex');
};
