/* @license Enterprise */

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('BillingEndTrialPeriod')
export class BillingEndTrialPeriodDTO {
  @Field(() => String, {
    description: 'URL redirect ke halaman pembayaran Midtrans Snap',
  })
  checkoutUrl: string;

  @Field(() => String, {
    description: 'ID order Midtrans untuk tracking status pembayaran',
  })
  orderId: string;
}
