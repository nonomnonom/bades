/* @license Enterprise */

import { Field } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { BillingProductEntity } from 'src/engine/core-modules/billing/entities/billing-product.entity';
import { BillingPriceBillingScheme } from 'src/engine/core-modules/billing/enums/billing-price-billing-scheme.enum';
import { BillingPriceTaxBehavior } from 'src/engine/core-modules/billing/enums/billing-price-tax-behavior.enum';
import { BillingPriceType } from 'src/engine/core-modules/billing/enums/billing-price-type.enum';
import { SubscriptionInterval } from 'src/engine/core-modules/billing/enums/billing-subscription-interval.enum';
import { BillingUsageType } from 'src/engine/core-modules/billing/enums/billing-usage-type.enum';
import { BillingPriceMetadata } from 'src/engine/core-modules/billing/types/billing-price-metadata.type';

/**
 * Tier harga bertingkat (untuk METERED pricing) — tipe lokal Bades.
 */
export type BillingPriceTierLocal = {
  up_to: number | null;
  unit_amount: number | null;
  unit_amount_decimal: string | null;
  flat_amount: number | null;
  flat_amount_decimal: string | null;
};

@Entity({ name: 'billingPrice', schema: 'core' })
export class BillingPriceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'timestamptz' })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  /** Slug harga internal Bades, mis. `bades-price-pro-monthly`. */
  @Column({ nullable: false, unique: true })
  priceId: string;

  @Column({ nullable: false })
  active: boolean;

  /**
   * Kode produk yang merujuk ke billingProduct.productCode.
   */
  @Column({ nullable: false })
  productCode: string;

  @Column({ nullable: false })
  currency: string;

  @Column({ nullable: true, type: 'text' })
  nickname: string | null;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Object.values(BillingPriceTaxBehavior),
  })
  taxBehavior: BillingPriceTaxBehavior;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Object.values(BillingPriceType),
  })
  type: BillingPriceType;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Object.values(BillingPriceBillingScheme),
  })
  billingScheme: BillingPriceBillingScheme;

  @Column({ nullable: true, type: 'jsonb' })
  tiers: BillingPriceTierLocal[] | null;

  @Column({ nullable: true, type: 'text' })
  unitAmountDecimal: string | null;

  @Column({ nullable: true, type: 'numeric' })
  unitAmount: number | null;

  @Column({ nullable: false, type: 'jsonb', default: {} })
  metadata: BillingPriceMetadata;

  @Field(() => BillingUsageType)
  @Column({
    type: 'enum',
    enum: Object.values(BillingUsageType),
    nullable: false,
  })
  usageType: BillingUsageType;

  @Field(() => SubscriptionInterval)
  @Column({
    type: 'enum',
    enum: Object.values(SubscriptionInterval),
  })
  interval: SubscriptionInterval;

  @ManyToOne(
    () => BillingProductEntity,
    (billingProduct) => billingProduct.billingPrices,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn({
    referencedColumnName: 'productCode',
    name: 'productCode',
  })
  billingProduct: Relation<BillingProductEntity> | null;
}
