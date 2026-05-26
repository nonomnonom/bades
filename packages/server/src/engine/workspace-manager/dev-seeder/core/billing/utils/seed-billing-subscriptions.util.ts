import { type QueryRunner } from 'typeorm';

const tableName = 'billingSubscription';

type SeedBillingSubscriptionsArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
  billingCustomerId: string;
};

/**
 * Membuat data awal subscription billing untuk workspace dev.
 * Identifikasi langganan via billingCustomerId (FK ke billingCustomer.id)
 * dan planKey internal Bades.
 */
export const seedBillingSubscriptions = async ({
  queryRunner,
  schemaName,
  workspaceId,
  billingCustomerId,
}: SeedBillingSubscriptionsArgs) => {
  const now = new Date();
  const nextMonth = new Date(now);

  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${tableName}`, [
      'workspaceId',
      'billingCustomerId',
      'planKey',
      'status',
      'currentPeriodStart',
      'currentPeriodEnd',
    ])
    .orIgnore()
    .values([
      {
        workspaceId,
        billingCustomerId,
        planKey: 'PRO',
        status: 'active',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: nextMonth.toISOString(),
      },
    ])
    .execute();
};
