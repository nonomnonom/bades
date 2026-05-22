/* @license Enterprise */

import { Module } from '@nestjs/common';

import { MidtransSDKService } from 'src/engine/core-modules/billing/midtrans/midtrans-sdk/services/midtrans-sdk.service';

@Module({
  providers: [MidtransSDKService],
  exports: [MidtransSDKService],
})
export class MidtransSDKModule {}
