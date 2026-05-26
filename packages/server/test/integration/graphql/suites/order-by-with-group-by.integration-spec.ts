import { randomUUID } from 'crypto';

import { KELUARGA_GQL_FIELDS } from 'test/integration/constants/keluarga-gql-fields.constants';
import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { destroyOneOperationFactory } from 'test/integration/graphql/utils/destroy-one-operation-factory.util';
import { groupByOperationFactory } from 'test/integration/graphql/utils/group-by-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';

// Bades: test order-by pada group-by menggunakan objek `keluarga` (Kartu Keluarga)
// sebagai pengganti `company` dari CRM warisan Twenty.
// Field mapping:
//   company.address.addressCity → keluarga.kecamatan (TEXT)
//   company.employees           → keluarga.jumlahAnggota (NUMBER)
//   company.annualRecurringRevenue.amountMicros → keluarga.klasifikasiKeluarga (SELECT)
//   companiesGroupBy            → keluargasGroupBy
//   avgEmployees                → avgJumlahAnggota

describe('group-by resolvers - order by', () => {
  const testKeluargaId1 = randomUUID();
  const testKeluargaId2 = randomUUID();
  const testKeluargaId3 = randomUUID();
  const testKeluargaId4 = randomUUID();
  const testKeluargaId5 = randomUUID();
  const testKeluargaId6 = randomUUID();
  const testKeluargaId7 = randomUUID();

  beforeAll(async () => {
    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: {
          id: testKeluargaId1,
          createdAt: '2025-03-03T09:30:00.000Z', // Monday
          kecamatan: 'Cukup',
          jumlahAnggota: 20,
          klasifikasiKeluarga: 'MAMPU',
        },
      }),
    );
    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: {
          id: testKeluargaId7,
          createdAt: '2025-03-03T09:30:00.000Z', // Monday
          kecamatan: 'Anyer',
          jumlahAnggota: 19,
          klasifikasiKeluarga: 'MAMPU',
        },
      }),
    );

    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: {
          id: testKeluargaId2,
          createdAt: '2025-03-03T09:30:00.000Z', // Monday
          kecamatan: 'Cukup',
          jumlahAnggota: 19,
          klasifikasiKeluarga: 'MENENGAH',
        },
      }),
    );
    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: {
          id: testKeluargaId3,
          createdAt: '2025-03-03T09:30:00.000Z', // Monday
          kecamatan: 'Dander',
          jumlahAnggota: 2,
          klasifikasiKeluarga: 'MAMPU',
        },
      }),
    );
    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: {
          id: testKeluargaId4,
          createdAt: '2025-01-02T12:00:00.000Z', // Thursday
          kecamatan: 'Purwosari',
          jumlahAnggota: 10,
          klasifikasiKeluarga: 'MAMPU',
        },
      }),
    );
    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: {
          id: testKeluargaId5,
          createdAt: '2025-01-08T08:00:00.000Z', // Wednesday
          kecamatan: 'Balongan',
          jumlahAnggota: 5,
          klasifikasiKeluarga: 'MAMPU',
        },
      }),
    );
    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: {
          id: testKeluargaId6,
          createdAt: '2025-01-08T08:00:00.000Z', // Wednesday
          kecamatan: 'Balongan',
          jumlahAnggota: 1,
          klasifikasiKeluarga: 'MAMPU',
        },
      }),
    );
  });

  afterAll(async () => {
    // cleanup created daftarKeluarga
    for (const id of [
      testKeluargaId1,
      testKeluargaId2,
      testKeluargaId3,
      testKeluargaId4,
      testKeluargaId5,
      testKeluargaId6,
      testKeluargaId7,
    ]) {
      await makeGraphqlAPIRequest(
        destroyOneOperationFactory({
          objectMetadataSingularName: 'keluarga',
          gqlFields: 'id',
          recordId: id,
        }),
      );
    }
  });

  const filter2025 = {
    and: [
      {
        createdAt: {
          gte: '2025-01-01T00:00:00.000Z',
        },
      },
      {
        createdAt: {
          lte: '2025-03-03T23:59:59.999Z',
        },
      },
    ],
  };

  const groupByKecamatanCreatedAtDanKlasifikasi = (orderBy: object[]) => {
    return groupByOperationFactory({
      objectMetadataSingularName: 'keluarga',
      objectMetadataPluralName: 'daftarKeluarga',
      groupBy: [
        { kecamatan: true },
        { createdAt: { granularity: 'DAY_OF_THE_WEEK' } },
        { klasifikasiKeluarga: true },
      ],
      orderBy,
      filter: filter2025,
      gqlFields: `
        avgJumlahAnggota
      `,
    });
  };

  describe('valid cases', () => {
    it('should order results in the right order - createdAt, avgJumlahAnggota, kecamatan', async () => {
      const response = await makeGraphqlAPIRequest(
        groupByKecamatanCreatedAtDanKlasifikasi([
          {
            createdAt: {
              granularity: 'DAY_OF_THE_WEEK',
              orderBy: 'AscNullsFirst',
            },
          },
          {
            aggregate: {
              avgJumlahAnggota: 'AscNullsFirst',
            },
          },
          {
            kecamatan: 'AscNullsFirst',
          },
        ]),
      );

      const groups = response.body.data.keluargasGroupBy;

      expect(groups).toBeDefined();
      expect(Array.isArray(groups)).toBe(true);

      // Ekstrak info group untuk assertion
      const groupInfos = groups.map((g: any) => ({
        kecamatan: g.groupByDimensionValues?.[0],
        dayOfWeek: g.groupByDimensionValues?.[1],
        klasifikasi: g.groupByDimensionValues?.[2],
        avgJumlahAnggota: g.avgJumlahAnggota,
        totalCount: g.totalCount,
      }));

      // Urutan: dayOfWeek (kronologis) lalu avgJumlahAnggota lalu kecamatan
      expect(groupInfos).toEqual([
        {
          kecamatan: 'Dander',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 2,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Anyer',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 19,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Cukup',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 19,
          totalCount: 1,
          klasifikasi: 'MENENGAH',
        },
        {
          kecamatan: 'Cukup',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 20,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Balongan',
          dayOfWeek: 'Wednesday',
          avgJumlahAnggota: 3,
          totalCount: 2,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Purwosari',
          dayOfWeek: 'Thursday',
          avgJumlahAnggota: 10,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
      ]);
    });

    it('should order results in the right order - createdAt, kecamatan, avgJumlahAnggota', async () => {
      const response = await makeGraphqlAPIRequest(
        groupByKecamatanCreatedAtDanKlasifikasi([
          {
            createdAt: {
              granularity: 'DAY_OF_THE_WEEK',
              orderBy: 'AscNullsFirst',
            },
          },
          {
            kecamatan: 'AscNullsFirst',
          },
          {
            aggregate: {
              avgJumlahAnggota: 'AscNullsFirst',
            },
          },
        ]),
      );
      const groups = response.body.data.keluargasGroupBy;

      expect(groups).toBeDefined();
      expect(Array.isArray(groups)).toBe(true);

      const groupInfos = groups.map((g: any) => ({
        kecamatan: g.groupByDimensionValues?.[0],
        dayOfWeek: g.groupByDimensionValues?.[1],
        klasifikasi: g.groupByDimensionValues?.[2],
        avgJumlahAnggota: g.avgJumlahAnggota,
        totalCount: g.totalCount,
      }));

      // Urutan: dayOfWeek (kronologis) lalu kecamatan lalu avgJumlahAnggota
      expect(groupInfos).toEqual([
        {
          kecamatan: 'Anyer',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 19,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Cukup',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 19,
          totalCount: 1,
          klasifikasi: 'MENENGAH',
        },
        {
          kecamatan: 'Cukup',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 20,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Dander',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 2,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Balongan',
          dayOfWeek: 'Wednesday',
          avgJumlahAnggota: 3,
          totalCount: 2,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Purwosari',
          dayOfWeek: 'Thursday',
          avgJumlahAnggota: 10,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
      ]);
    });

    it('should order results in the right order - kecamatan, createdAt, avgJumlahAnggota', async () => {
      const response = await makeGraphqlAPIRequest(
        groupByKecamatanCreatedAtDanKlasifikasi([
          {
            kecamatan: 'AscNullsFirst',
          },
          {
            createdAt: {
              granularity: 'DAY_OF_THE_WEEK',
              orderBy: 'AscNullsFirst',
            },
          },
          {
            aggregate: {
              avgJumlahAnggota: 'AscNullsFirst',
            },
          },
        ]),
      );
      const groups = response.body.data.keluargasGroupBy;

      expect(groups).toBeDefined();
      expect(Array.isArray(groups)).toBe(true);

      const groupInfos = groups.map((g: any) => ({
        kecamatan: g.groupByDimensionValues?.[0],
        dayOfWeek: g.groupByDimensionValues?.[1],
        klasifikasi: g.groupByDimensionValues?.[2],
        avgJumlahAnggota: g.avgJumlahAnggota,
        totalCount: g.totalCount,
      }));

      expect(groupInfos).toEqual([
        {
          kecamatan: 'Anyer',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 19,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Balongan',
          dayOfWeek: 'Wednesday',
          avgJumlahAnggota: 3,
          totalCount: 2,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Cukup',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 19,
          totalCount: 1,
          klasifikasi: 'MENENGAH',
        },
        {
          kecamatan: 'Cukup',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 20,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Dander',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 2,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Purwosari',
          dayOfWeek: 'Thursday',
          avgJumlahAnggota: 10,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
      ]);
    });

    it('should order results in the right order - avgJumlahAnggota, createdAt, kecamatan', async () => {
      const response = await makeGraphqlAPIRequest(
        groupByKecamatanCreatedAtDanKlasifikasi([
          {
            aggregate: {
              avgJumlahAnggota: 'AscNullsFirst',
            },
          },
          {
            createdAt: {
              granularity: 'DAY_OF_THE_WEEK',
              orderBy: 'AscNullsFirst',
            },
          },
          {
            kecamatan: 'AscNullsFirst',
          },
        ]),
      );
      const groups = response.body.data.keluargasGroupBy;

      expect(groups).toBeDefined();
      expect(Array.isArray(groups)).toBe(true);

      const groupInfos = groups.map((g: any) => ({
        kecamatan: g.groupByDimensionValues?.[0],
        dayOfWeek: g.groupByDimensionValues?.[1],
        klasifikasi: g.groupByDimensionValues?.[2],
        avgJumlahAnggota: g.avgJumlahAnggota,
        totalCount: g.totalCount,
      }));

      expect(groupInfos).toEqual([
        {
          kecamatan: 'Dander',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 2,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Balongan',
          dayOfWeek: 'Wednesday',
          avgJumlahAnggota: 3,
          totalCount: 2,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Purwosari',
          dayOfWeek: 'Thursday',
          avgJumlahAnggota: 10,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Anyer',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 19,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
        {
          kecamatan: 'Cukup',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 19,
          totalCount: 1,
          klasifikasi: 'MENENGAH',
        },
        {
          kecamatan: 'Cukup',
          dayOfWeek: 'Monday',
          avgJumlahAnggota: 20,
          totalCount: 1,
          klasifikasi: 'MAMPU',
        },
      ]);
    });
  });

  describe('chronological ordering for date granularities', () => {
    it('should order DAY_OF_THE_WEEK chronologically (Monday=1 to Sunday=7), not alphabetically', async () => {
      const response = await makeGraphqlAPIRequest(
        groupByOperationFactory({
          objectMetadataSingularName: 'keluarga',
          objectMetadataPluralName: 'daftarKeluarga',
          groupBy: [{ createdAt: { granularity: 'DAY_OF_THE_WEEK' } }],
          orderBy: [
            {
              createdAt: {
                granularity: 'DAY_OF_THE_WEEK',
                orderBy: 'AscNullsFirst',
              },
            },
          ],
          filter: filter2025,
          gqlFields: `
            totalCount
          `,
        }),
      );

      const groups = response.body.data.keluargasGroupBy;

      expect(groups).toBeDefined();
      expect(Array.isArray(groups)).toBe(true);

      const dayOrder = groups.map((g: any) => g.groupByDimensionValues?.[0]);

      // Monday (1), Wednesday (3), Thursday (4) - urutan kronologis
      expect(dayOrder).toEqual(['Monday', 'Wednesday', 'Thursday']);
    });

    it('should order DAY_OF_THE_WEEK in descending chronological order', async () => {
      const response = await makeGraphqlAPIRequest(
        groupByOperationFactory({
          objectMetadataSingularName: 'keluarga',
          objectMetadataPluralName: 'daftarKeluarga',
          groupBy: [{ createdAt: { granularity: 'DAY_OF_THE_WEEK' } }],
          orderBy: [
            {
              createdAt: {
                granularity: 'DAY_OF_THE_WEEK',
                orderBy: 'DescNullsLast',
              },
            },
          ],
          filter: filter2025,
          gqlFields: `
            totalCount
          `,
        }),
      );

      const groups = response.body.data.keluargasGroupBy;

      expect(groups).toBeDefined();

      const dayOrder = groups.map((g: any) => g.groupByDimensionValues?.[0]);

      // Thursday (4), Wednesday (3), Monday (1) - urutan kronologis terbalik
      expect(dayOrder).toEqual(['Thursday', 'Wednesday', 'Monday']);
    });

    it('should order MONTH_OF_THE_YEAR chronologically (January=1 to December=12), not alphabetically', async () => {
      // Data test: Januari (keluarga 4,5,6) dan Maret (keluarga 1,2,3,7)
      const response = await makeGraphqlAPIRequest(
        groupByOperationFactory({
          objectMetadataSingularName: 'keluarga',
          objectMetadataPluralName: 'daftarKeluarga',
          groupBy: [{ createdAt: { granularity: 'MONTH_OF_THE_YEAR' } }],
          orderBy: [
            {
              createdAt: {
                granularity: 'MONTH_OF_THE_YEAR',
                orderBy: 'AscNullsFirst',
              },
            },
          ],
          filter: filter2025,
          gqlFields: `
            totalCount
          `,
        }),
      );

      const groups = response.body.data.keluargasGroupBy;

      expect(groups).toBeDefined();
      expect(Array.isArray(groups)).toBe(true);

      const monthOrder = groups.map((g: any) => g.groupByDimensionValues?.[0]);

      // January (1), March (3) - urutan kronologis
      expect(monthOrder).toEqual(['January', 'March']);
    });

    it('should order MONTH_OF_THE_YEAR in descending chronological order', async () => {
      const response = await makeGraphqlAPIRequest(
        groupByOperationFactory({
          objectMetadataSingularName: 'keluarga',
          objectMetadataPluralName: 'daftarKeluarga',
          groupBy: [{ createdAt: { granularity: 'MONTH_OF_THE_YEAR' } }],
          orderBy: [
            {
              createdAt: {
                granularity: 'MONTH_OF_THE_YEAR',
                orderBy: 'DescNullsLast',
              },
            },
          ],
          filter: filter2025,
          gqlFields: `
            totalCount
          `,
        }),
      );

      const groups = response.body.data.keluargasGroupBy;

      expect(groups).toBeDefined();

      const monthOrder = groups.map((g: any) => g.groupByDimensionValues?.[0]);

      // March (3), January (1) - urutan kronologis terbalik
      expect(monthOrder).toEqual(['March', 'January']);
    });
  });

  describe('invalid cases', () => {
    it('should fail if attempt to order by a field that is not part of the groupBy', async () => {
      const response = await makeGraphqlAPIRequest(
        groupByKecamatanCreatedAtDanKlasifikasi([
          { jumlahAnggota: 'AscNullsFirst' },
        ]),
      );

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0].message).toBe(
        'Cannot order by a field that is not an aggregate nor in groupBy criteria: jumlahAnggota.',
      );
    });

    it('should fail if attempt to order by a date granularity that is not the same as in the groupBy', async () => {
      const response = await makeGraphqlAPIRequest(
        groupByKecamatanCreatedAtDanKlasifikasi([
          { createdAt: { granularity: 'MONTH', orderBy: 'AscNullsFirst' } },
        ]),
      );

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0].message).toBe(
        'Cannot order by a date granularity that is not in groupBy criteria: MONTH',
      );
    });

    it('should fail if attempt to order by a date without indicating the granularity', async () => {
      const response = await makeGraphqlAPIRequest(
        groupByKecamatanCreatedAtDanKlasifikasi([
          { createdAt: { orderBy: 'AscNullsFirst' } },
        ]),
      );

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0].message).toContain(
        'Cannot order by a field that is not in groupBy or that is not an aggregate field',
      );
    });

    it('should fail if attempt to indicate more than one orderBy field at the time (aggregate)', async () => {
      const response = await makeGraphqlAPIRequest(
        groupByKecamatanCreatedAtDanKlasifikasi([
          {
            aggregate: {
              avgJumlahAnggota: 'AscNullsFirst',
              minJumlahAnggota: 'AscNullsFirst',
            },
          },
        ]),
      );

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0].message).toBe(
        'Please provide aggregate criteria one by one in orderBy array',
      );
    });

    it('should fail if attempt to indicate more than one orderBy field at the time', async () => {
      const response = await makeGraphqlAPIRequest(
        groupByKecamatanCreatedAtDanKlasifikasi([
          {
            jumlahAnggota: 'AscNullsFirst',
            nomorKk: 'AscNullsFirst',
          },
        ]),
      );

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0].message).toBe(
        'Please provide orderBy field criteria one by one in orderBy array',
      );
    });
  });
});
