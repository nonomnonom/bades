/* @license Enterprise */

import { Injectable } from '@nestjs/common';

import type { CoreApi, Snap } from 'midtrans-client';

import {
  MidtrasCoreApiMock,
  MidtransSnapMock,
} from 'src/engine/core-modules/billing/midtrans/midtrans-sdk/mocks/midtrans-sdk.mock';
import { type MidtransSDKService } from 'src/engine/core-modules/billing/midtrans/midtrans-sdk/services/midtrans-sdk.service';

/**
 * Implementasi mock MidtransSDKService untuk unit test.
 * Tidak memanggil API Midtrans nyata.
 */
@Injectable()
export class MidtransSDKMockService implements MidtransSDKService {
  getSnap(
    _serverKey: string,
    _clientKey: string,
    _isProduction: boolean,
  ): Snap {
    return new MidtransSnapMock() as unknown as Snap;
  }

  getCoreApi(
    _serverKey: string,
    _clientKey: string,
    _isProduction: boolean,
  ): CoreApi {
    return new MidtrasCoreApiMock() as unknown as CoreApi;
  }
}
