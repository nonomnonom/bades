/* @license Enterprise */

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { BillingProductEntity } from 'src/engine/core-modules/billing/entities/billing-product.entity';
import { BillingSubscriptionEntity } from 'src/engine/core-modules/billing/entities/billing-subscription.entity';
import { BillingSubscriptionItemMetadata } from 'src/engine/core-modules/billing/types/billing-subscription-item-metadata.type';

@Entity({ name: 'billingSubscriptionItem', schema: 'core' })
@Unique(
  'IDX_BILLING_SUBSCRIPTION_ITEM_BILLING_SUBSCRIPTION_ID_PRODUCT_CODE_UNIQUE',
  ['billingSubscriptionId', 'productCode'],
)
export class BillingSubscriptionItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'timestamptz' })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ nullable: false })
  billingSubscriptionId: string;

  @Column({ nullable: false, type: 'jsonb', default: {} })
  metadata: BillingSubscriptionItemMetadata;

  @ManyToOne(
    () => BillingSubscriptionEntity,
    (billingSubscription) => billingSubscription.billingSubscriptionItems,
    {
      onDelete: 'CASCADE',
    },
  )
  billingSubscription: Relation<BillingSubscriptionEntity>;

  @ManyToOne(() => BillingProductEntity)
  @JoinColumn({
    name: 'productCode',
    referencedColumnName: 'productCode',
  })
  billingProduct: Relation<BillingProductEntity>;

  /**
   * Kode produk internal Bades, mis. `bades-product-base`.
   * Menggantikan stripeProductId.
   */
  @Column({ nullable: false })
  productCode: string;

  /** Slug harga yang aktif untuk item ini. */
  @Column({ nullable: false })
  priceId: string;

  @Column({ nullable: true, type: 'numeric' })
  quantity: number | null;

  @Column({ type: 'boolean', default: false })
  hasReachedCurrentPeriodCap: boolean;
}
