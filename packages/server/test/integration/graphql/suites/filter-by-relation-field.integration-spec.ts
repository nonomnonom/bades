import gql from 'graphql-tag';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { deleteManyOperationFactory } from 'test/integration/graphql/utils/delete-many-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';

// ID keluarga untuk test filter relasi penduduk → keluarga
const TEST_KELUARGA_IDS = {
  SUKAMAJU: '20202020-cccc-4000-8000-000000000001',
  MEKAR_SARI: '20202020-cccc-4000-8000-000000000002',
  DUSUN_PASAR: '20202020-cccc-4000-8000-000000000003',
};

// ID penduduk untuk test filter
const TEST_PENDUDUK_IDS = {
  SUKAMAJU_WARGA_1: '20202020-dddd-4000-8000-000000000001',
  SUKAMAJU_WARGA_2: '20202020-dddd-4000-8000-000000000002',
  MEKAR_SARI_WARGA: '20202020-dddd-4000-8000-000000000003',
  DUSUN_PASAR_WARGA: '20202020-dddd-4000-8000-000000000004',
  TIDAK_TERDAFTAR: '20202020-dddd-4000-8000-000000000005',
};

const TEST_ROCKET_IDS = {
  FALCON: '20202020-cccc-4000-8000-100000000001',
  STARSHIP: '20202020-cccc-4000-8000-100000000002',
};

const TEST_PET_IDS = {
  FALCON_PET: '20202020-dddd-4000-8000-100000000001',
  STARSHIP_PET: '20202020-dddd-4000-8000-100000000002',
};

const ALL_TEST_PENDUDUK_IDS = Object.values(TEST_PENDUDUK_IDS);
const ALL_TEST_PET_IDS = Object.values(TEST_PET_IDS);

describe('Filter by relation field (e2e)', () => {
  beforeAll(async () => {
    // Buat data keluarga terlebih dahulu
    const createKeluargas = createManyOperationFactory({
      objectMetadataSingularName: 'keluarga',
      objectMetadataPluralName: 'keluargas',
      gqlFields: 'id nomorKk',
      data: [
        {
          id: TEST_KELUARGA_IDS.SUKAMAJU,
          nomorKk: 'Sukamaju',
          jumlahAnggota: 50,
        },
        {
          id: TEST_KELUARGA_IDS.MEKAR_SARI,
          nomorKk: 'MekarSari',
          jumlahAnggota: 10,
        },
        {
          id: TEST_KELUARGA_IDS.DUSUN_PASAR,
          nomorKk: 'DusunPasar',
          jumlahAnggota: 5,
        },
      ],
      upsert: true,
    });

    await makeGraphqlAPIRequest(createKeluargas);

    // Buat data penduduk dengan relasi ke keluarga
    const createPenduduks = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: 'id',
      data: [
        {
          id: TEST_PENDUDUK_IDS.SUKAMAJU_WARGA_1,
          kartuKeluargaId: TEST_KELUARGA_IDS.SUKAMAJU,
          pekerjaan: 'Petani',
        },
        {
          id: TEST_PENDUDUK_IDS.SUKAMAJU_WARGA_2,
          kartuKeluargaId: TEST_KELUARGA_IDS.SUKAMAJU,
          pekerjaan: 'Pedagang',
        },
        {
          id: TEST_PENDUDUK_IDS.MEKAR_SARI_WARGA,
          kartuKeluargaId: TEST_KELUARGA_IDS.MEKAR_SARI,
          pekerjaan: 'Petani',
        },
        {
          id: TEST_PENDUDUK_IDS.DUSUN_PASAR_WARGA,
          kartuKeluargaId: TEST_KELUARGA_IDS.DUSUN_PASAR,
          pekerjaan: 'Petani',
        },
        {
          id: TEST_PENDUDUK_IDS.TIDAK_TERDAFTAR,
          kartuKeluargaId: null,
          pekerjaan: 'Petani',
        },
      ],
      upsert: true,
    });

    await makeGraphqlAPIRequest(createPenduduks);

    const createRockets = createManyOperationFactory({
      objectMetadataSingularName: 'rocket',
      objectMetadataPluralName: 'rockets',
      gqlFields: 'id name',
      data: [
        { id: TEST_ROCKET_IDS.FALCON, name: 'FilterFalcon' },
        { id: TEST_ROCKET_IDS.STARSHIP, name: 'FilterStarship' },
      ],
      upsert: true,
    });

    await makeGraphqlAPIRequest(createRockets);

    const createPets = createManyOperationFactory({
      objectMetadataSingularName: 'pet',
      objectMetadataPluralName: 'pets',
      gqlFields: 'id',
      data: [
        {
          id: TEST_PET_IDS.FALCON_PET,
          name: 'FilterFalconPet',
          polymorphicOwnerRocketId: TEST_ROCKET_IDS.FALCON,
        },
        {
          id: TEST_PET_IDS.STARSHIP_PET,
          name: 'FilterStarshipPet',
          polymorphicOwnerRocketId: TEST_ROCKET_IDS.STARSHIP,
        },
      ],
      upsert: true,
    });

    await makeGraphqlAPIRequest(createPets);
  });

  it('harus memfilter penduduk berdasarkan nomorKk keluarga (exact match)', async () => {
    const queryData = {
      query: gql`
        query Penduduks($filter: PendudukFilterInput) {
          penduduks(filter: $filter, first: 10) {
            edges {
              node {
                id
              }
            }
          }
        }
      `,
      variables: {
        filter: {
          and: [
            { id: { in: ALL_TEST_PENDUDUK_IDS } },
            { kartuKeluarga: { nomorKk: { eq: 'Sukamaju' } } },
          ],
        },
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data).toBeDefined();

    const ids = response.body.data.penduduks.edges.map(
      (edge: { node: { id: string } }) => edge.node.id,
    );

    expect(ids.sort()).toEqual(
      [
        TEST_PENDUDUK_IDS.SUKAMAJU_WARGA_1,
        TEST_PENDUDUK_IDS.SUKAMAJU_WARGA_2,
      ].sort(),
    );
  });

  it('harus memfilter penduduk berdasarkan nomorKk keluarga dengan operator like', async () => {
    const queryData = {
      query: gql`
        query Penduduks($filter: PendudukFilterInput) {
          penduduks(filter: $filter, first: 10) {
            edges {
              node {
                id
              }
            }
          }
        }
      `,
      variables: {
        filter: {
          and: [
            { id: { in: ALL_TEST_PENDUDUK_IDS } },
            { kartuKeluarga: { nomorKk: { like: '%ukamaju%' } } },
          ],
        },
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    expect(response.body.errors).toBeUndefined();

    const ids = response.body.data.penduduks.edges.map(
      (edge: { node: { id: string } }) => edge.node.id,
    );

    expect(ids.sort()).toEqual(
      [
        TEST_PENDUDUK_IDS.SUKAMAJU_WARGA_1,
        TEST_PENDUDUK_IDS.SUKAMAJU_WARGA_2,
      ].sort(),
    );
  });

  it('harus menggabungkan filter relasi dengan filter scalar pada object root', async () => {
    const queryData = {
      query: gql`
        query Penduduks($filter: PendudukFilterInput) {
          penduduks(filter: $filter, first: 10) {
            edges {
              node {
                id
              }
            }
          }
        }
      `,
      variables: {
        filter: {
          and: [
            { id: { in: ALL_TEST_PENDUDUK_IDS } },
            { kartuKeluarga: { nomorKk: { eq: 'Sukamaju' } } },
            { pekerjaan: { eq: 'Pedagang' } },
          ],
        },
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    expect(response.body.errors).toBeUndefined();

    const ids = response.body.data.penduduks.edges.map(
      (edge: { node: { id: string } }) => edge.node.id,
    );

    expect(ids).toEqual([TEST_PENDUDUK_IDS.SUKAMAJU_WARGA_2]);
  });

  it('harus menggabungkan filter relasi dengan order-by pada relasi yang sama (dedup join)', async () => {
    const queryData = {
      query: gql`
        query Penduduks(
          $filter: PendudukFilterInput
          $orderBy: [PendudukOrderByInput]
        ) {
          penduduks(filter: $filter, orderBy: $orderBy, first: 10) {
            edges {
              node {
                id
                kartuKeluarga {
                  nomorKk
                }
              }
            }
          }
        }
      `,
      variables: {
        filter: {
          and: [
            { id: { in: ALL_TEST_PENDUDUK_IDS } },
            { kartuKeluarga: { nomorKk: { like: '%a%' } } },
          ],
        },
        orderBy: [{ kartuKeluarga: { nomorKk: 'AscNullsLast' } }],
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    expect(response.body.errors).toBeUndefined();

    const nomorKks = response.body.data.penduduks.edges.map(
      (edge: { node: { kartuKeluarga: { nomorKk: string } | null } }) =>
        edge.node.kartuKeluarga?.nomorKk ?? null,
    );

    // DusunPasar, MekarSari, Sukamaju (x2) — semua mengandung 'a', urut ascending
    expect(nomorKks).toEqual([
      'DusunPasar',
      'MekarSari',
      'Sukamaju',
      'Sukamaju',
    ]);
  });

  it('harus memfilter pada sub-field numerik object relasi tanpa melebihi batas kedalaman', async () => {
    const queryData = {
      query: gql`
        query Penduduks($filter: PendudukFilterInput) {
          penduduks(filter: $filter, first: 10) {
            edges {
              node {
                id
              }
            }
          }
        }
      `,
      variables: {
        filter: {
          and: [
            { id: { in: ALL_TEST_PENDUDUK_IDS } },
            {
              kartuKeluarga: {
                jumlahAnggota: { gte: 20 },
              },
            },
          ],
        },
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    expect(response.body.errors).toBeUndefined();

    const ids = response.body.data.penduduks.edges.map(
      (edge: { node: { id: string } }) => edge.node.id,
    );

    // Hanya Sukamaju (50 anggota) >= 20; MekarSari (10) dan DusunPasar (5) tidak termasuk
    expect(ids.sort()).toEqual(
      [
        TEST_PENDUDUK_IDS.SUKAMAJU_WARGA_1,
        TEST_PENDUDUK_IDS.SUKAMAJU_WARGA_2,
      ].sort(),
    );
  });

  it('harus menolak filter relasi yang bersarang lebih dari satu hop', async () => {
    const queryData = {
      query: gql`
        query Penduduks($filter: PendudukFilterInput) {
          penduduks(filter: $filter, first: 10) {
            edges {
              node {
                id
              }
            }
          }
        }
      `,
      variables: {
        filter: {
          kartuKeluarga: {
            createdBy: {
              name: { firstName: { eq: 'Apa saja' } },
            },
          },
        },
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  it('harus tidak memperlebar query root saat filter relasi berisi deletedAt', async () => {
    // deletedAt di dalam blok relasi milik entity terkait —
    // tidak boleh memanggil withDeleted() pada builder root dan
    // menampilkan baris root yang sudah di-soft-delete.
    const liveId = '20202020-dddd-4000-8000-000000000098';
    const softDeletedId = '20202020-dddd-4000-8000-000000000099';

    await makeGraphqlAPIRequest(
      createManyOperationFactory({
        objectMetadataSingularName: 'penduduk',
        objectMetadataPluralName: 'penduduks',
        gqlFields: 'id',
        data: [
          { id: liveId, kartuKeluargaId: TEST_KELUARGA_IDS.SUKAMAJU },
          { id: softDeletedId, kartuKeluargaId: TEST_KELUARGA_IDS.SUKAMAJU },
        ],
        upsert: true,
      }),
    );

    await makeGraphqlAPIRequest(
      deleteManyOperationFactory({
        objectMetadataSingularName: 'penduduk',
        objectMetadataPluralName: 'penduduks',
        gqlFields: 'id',
        filter: { id: { in: [softDeletedId] } },
      }),
    );

    const queryData = {
      query: gql`
        query Penduduks($filter: PendudukFilterInput) {
          penduduks(filter: $filter, first: 10) {
            edges {
              node {
                id
              }
            }
          }
        }
      `,
      variables: {
        filter: {
          and: [
            { id: { in: [liveId, softDeletedId] } },
            { kartuKeluarga: { deletedAt: { is: 'NULL' } } },
          ],
        },
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    expect(response.body.errors).toBeUndefined();

    const ids = response.body.data.penduduks.edges.map(
      (edge: { node: { id: string } }) => edge.node.id,
    );

    expect(ids).toEqual([liveId]);
  });

  it('harus memfilter pet berdasarkan field target MORPH_RELATION (nama rocket)', async () => {
    const queryData = {
      query: gql`
        query Pets($filter: PetFilterInput) {
          pets(filter: $filter, first: 10) {
            edges {
              node {
                id
              }
            }
          }
        }
      `,
      variables: {
        filter: {
          and: [
            { id: { in: ALL_TEST_PET_IDS } },
            { polymorphicOwnerRocket: { name: { eq: 'FilterFalcon' } } },
          ],
        },
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    expect(response.body.errors).toBeUndefined();

    const ids = response.body.data.pets.edges.map(
      (edge: { node: { id: string } }) => edge.node.id,
    );

    expect(ids).toEqual([TEST_PET_IDS.FALCON_PET]);
  });
});
