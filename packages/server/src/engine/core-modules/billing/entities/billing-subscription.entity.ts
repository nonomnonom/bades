/* @license Enterprise */

import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { IDField } from '@ptc-org/nestjs-query-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { BillingSubscriptionSchedulePhaseDTO } from 'src/engine/core-modules/billing/dtos/billing-subscription-schedule-phase.dto';
import { BillingSubscriptionItemDTO } from 'src/engine/core-modules/billing/dtos/billing-subscription-item.dto';
import { BillingCustomerEntity } from 'src/engine/core-modules/billing/entities/billing-customer.entity';
import { BillingSubscriptionItemEntity } from 'src/engine/core-modules/billing/entities/billing-subscription-item.entity';
import { BillingSubscriptionCollectionMethod } from 'src/engine/core-modules/billing/enums/billing-subscription-collection-method.enum';
import { SubscriptionInterval } from 'src/engine/core-modules/billing/enums/billing-subscription-interval.enum';
import { SubscriptionStatus } from 'src/engine/core-modules/billing/enums/billing-subscription-status.enum';
import { BillingPlanKey } from 'src/engine/core-modules/billing/enums/billing-plan-key.enum';
import { WorkspaceRelatedEntity } from 'src/engine/workspace-manager/types/workspace-related-entity';

registerEnumType(SubscriptionStatus, { name: 'SubscriptionStatus' });
registerEnumType(SubscriptionInterval, { name: 'SubscriptionInterval' });

@Entity({ name: 'billingSubscription', schema: 'core' })
@Index('IDX_BILLING_SUBSCRIPTION_WORKSPACE_ID_UNIQUE', ['workspaceId'], {
  unique: true,
  where: `status IN ('trialing', 'active', 'past_due')`,
})
@ObjectType('BillingSubscription')
export class BillingSubscriptionEntity extends WorkspaceRelatedEntity {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'timestamptz' })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  /**
   * FK ke billingCustomer.id — pengganti join via stripeCustomerId.
   * Nullable untuk kompatibilitas mundur dengan baris lama yang belum dimigrasi.
   */
  @Column({ nullable: true, type: 'uuid' })
  billingCustomerId: string | null;

  /**
   * Kode paket langganan Bades, mis. PRO atau ENTERPRISE.
   * Menggantikan penghitungan runtim dari metadata Stripe.
   */
  @Field(() => BillingPlanKey, { nullable: true })
  @Column({
    nullable: true,
    type: 'enum',
    enum: Object.values(BillingPlanKey),
  })
  planKey: BillingPlanKey | null;

  @Field(() => SubscriptionStatus)
  @Column({
    type: 'enum',
    enum: Object.values(SubscriptionStatus),
    nullable: false,
  })
  status: SubscriptionStatus;

  @Field(() => SubscriptionInterval, { nullable: true })
  @Column({
    type: 'enum',
    enum: Object.values(SubscriptionInterval),
    nullable: true,
  })
  interval: SubscriptionInterval;

  @Field(() => [BillingSubscriptionItemDTO], { nullable: true })
  @OneToMany(
    () => BillingSubscriptionItemEntity,
    (billingSubscriptionItem) => billingSubscriptionItem.billingSubscription,
  )
  billingSubscriptionItems: Relation<BillingSubscriptionItemEntity[]>;

  @ManyToOne(
    () => BillingCustomerEntity,
    (billingCustomer) => billingCustomer.billingSubscriptions,
    {
      nullable: true,
      onDelete: 'CASCADE',
      createForeignKeyConstraints: false,
    },
  )
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'billingCustomerId',
  })
  billingCustomer: Relation<BillingCustomerEntity> | null;

  @Column({ nullable: false, default: false })
  cancelAtPeriodEnd: boolean;

  /** Mata uang default IDR (Rupiah) sesuai arah pembayaran Bades via Midtrans. */
  @Column({ nullable: false, default: 'IDR' })
  currency: string;

  @Field(() => Date, { nullable: true })
  @Column({
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  currentPeriodEnd: Date;

  @Column({
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  currentPeriodStart: Date;

  /**
   * Perubahan paket/interval terjadwal untuk periode berikutnya.
   * Format item: { price: string; quantity?: number }.
   */
  @Field(() => [BillingSubscriptionSchedulePhaseDTO])
  @Column({ nullable: false, type: 'jsonb', default: [] })
  phases: Array<BillingSubscriptionSchedulePhaseDTO>;

  @Column({ nullable: true, type: 'timestamptz' })
  cancelAt: Date | null;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
  canceledAt: Date | null;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Object.values(BillingSubscriptionCollectionMethod),
    default: BillingSubscriptionCollectionMethod.CHARGE_AUTOMATICALLY,
  })
  collectionMethod: BillingSubscriptionCollectionMethod;

  @Column({ nullable: true, type: 'timestamptz' })
  endedAt: Date | null;

  @Column({ nullable: true, type: 'timestamptz' })
  trialStart: Date | null;

  @Column({ nullable: true, type: 'timestamptz' })
  trialEnd: Date | null;
}
