/* @license Enterprise */

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('BillingSession')
export class BillingSessionDTO {
  @Field(() => String, { nullable: true })
  url: string;

  /**
   * ID pesanan Midtrans untuk transaksi ini.
   */
  @Field(() => String, { nullable: true })
  orderId?: string;
}
