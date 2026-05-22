import { type QueryRunner } from 'typeorm';

const tableName = 'billingCustomer';

type SeedBillingCustomersArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
};

/**
 * Membuat data awal pelanggan billing untuk workspace dev.
 * Midtrans-only: tidak menggunakan stripeCustomerId.
 */
export const seedBillingCustomers = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: SeedBillingCustomersArgs): Promise<string> => {
  const result = await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${tableName}`, ['workspaceId'])
    .orIgnore()
    .values([{ workspaceId }])
    .returning('id')
    .execute();

  const customerId = result.generatedMaps?.[0]?.id as string | undefined;

  if (!customerId) {
    const existing = await queryRunner.manager
      .createQueryBuilder()
      .select('bc.id', 'id')
      .from(`${schemaName}.${tableName}`, 'bc')
      .where('bc."workspaceId" = :workspaceId', { workspaceId })
      .getRawOne<{ id: string }>();

    return existing?.id ?? '';
  }

  return customerId;
};
