import { randomUUID } from 'crypto';

import { KELUARGA_GQL_FIELDS } from 'test/integration/constants/keluarga-gql-fields.constants';
import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { destroyOneOperationFactory } from 'test/integration/graphql/utils/destroy-one-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { makeRestAPIRequest } from 'test/integration/rest/utils/make-rest-api-request.util';

const PROGRAM_BANTUAN_GQL_FIELDS = `
  id
  status
  totalAnggaran
  createdAt
`;

// digunakan agar tidak tercampur dengan record seed
const FILTER_2020 =
  "createdAt[gte]:'2020-01-01T00:00:00.000Z',createdAt[lte]:'2020-03-03T23:59:59.999Z'";

const AGGREGATE_FIELDS = '["maxTotalAnggaran"]';

describe('REST API Core Group By endpoint', () => {
  const testProgramBantuanId1 = randomUUID();
  const testProgramBantuanId2 = randomUUID();
  const testProgramBantuanId3 = randomUUID();
  const testProgramBantuanId4 = randomUUID();
  const testKeluargaId1 = randomUUID();
  const testKeluargaId2 = randomUUID();
  const KELUARGA_1_JUMLAH_ANGGOTA = 10;
  const KELUARGA_2_JUMLAH_ANGGOTA = 20;

  beforeAll(async () => {
    // Buat data keluarga untuk referensi
    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: {
          id: testKeluargaId1,
          nomorKk: '3201000000000001',
          jumlahAnggota: KELUARGA_1_JUMLAH_ANGGOTA,
          createdAt: '2020-02-05T08:00:00.000Z',
        },
      }),
    );

    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: {
          id: testKeluargaId2,
          nomorKk: '3201000000000002',
          jumlahAnggota: KELUARGA_2_JUMLAH_ANGGOTA,
          createdAt: '2020-02-05T08:00:00.000Z',
        },
      }),
    );

    // Buat data program bantuan dengan status dan tanggal berbeda
    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'programBantuan',
        gqlFields: PROGRAM_BANTUAN_GQL_FIELDS,
        data: {
          id: testProgramBantuanId1,
          status: 'AKTIF',
          namaProgram: 'Program Bantuan 1',
          totalAnggaran: 1000,
          createdAt: '2020-02-05T08:00:00.000Z',
        },
      }),
    );

    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'programBantuan',
        gqlFields: PROGRAM_BANTUAN_GQL_FIELDS,
        data: {
          id: testProgramBantuanId2,
          status: 'AKTIF',
          namaProgram: 'Program Bantuan 2',
          totalAnggaran: 2000,
          createdAt: '2020-02-06T08:00:00.000Z',
        },
      }),
    );

    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'programBantuan',
        gqlFields: PROGRAM_BANTUAN_GQL_FIELDS,
        data: {
          id: testProgramBantuanId3,
          status: 'AKTIF',
          namaProgram: 'Program Bantuan 3',
          totalAnggaran: 3000,
          createdAt: '2020-02-06T08:00:00.000Z',
        },
      }),
    );

    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'programBantuan',
        gqlFields: PROGRAM_BANTUAN_GQL_FIELDS,
        data: {
          id: testProgramBantuanId4,
          status: 'SELESAI',
          namaProgram: 'Program Bantuan 4',
          totalAnggaran: 4000,
          createdAt: '2020-02-06T08:00:00.000Z',
        },
      }),
    );
  });

  afterAll(async () => {
    // Bersihkan data program bantuan
    for (const id of [
      testProgramBantuanId1,
      testProgramBantuanId2,
      testProgramBantuanId3,
      testProgramBantuanId4,
    ]) {
      await makeGraphqlAPIRequest(
        destroyOneOperationFactory({
          objectMetadataSingularName: 'programBantuan',
          gqlFields: 'id',
          recordId: id,
        }),
      );
    }

    // Bersihkan data keluarga
    for (const id of [testKeluargaId1, testKeluargaId2]) {
      await makeGraphqlAPIRequest(
        destroyOneOperationFactory({
          objectMetadataSingularName: 'keluarga',
          gqlFields: 'id',
          recordId: id,
        }),
      );
    }
  });

  it('groups by status and createdAt with records', async () => {
    const groupByQuery = JSON.stringify([
      {
        createdAt: {
          granularity: 'DAY_OF_THE_WEEK',
        },
      },
      {
        status: true,
      },
    ]);

    const response = await makeRestAPIRequest({
      method: 'get',
      path: `/daftarProgramBantuan/groupBy?group_by=${encodeURIComponent(groupByQuery)}&aggregate=${encodeURIComponent(AGGREGATE_FIELDS)}&filter=${encodeURIComponent(FILTER_2020)}&include_records_sample=true&limit=3`,
      body: {},
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();

    const groups = response.body;

    expect(groups).toBeDefined();
    expect(groups).toHaveLength(3);

    groups.forEach((group: any) => {
      expect(group.groupByDimensionValues).toBeDefined();
      expect(Array.isArray(group.groupByDimensionValues)).toBe(true);
      expect(group.records).toBeDefined();
      expect(Array.isArray(group.records)).toBe(true);
    });

    const wednesdayAktifGroup = groups.find(
      (group: any) =>
        group.groupByDimensionValues.includes('Wednesday') &&
        group.groupByDimensionValues.includes('AKTIF'),
    );

    expect(wednesdayAktifGroup).toBeDefined();
    expect(wednesdayAktifGroup.maxTotalAnggaran).toBe('1000');
    expect(wednesdayAktifGroup.records).toHaveLength(1);
    expect(wednesdayAktifGroup.records[0].namaProgram).toBe('Program Bantuan 1');
    expect(wednesdayAktifGroup.records[0].status).toBe('AKTIF');

    const thursdayAktifGroup = groups.find(
      (group: any) =>
        group.groupByDimensionValues.includes('Thursday') &&
        group.groupByDimensionValues.includes('AKTIF'),
    );

    expect(thursdayAktifGroup).toBeDefined();
    expect(thursdayAktifGroup.records).toHaveLength(2);
    expect(thursdayAktifGroup.maxTotalAnggaran).toBe('3000');
    const program2Record = thursdayAktifGroup.records.find(
      (record: any) => record.namaProgram === 'Program Bantuan 2',
    );
    const program3Record = thursdayAktifGroup.records.find(
      (record: any) => record.namaProgram === 'Program Bantuan 3',
    );

    expect(program2Record.status).toBe('AKTIF');
    expect(program2Record.namaProgram).toBe('Program Bantuan 2');
    expect(program3Record.status).toBe('AKTIF');
    expect(program3Record.namaProgram).toBe('Program Bantuan 3');

    const thursdaySelesaiGroup = groups.find(
      (group: any) =>
        group.groupByDimensionValues.includes('Thursday') &&
        group.groupByDimensionValues.includes('SELESAI'),
    );

    expect(thursdaySelesaiGroup).toBeDefined();
    expect(thursdaySelesaiGroup.records).toHaveLength(1);
    const program4Record = thursdaySelesaiGroup.records[0];

    expect(program4Record.status).toBe('SELESAI');
    expect(program4Record.namaProgram).toBe('Program Bantuan 4');
    expect(thursdaySelesaiGroup.maxTotalAnggaran).toBe('4000');
  });

  it('groups by status and createdAt with records and filters', async () => {
    const groupByQuery = JSON.stringify([
      {
        createdAt: {
          granularity: 'DAY_OF_THE_WEEK',
        },
      },
      {
        status: true,
      },
    ]);

    const filterQuery = `${FILTER_2020},status[eq]:'AKTIF'`;

    const response = await makeRestAPIRequest({
      method: 'get',
      path: `/daftarProgramBantuan/groupBy?group_by=${encodeURIComponent(groupByQuery)}&aggregate=${encodeURIComponent(AGGREGATE_FIELDS)}&filter=${encodeURIComponent(filterQuery)}&include_records_sample=true&limit=2`,
      body: {},
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();

    const groups = response.body;

    expect(groups).toHaveLength(2);
    const wednesdayAktifGroup = groups.find(
      (group: any) =>
        group.groupByDimensionValues.includes('Wednesday') &&
        group.groupByDimensionValues.includes('AKTIF'),
    );

    expect(wednesdayAktifGroup.groupByDimensionValues).toHaveLength(2);
    expect(wednesdayAktifGroup.groupByDimensionValues).toContain('AKTIF');
    expect(wednesdayAktifGroup.groupByDimensionValues).toContain('Wednesday');
    expect(wednesdayAktifGroup.records).toHaveLength(1);
    expect(wednesdayAktifGroup.records[0].status).toBe('AKTIF');

    const thursdayAktifGroup = groups.find(
      (group: any) =>
        group.groupByDimensionValues.includes('Thursday') &&
        group.groupByDimensionValues.includes('AKTIF'),
    );

    expect(thursdayAktifGroup.groupByDimensionValues).toHaveLength(2);
    expect(thursdayAktifGroup.groupByDimensionValues).toContain('AKTIF');
    expect(thursdayAktifGroup.groupByDimensionValues).toContain('Thursday');
    expect(thursdayAktifGroup.records).toHaveLength(2);
  });

  describe('order by for records', () => {
    const getGroupByRequestWithOrderByForRecords = (
      orderByForRecords: string,
    ) => {
      const groupByQuery = JSON.stringify([
        {
          createdAt: {
            granularity: 'DAY_OF_THE_WEEK',
          },
        },
        {
          status: true,
        },
      ]);

      return {
        method: 'get' as const,
        path: `/daftarProgramBantuan/groupBy?group_by=${encodeURIComponent(groupByQuery)}&filter=${encodeURIComponent(FILTER_2020)}&order_by_for_records=${encodeURIComponent(`namaProgram[${orderByForRecords}]`)}&include_records_sample=true&limit=5`,
        body: {},
      };
    };

    it('sorts by namaProgram in ascending order', async () => {
      const response = await makeRestAPIRequest(
        getGroupByRequestWithOrderByForRecords('AscNullsFirst'),
      );

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();

      const groups = response.body;

      const thursdayAktifGroup = groups.find(
        (group: any) =>
          group.groupByDimensionValues.includes('Thursday') &&
          group.groupByDimensionValues.includes('AKTIF'),
      );

      expect(thursdayAktifGroup).toBeDefined();
      expect(thursdayAktifGroup.records).toHaveLength(2);
      expect(thursdayAktifGroup.records[0].namaProgram).toBe('Program Bantuan 2');
      expect(thursdayAktifGroup.records[1].namaProgram).toBe('Program Bantuan 3');
    });

    it('sorts by namaProgram in descending order', async () => {
      const response = await makeRestAPIRequest(
        getGroupByRequestWithOrderByForRecords('DescNullsFirst'),
      );

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();

      const groups = response.body;

      const thursdayAktifGroup = groups.find(
        (group: any) =>
          group.groupByDimensionValues.includes('Thursday') &&
          group.groupByDimensionValues.includes('AKTIF'),
      );

      expect(thursdayAktifGroup).toBeDefined();
      expect(thursdayAktifGroup.records).toHaveLength(2);
      expect(thursdayAktifGroup.records[0].namaProgram).toBe('Program Bantuan 3');
      expect(thursdayAktifGroup.records[1].namaProgram).toBe('Program Bantuan 2');
    });
  });
});
