/* @license Enterprise */

import {
  computeMidtransSignature,
  verifyMidtransSignature,
} from 'src/engine/core-modules/billing/midtrans/utils/midtrans-signature.util';

/**
 * Unit test untuk utilitas verifikasi signature Midtrans.
 * Rumus: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
describe('midtrans-signature.util', () => {
  const serverKey = 'SB-Mid-server-test-key-sandbox';
  const orderId = 'bades-workspace-123-1000000000';
  const statusCode = '200';
  const grossAmount = '100000.00';

  describe('computeMidtransSignature', () => {
    it('mengembalikan string hex SHA512 yang konsisten', () => {
      const signature = computeMidtransSignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey,
      );

      expect(typeof signature).toBe('string');
      // SHA512 menghasilkan 128 karakter hex
      expect(signature).toHaveLength(128);
    });

    it('menghasilkan signature yang sama untuk input yang sama', () => {
      const sig1 = computeMidtransSignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey,
      );
      const sig2 = computeMidtransSignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey,
      );

      expect(sig1).toBe(sig2);
    });

    it('menghasilkan signature berbeda jika input berbeda', () => {
      const sig1 = computeMidtransSignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey,
      );
      const sig2 = computeMidtransSignature(
        orderId,
        '201',
        grossAmount,
        serverKey,
      );

      expect(sig1).not.toBe(sig2);
    });

    it('menghasilkan signature berbeda jika server key berbeda', () => {
      const sig1 = computeMidtransSignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey,
      );
      const sig2 = computeMidtransSignature(
        orderId,
        statusCode,
        grossAmount,
        'kunci-lain',
      );

      expect(sig1).not.toBe(sig2);
    });
  });

  describe('verifyMidtransSignature', () => {
    it('mengembalikan true jika signature valid', () => {
      const signatureYangBenar = computeMidtransSignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey,
      );

      const valid = verifyMidtransSignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey,
        signatureYangBenar,
      );

      expect(valid).toBe(true);
    });

    it('mengembalikan false jika signature tidak valid', () => {
      const valid = verifyMidtransSignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey,
        'signature-palsu-xxxxxxxxxxxxxxxxxxxxxxxx',
      );

      expect(valid).toBe(false);
    });

    it('mengembalikan false jika gross_amount berbeda', () => {
      const signatureAsli = computeMidtransSignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey,
      );

      // Coba verifikasi dengan gross_amount yang berbeda
      const valid = verifyMidtransSignature(
        orderId,
        statusCode,
        '999999.00', // beda dari grossAmount asli
        serverKey,
        signatureAsli,
      );

      expect(valid).toBe(false);
    });

    it('mengembalikan false jika order_id berbeda', () => {
      const signatureAsli = computeMidtransSignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey,
      );

      const valid = verifyMidtransSignature(
        'order-id-palsu',
        statusCode,
        grossAmount,
        serverKey,
        signatureAsli,
      );

      expect(valid).toBe(false);
    });

    it('sensitif terhadap case pada signature', () => {
      const signatureBenar = computeMidtransSignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey,
      );
      const signatureUpperCase = signatureBenar.toUpperCase();

      // SHA512 output adalah lowercase hex — uppercase tidak cocok
      const valid = verifyMidtransSignature(
        orderId,
        statusCode,
        grossAmount,
        serverKey,
        signatureUpperCase,
      );

      expect(valid).toBe(false);
    });
  });
});
