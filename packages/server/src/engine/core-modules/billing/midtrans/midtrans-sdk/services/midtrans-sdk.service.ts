/* @license Enterprise */

import { Injectable } from '@nestjs/common';

import { CoreApi, Snap } from 'midtrans-client';

/**
 * Wrapper SDK Midtrans — menyediakan instance Snap dan CoreApi.
 * Analog dengan StripeSDKService di modul Stripe.
 */
@Injectable()
export class MidtransSDKService {
  /**
   * Mengembalikan instance Snap untuk checkout Midtrans.
   * @param serverKey  - Server Key dari Midtrans MAP
   * @param clientKey  - Client Key dari Midtrans MAP
   * @param isProduction - true untuk environment produksi
   */
  getSnap(serverKey: string, clientKey: string, isProduction: boolean): Snap {
    return new Snap({ serverKey, clientKey, isProduction });
  }

  /**
   * Mengembalikan instance CoreApi untuk verifikasi status server-to-server.
   * @param serverKey  - Server Key dari Midtrans MAP
   * @param clientKey  - Client Key dari Midtrans MAP
   * @param isProduction - true untuk environment produksi
   */
  getCoreApi(
    serverKey: string,
    clientKey: string,
    isProduction: boolean,
  ): CoreApi {
    return new CoreApi({ serverKey, clientKey, isProduction });
  }
}
