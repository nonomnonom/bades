/* @license Enterprise */

import { registerEnumType } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { BillingPriceEntity } from 'src/engine/core-modules/billing/entities/billing-price.entity';
import { BillingUsageType } from 'src/engine/core-modules/billing/enums/billing-usage-type.enum';
import { BillingProductMetadata } from 'src/engine/core-modules/billing/types/billing-product-metadata.type';

registerEnumType(BillingUsageType, { name: 'BillingUsageType' });

@Entity({ name: 'billingProduct', schema: 'core' })
export class BillingProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'timestamptz' })
  deletedAt?: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ nullable: false })
  active: boolean;

  @Column({ nullable: false, type: 'text', default: '' })
  description: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, type: 'text' })
  taxCode: string | null;

  @Column({ nullable: false, type: 'jsonb', default: [] })
  images: string[];

  /** Fitur marketing dalam format string sederhana, bukan tipe Stripe. */
  @Column({ nullable: false, type: 'jsonb', default: [] })
  marketingFeatures: string[];

  /**
   * Kode produk internal Bades, mis. `bades-product-base`.
   * Menggantikan stripeProductId.
   */
  @Column({ nullable: false, unique: true })
  productCode: string;

  /**
   * Slug harga default untuk produk ini.
   * Menggantikan defaultStripePriceId.
   */
  @Column({ nullable: true, type: 'text' })
  defaultPriceId: string | null;

  @Column({ nullable: false, type: 'jsonb', default: {} })
  metadata: BillingProductMetadata;

  @OneToMany(
    () => BillingPriceEntity,
    (billingPrice) => billingPrice.billingProduct,
  )
  billingPrices: Relation<BillingPriceEntity[]>;

  @Column({ nullable: true, type: 'text' })
  unitLabel: string | null;

  @Column({ nullable: true, type: 'text' })
  url: string | null;
}
