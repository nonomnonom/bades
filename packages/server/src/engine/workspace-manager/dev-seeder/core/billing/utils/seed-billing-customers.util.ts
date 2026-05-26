import { type QueryRunner } from 'typeorm';

const tableName = 'billingCustomer';

type SeedBillingCustomersArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
};

/**
 * Membuat data awal pelanggan billing untuk workspace dev.
 * Bades Midtrans-first: kolom legacy `legacyPaymentCustomerId` di-leave
 * NULL untuk pelanggan baru; `midtransCustomerRef` akan diisi saat
 * checkout pertama via Snap.
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
