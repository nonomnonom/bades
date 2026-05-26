import { randomUUID } from 'crypto';

import gql from 'graphql-tag';
import { KELUARGA_GQL_FIELDS } from 'test/integration/constants/keluarga-gql-fields.constants';
import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { destroyOneOperationFactory } from 'test/integration/graphql/utils/destroy-one-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';

// Bades: programBantuan menggantikan opportunity CRM warisan Twenty.
// Field mapping:
//   opportunity.stage (SELECT)        → programBantuan.status (SELECT)
//   opportunity.amount (CURRENCY)     → programBantuan.totalAnggaran (NUMBER)
//   opportunity.closeDate (DATE)      → Bades: tidak ada padanan langsung;
//                                        pakai createdAt untuk granularitas waktu.
//   opportunity.companyId (RELATION)  → programBantuan tidak punya relasi ke
//                                        keluarga secara langsung; test relasi
//                                        menggunakan keluarga→daftarPenduduk (ONE-TO-MANY).
const PROGRAM_BANTUAN_GQL_FIELDS = `
  id
  status
  totalAnggaran
  createdAt
`;

// used not to mix records with the seeded ones
const FILTER_2020 = {
  and: [
    {
      createdAt: {
        gte: '2020-01-01T00:00:00.000Z',
      },
    },
    {
      createdAt: {
        lte: '2020-03-03T23:59:59.999Z',
      },
    },
  ],
};

describe('basic group-by with records', () => {
  const testProgramBantuanId1 = randomUUID();
  const testProgramBantuanId2 = randomUUID();
  const testProgramBantuanId3 = randomUUID();
  const testProgramBantuanId4 = randomUUID();
  const testKeluargaId1 = randomUUID();
  const testKeluargaId2 = randomUUID();
  const KELUARGA_1_JUMLAH_ANGGOTA = 10;
  const KELUARGA_2_JUMLAH_ANGGOTA = 20;

  beforeAll(async () => {
    // Buat data keluarga untuk test groupBy relasi
    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: {
          id: testKeluargaId1,
          nomorKk: '3201010101010011',
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
          nomorKk: '3201010101010012',
          createdAt: '2020-02-05T08:00:00.000Z',
        },
      }),
    );

    // Buat program bantuan dengan status dan tanggal berbeda untuk groupBy
    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'programBantuan',
        gqlFields: PROGRAM_BANTUAN_GQL_FIELDS,
        data: {
          id: testProgramBantuanId1,
          status: 'AKTIF',
          namaProgram: 'Program Bantuan 1',
          totalAnggaran: 1000000,
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
          totalAnggaran: 2000000,
          createdAt: '2020-02-12T08:00:00.000Z',
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
          totalAnggaran: 3000000,
          createdAt: '2020-02-12T08:00:00.000Z',
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
          totalAnggaran: 4000000,
          createdAt: '2020-02-12T08:00:00.000Z',
        },
      }),
    );
  });

  afterAll(async () => {
    // Cleanup program bantuan
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

    // Cleanup keluarga
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
    const response = await makeGraphqlAPIRequest({
      query: gql`
        query DaftarProgramBantuanGroupBy(
          $groupBy: [ProgramBantuanGroupByInput!]!
          $filter: ProgramBantuanFilterInput
          $limit: Int
        ) {
          programBantuansGroupBy(
            groupBy: $groupBy
            filter: $filter
            limit: $limit
          ) {
            minCreatedAt
            groupByDimensionValues
            sumTotalAnggaran
            __typename
            edges {
              node {
                status
                createdAt
                namaProgram
                totalAnggaran
              }
            }
          }
        }
      `,
      variables: {
        groupBy: [
          {
            createdAt: {
              granularity: 'DAY_OF_THE_WEEK',
            },
          },
          {
            status: true,
          },
        ],
        filter: FILTER_2020,
        limit: 3,
      },
    });

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data).toBeDefined();

    const groups = response.body.data.programBantuansGroupBy;

    expect(groups).toBeDefined();
    expect(groups).toHaveLength(3);

    groups.forEach((group: any) => {
      expect(group.groupByDimensionValues).toBeDefined();
      expect(Array.isArray(group.groupByDimensionValues)).toBe(true);
      expect(group.edges).toBeDefined();
      expect(Array.isArray(group.edges)).toBe(true);
    });

    const wednesdayAktifGroup = groups.find(
      (group: any) =>
        group.groupByDimensionValues.includes('Wednesday') &&
        group.groupByDimensionValues.includes('AKTIF'),
    );

    expect(wednesdayAktifGroup).toBeDefined();
    expect(wednesdayAktifGroup.edges).toHaveLength(1);
    expect(wednesdayAktifGroup.edges[0].node.namaProgram).toBe(
      'Program Bantuan 1',
    );
    expect(wednesdayAktifGroup.edges[0].node.status).toBe('AKTIF');
    expect(wednesdayAktifGroup.edges[0].node.totalAnggaran).toBe(1000000);
    expect(wednesdayAktifGroup.sumTotalAnggaran).toBe(1000000);

    const thursdayAktifGroup = groups.find(
      (group: any) =>
        group.groupByDimensionValues.includes('Thursday') &&
        group.groupByDimensionValues.includes('AKTIF'),
    );

    expect(thursdayAktifGroup).toBeDefined();
    expect(thursdayAktifGroup.edges).toHaveLength(2);
    expect(thursdayAktifGroup.sumTotalAnggaran).toBe(5000000);

    const program2Edge = thursdayAktifGroup.edges.find(
      (edge: any) => edge.node.namaProgram === 'Program Bantuan 2',
    ).node;
    const program3Edge = thursdayAktifGroup.edges.find(
      (edge: any) => edge.node.namaProgram === 'Program Bantuan 3',
    ).node;

    expect(program2Edge.totalAnggaran).toBe(2000000);
    expect(program2Edge.status).toBe('AKTIF');
    expect(program2Edge.namaProgram).toBe('Program Bantuan 2');
    expect(program3Edge.totalAnggaran).toBe(3000000);
    expect(program3Edge.status).toBe('AKTIF');
    expect(program3Edge.namaProgram).toBe('Program Bantuan 3');

    const thursdaySelesaiGroup = groups.find(
      (group: any) =>
        group.groupByDimensionValues.includes('Thursday') &&
        group.groupByDimensionValues.includes('SELESAI'),
    );

    expect(thursdaySelesaiGroup).toBeDefined();
    expect(thursdaySelesaiGroup.edges).toHaveLength(1);
    const program4Edge = thursdaySelesaiGroup.edges[0].node;

    expect(program4Edge.totalAnggaran).toBe(4000000);
    expect(program4Edge.status).toBe('SELESAI');
    expect(program4Edge.namaProgram).toBe('Program Bantuan 4');
    expect(thursdaySelesaiGroup.sumTotalAnggaran).toBe(4000000);
  });

  it('groups by status and createdAt with records and filters', async () => {
    // Test dengan filter hanya AKTIF
    const response = await makeGraphqlAPIRequest({
      query: gql`
        query DaftarProgramBantuanGroupBy(
          $groupBy: [ProgramBantuanGroupByInput!]!
          $filter: ProgramBantuanFilterInput
          $limit: Int
        ) {
          programBantuansGroupBy(
            groupBy: $groupBy
            filter: $filter
            limit: $limit
          ) {
            minCreatedAt
            groupByDimensionValues
            sumTotalAnggaran
            __typename
            edges {
              node {
                status
                createdAt
                totalAnggaran
              }
            }
          }
        }
      `,
      variables: {
        groupBy: [
          {
            createdAt: {
              granularity: 'DAY_OF_THE_WEEK',
            },
          },
          {
            status: true,
          },
        ],
        filter: {
          and: [
            ...FILTER_2020.and,
            {
              status: {
                eq: 'AKTIF',
              },
            },
          ],
        },
        limit: 2,
      },
    });

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data).toBeDefined();

    const groups = response.body.data.programBantuansGroupBy;

    expect(groups).toHaveLength(2);

    const wednesdayAktifGroup = groups.find(
      (group: any) =>
        group.groupByDimensionValues.includes('Wednesday') &&
        group.groupByDimensionValues.includes('AKTIF'),
    );

    expect(wednesdayAktifGroup.groupByDimensionValues).toHaveLength(2);
    expect(wednesdayAktifGroup.groupByDimensionValues).toContain('AKTIF');
    expect(wednesdayAktifGroup.groupByDimensionValues).toContain('Wednesday');
    expect(wednesdayAktifGroup.edges).toHaveLength(1);
    expect(wednesdayAktifGroup.edges[0].node.status).toBe('AKTIF');
    expect(wednesdayAktifGroup.edges[0].node.totalAnggaran).toBe(1000000);

    const thursdayAktifGroup = groups.find(
      (group: any) =>
        group.groupByDimensionValues.includes('Thursday') &&
        group.groupByDimensionValues.includes('AKTIF'),
    );

    expect(thursdayAktifGroup.groupByDimensionValues).toHaveLength(2);
    expect(thursdayAktifGroup.groupByDimensionValues).toContain('AKTIF');
    expect(thursdayAktifGroup.groupByDimensionValues).toContain('Thursday');
    expect(thursdayAktifGroup.edges).toHaveLength(2);
  });

  it('groups daftarKeluarga by createdAt with records', async () => {
    const response = await makeGraphqlAPIRequest({
      query: gql`
        query DaftarKeluargaGroupBy(
          $groupBy: [KeluargaGroupByInput!]!
          $filter: KeluargaFilterInput
          $limit: Int
        ) {
          keluargasGroupBy(groupBy: $groupBy, filter: $filter, limit: $limit) {
            groupByDimensionValues
            __typename
            edges {
              node {
                nomorKk
              }
            }
          }
        }
      `,
      variables: {
        groupBy: [
          {
            createdAt: {
              granularity: 'DAY_OF_THE_WEEK',
            },
          },
        ],
        filter: FILTER_2020,
        limit: 2,
      },
    });

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data).toBeDefined();

    const groups = response.body.data.keluargasGroupBy;

    expect(groups).toHaveLength(1);

    const wednesdayGroup = groups.find((group: any) =>
      group.groupByDimensionValues.includes('Wednesday'),
    );

    expect(wednesdayGroup).toBeDefined();
    expect(wednesdayGroup.edges).toHaveLength(2);

    const keluarga1Edge = wednesdayGroup.edges.find(
      (edge: any) => edge.node.nomorKk === '3201010101010011',
    );
    const keluarga2Edge = wednesdayGroup.edges.find(
      (edge: any) => edge.node.nomorKk === '3201010101010012',
    );

    expect(keluarga1Edge).toBeDefined();
    expect(keluarga2Edge).toBeDefined();
  });

  describe('order by for records', () => {
    const getQueryWithOrderByForRecords = (orderByForRecords: string) => {
      return {
        query: gql`
          query DaftarProgramBantuanGroupBy(
            $groupBy: [ProgramBantuanGroupByInput!]!
            $filter: ProgramBantuanFilterInput
            $orderByForRecords: [ProgramBantuanOrderByInput!]
            $limit: Int
          ) {
            programBantuansGroupBy(
              groupBy: $groupBy
              filter: $filter
              orderByForRecords: $orderByForRecords
              limit: $limit
            ) {
              groupByDimensionValues
              __typename
              edges {
                node {
                  status
                  namaProgram
                }
              }
            }
          }
        `,
        variables: {
          groupBy: [
            {
              createdAt: {
                granularity: 'DAY_OF_THE_WEEK',
              },
            },
            {
              status: true,
            },
          ],
          orderByForRecords: [
            {
              namaProgram: orderByForRecords,
            },
          ],
          filter: FILTER_2020,
          limit: 20,
        },
      };
    };

    it('sorts by namaProgram in ascending order', async () => {
      const response = await makeGraphqlAPIRequest(
        getQueryWithOrderByForRecords('AscNullsFirst'),
      );

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data).toBeDefined();

      const groups = response.body.data.programBantuansGroupBy;

      const thursdayAktifGroup = groups.find(
        (group: any) =>
          group.groupByDimensionValues.includes('Thursday') &&
          group.groupByDimensionValues.includes('AKTIF'),
      );

      expect(thursdayAktifGroup).toBeDefined();
      expect(thursdayAktifGroup.edges).toHaveLength(2);
      expect(thursdayAktifGroup.edges[0].node.namaProgram).toBe(
        'Program Bantuan 2',
      );
      expect(thursdayAktifGroup.edges[1].node.namaProgram).toBe(
        'Program Bantuan 3',
      );
    });

    it('sorts by namaProgram in descending order', async () => {
      const response = await makeGraphqlAPIRequest(
        getQueryWithOrderByForRecords('DescNullsFirst'),
      );

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data).toBeDefined();

      const groups = response.body.data.programBantuansGroupBy;

      const thursdayAktifGroup = groups.find(
        (group: any) =>
          group.groupByDimensionValues.includes('Thursday') &&
          group.groupByDimensionValues.includes('AKTIF'),
      );

      expect(thursdayAktifGroup).toBeDefined();
      expect(thursdayAktifGroup.edges).toHaveLength(2);
      expect(thursdayAktifGroup.edges[0].node.namaProgram).toBe(
        'Program Bantuan 3',
      );
      expect(thursdayAktifGroup.edges[1].node.namaProgram).toBe(
        'Program Bantuan 2',
      );
    });

    // Bades: test order by relation field (company name) spesifik CRM tidak ada
    // padanan di programBantuan — programBantuan tidak punya relasi langsung ke
    // keluarga. Test case ini dihapus karena tidak relevan untuk SID.
    // // Bades: test scenario "sorts by relation field (company name)" spesifik CRM, tidak relevan untuk SID — dihapus
  });
});
