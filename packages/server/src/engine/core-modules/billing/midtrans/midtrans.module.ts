/* @license Enterprise */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BillingMidtransTransactionEntity } from 'src/engine/core-modules/billing/entities/billing-midtrans-transaction.entity';
import { MidtransSDKModule } from 'src/engine/core-modules/billing/midtrans/midtrans-sdk/midtrans-sdk.module';
import { MidtransSnapService } from 'src/engine/core-modules/billing/midtrans/services/midtrans-snap.service';
import { MidtransTransactionService } from 'src/engine/core-modules/billing/midtrans/services/midtrans-transaction.service';

@Module({
  imports: [
    MidtransSDKModule,
    TypeOrmModule.forFeature([BillingMidtransTransactionEntity]),
  ],
  providers: [MidtransSnapService, MidtransTransactionService],
  exports: [MidtransSnapService, MidtransTransactionService],
})
export class MidtransModule {}
