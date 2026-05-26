import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { deleteManyOperationFactory } from 'test/integration/graphql/utils/delete-many-operation-factory.util';
import { destroyManyOperationFactory } from 'test/integration/graphql/utils/destroy-many-operation-factory.util';
import { findManyOperationFactory } from 'test/integration/graphql/utils/find-many-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { restoreManyOperationFactory } from 'test/integration/graphql/utils/restore-many-operation-factory.util';
import { updateManyOperationFactory } from 'test/integration/graphql/utils/update-many-operation-factory.util';

// Prefix ID berbeda (eeee / ffff) dari filter-by-relation-field.integration-
// spec.ts agar dua suite dapat berbagi database workspace tanpa tabrakan.
const TEST_KELUARGA_IDS = {
  KK_SANTOSO: '20202020-eeee-4000-8000-000000000001',
  KK_WIJAYA: '20202020-eeee-4000-8000-000000000002',
  KK_RAHMAN: '20202020-eeee-4000-8000-000000000003',
};

const TEST_PENDUDUK_IDS = {
  KK_SANTOSO_ANGGOTA_1: '20202020-ffff-4000-8000-000000000001',
  KK_SANTOSO_ANGGOTA_2: '20202020-ffff-4000-8000-000000000002',
  KK_WIJAYA_ANGGOTA_1: '20202020-ffff-4000-8000-000000000003',
  KK_RAHMAN_ANGGOTA_1: '20202020-ffff-4000-8000-000000000004',
  TANPA_KK: '20202020-ffff-4000-8000-000000000005',
};

const ALL_TEST_PENDUDUK_IDS = Object.values(TEST_PENDUDUK_IDS);

// Setiap dari empat mutasi many-record harus mendukung filter relation-traversal:
// JOIN bertahan ke SQL UPDATE / DELETE / SoftDelete / Restore yang dihasilkan
// melalui penulisan ulang `id IN (subquery)`.
describe('Mutate by relation field (e2e)', () => {
  const resetFixtures = async () => {
    const createDaftarKeluarga = createManyOperationFactory({
      objectMetadataSingularName: 'keluarga',
      objectMetadataPluralName: 'daftarKeluarga',
      gqlFields: 'id nomorKk',
      data: [
        { id: TEST_KELUARGA_IDS.KK_SANTOSO, nomorKk: '3201030000000001', alamat: 'KK Santoso Mutate' },
        { id: TEST_KELUARGA_IDS.KK_WIJAYA, nomorKk: '3201030000000002', alamat: 'KK Wijaya Mutate' },
        { id: TEST_KELUARGA_IDS.KK_RAHMAN, nomorKk: '3201030000000003', alamat: 'KK Rahman Mutate' },
      ],
      upsert: true,
    });

    await makeGraphqlAPIRequest(createDaftarKeluarga);

    const createDaftarPenduduk = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: 'id',
      data: [
        {
          id: TEST_PENDUDUK_IDS.KK_SANTOSO_ANGGOTA_1,
          kartuKeluargaId: TEST_KELUARGA_IDS.KK_SANTOSO,
          tempatLahir: 'Kota Asal',
        },
        {
          id: TEST_PENDUDUK_IDS.KK_SANTOSO_ANGGOTA_2,
          kartuKeluargaId: TEST_KELUARGA_IDS.KK_SANTOSO,
          tempatLahir: 'Kota Asal',
        },
        {
          id: TEST_PENDUDUK_IDS.KK_WIJAYA_ANGGOTA_1,
          kartuKeluargaId: TEST_KELUARGA_IDS.KK_WIJAYA,
          tempatLahir: 'Kota Asal',
        },
        {
          id: TEST_PENDUDUK_IDS.KK_RAHMAN_ANGGOTA_1,
          kartuKeluargaId: TEST_KELUARGA_IDS.KK_RAHMAN,
          tempatLahir: 'Kota Asal',
        },
        {
          id: TEST_PENDUDUK_IDS.TANPA_KK,
          kartuKeluargaId: null,
          tempatLahir: 'Kota Asal',
        },
      ],
      upsert: true,
    });

    await makeGraphqlAPIRequest(createDaftarPenduduk);
  };

  beforeEach(async () => {
    // Setiap test memutasi state, jadi hapus dan seed ulang sebelum setiap test.
    await makeGraphqlAPIRequest(
      destroyManyOperationFactory({
        objectMetadataSingularName: 'penduduk',
        objectMetadataPluralName: 'daftarPenduduk',
        gqlFields: 'id',
        filter: { id: { in: ALL_TEST_PENDUDUK_IDS } },
      }),
    );

    await makeGraphqlAPIRequest(
      destroyManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'daftarKeluarga',
        gqlFields: 'id',
        filter: { id: { in: Object.values(TEST_KELUARGA_IDS) } },
      }),
    );

    await resetFixtures();
  });

  it('should updateMany via a relation traversal filter', async () => {
    const updateOperation = updateManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: 'id tempatLahir',
      data: { tempatLahir: 'Kota Diperbarui' },
      filter: {
        and: [
          { id: { in: ALL_TEST_PENDUDUK_IDS } },
          { kartuKeluarga: { alamat: { eq: 'KK Santoso Mutate' } } },
        ],
      },
    });

    const updateResponse = await makeGraphqlAPIRequest(updateOperation);

    expect(updateResponse.body.errors).toBeUndefined();

    const updatedDaftarPenduduk = updateResponse.body.data.updateDaftarPenduduk;

    expect(updatedDaftarPenduduk).toHaveLength(2);
    expect(
      updatedDaftarPenduduk
        .map((penduduk: { id: string }) => penduduk.id)
        .sort(),
    ).toEqual(
      [
        TEST_PENDUDUK_IDS.KK_SANTOSO_ANGGOTA_1,
        TEST_PENDUDUK_IDS.KK_SANTOSO_ANGGOTA_2,
      ].sort(),
    );

    const findOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: 'id tempatLahir',
      filter: { id: { in: ALL_TEST_PENDUDUK_IDS } },
    });

    const findResponse = await makeGraphqlAPIRequest(findOperation);

    const tempatLahirByPendudukId = Object.fromEntries(
      findResponse.body.data.daftarPenduduk.edges.map(
        (edge: { node: { id: string; tempatLahir: string } }) => [
          edge.node.id,
          edge.node.tempatLahir,
        ],
      ),
    );

    expect(
      tempatLahirByPendudukId[TEST_PENDUDUK_IDS.KK_SANTOSO_ANGGOTA_1],
    ).toEqual('Kota Diperbarui');
    expect(
      tempatLahirByPendudukId[TEST_PENDUDUK_IDS.KK_SANTOSO_ANGGOTA_2],
    ).toEqual('Kota Diperbarui');

    // Baris non-Santoso tidak boleh berubah — JOIN tidak boleh memperluas
    // mutasi melampaui filter.
    expect(
      tempatLahirByPendudukId[TEST_PENDUDUK_IDS.KK_WIJAYA_ANGGOTA_1],
    ).toEqual('Kota Asal');
    expect(
      tempatLahirByPendudukId[TEST_PENDUDUK_IDS.KK_RAHMAN_ANGGOTA_1],
    ).toEqual('Kota Asal');
    expect(tempatLahirByPendudukId[TEST_PENDUDUK_IDS.TANPA_KK]).toEqual(
      'Kota Asal',
    );
  });

  it('should deleteMany via a relation traversal filter (soft-delete)', async () => {
    const deleteOperation = deleteManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: 'id deletedAt',
      filter: {
        and: [
          { id: { in: ALL_TEST_PENDUDUK_IDS } },
          { kartuKeluarga: { alamat: { eq: 'KK Rahman Mutate' } } },
        ],
      },
    });

    const deleteResponse = await makeGraphqlAPIRequest(deleteOperation);

    expect(deleteResponse.body.errors).toBeUndefined();

    const deletedDaftarPenduduk = deleteResponse.body.data.deleteDaftarPenduduk;

    expect(deletedDaftarPenduduk).toHaveLength(1);
    expect(deletedDaftarPenduduk[0].id).toEqual(
      TEST_PENDUDUK_IDS.KK_RAHMAN_ANGGOTA_1,
    );
    expect(deletedDaftarPenduduk[0].deletedAt).toBeTruthy();

    const findOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: 'id',
      filter: { id: { in: ALL_TEST_PENDUDUK_IDS } },
    });

    const findResponse = await makeGraphqlAPIRequest(findOperation);
    const remainingIds = findResponse.body.data.daftarPenduduk.edges.map(
      (edge: { node: { id: string } }) => edge.node.id,
    );

    expect(remainingIds.sort()).toEqual(
      [
        TEST_PENDUDUK_IDS.KK_SANTOSO_ANGGOTA_1,
        TEST_PENDUDUK_IDS.KK_SANTOSO_ANGGOTA_2,
        TEST_PENDUDUK_IDS.KK_WIJAYA_ANGGOTA_1,
        TEST_PENDUDUK_IDS.TANPA_KK,
      ].sort(),
    );
  });

  it('should restoreMany via a relation traversal filter', async () => {
    // Soft-delete via filter skalar agar restore menjadi satu-satunya langkah
    // yang menguji jalur traversal.
    const deleteOperation = deleteManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: 'id',
      filter: {
        id: {
          in: [
            TEST_PENDUDUK_IDS.KK_SANTOSO_ANGGOTA_1,
            TEST_PENDUDUK_IDS.KK_SANTOSO_ANGGOTA_2,
            TEST_PENDUDUK_IDS.KK_WIJAYA_ANGGOTA_1,
          ],
        },
      },
    });

    await makeGraphqlAPIRequest(deleteOperation);

    const restoreOperation = restoreManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: 'id deletedAt',
      filter: {
        and: [
          { id: { in: ALL_TEST_PENDUDUK_IDS } },
          { kartuKeluarga: { alamat: { eq: 'KK Santoso Mutate' } } },
        ],
      },
    });

    const restoreResponse = await makeGraphqlAPIRequest(restoreOperation);

    expect(restoreResponse.body.errors).toBeUndefined();

    const restoredDaftarPenduduk = restoreResponse.body.data.restoreDaftarPenduduk;

    expect(restoredDaftarPenduduk).toHaveLength(2);
    expect(
      restoredDaftarPenduduk.map((penduduk: { id: string }) => penduduk.id).sort(),
    ).toEqual(
      [
        TEST_PENDUDUK_IDS.KK_SANTOSO_ANGGOTA_1,
        TEST_PENDUDUK_IDS.KK_SANTOSO_ANGGOTA_2,
      ].sort(),
    );
    restoredDaftarPenduduk.forEach((penduduk: { deletedAt: string | null }) => {
      expect(penduduk.deletedAt).toBeNull();
    });

    // Anggota KK Wijaya juga soft-delete tapi tidak cocok dengan filter keluarga
    // — harus tetap terhapus.
    const findWijaya = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: 'id',
      filter: { id: { in: [TEST_PENDUDUK_IDS.KK_WIJAYA_ANGGOTA_1] } },
    });

    const findWijayaResponse = await makeGraphqlAPIRequest(findWijaya);

    expect(findWijayaResponse.body.data.daftarPenduduk.edges).toEqual([]);
  });

  it('should destroyMany via a relation traversal filter (hard-delete)', async () => {
    const destroyOperation = destroyManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: 'id',
      filter: {
        and: [
          { id: { in: ALL_TEST_PENDUDUK_IDS } },
          { kartuKeluarga: { alamat: { eq: 'KK Wijaya Mutate' } } },
        ],
      },
    });

    const destroyResponse = await makeGraphqlAPIRequest(destroyOperation);

    expect(destroyResponse.body.errors).toBeUndefined();

    const destroyedDaftarPenduduk = destroyResponse.body.data.destroyDaftarPenduduk;

    expect(destroyedDaftarPenduduk).toHaveLength(1);
    expect(destroyedDaftarPenduduk[0].id).toEqual(
      TEST_PENDUDUK_IDS.KK_WIJAYA_ANGGOTA_1,
    );

    // destroy adalah hard-delete — baris harus hilang bahkan saat query
    // dengan filter deletedAt.
    const findOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: 'id',
      filter: {
        id: { in: [TEST_PENDUDUK_IDS.KK_WIJAYA_ANGGOTA_1] },
        not: { deletedAt: { is: 'NULL' } },
      },
    });

    const findResponse = await makeGraphqlAPIRequest(findOperation);

    expect(findResponse.body.data.daftarPenduduk.edges).toEqual([]);
  });

  it('should keep scalar-only mutations working unchanged', async () => {
    // Memastikan cabang no-traversal pada helper mutation builder tetap berfungsi:
    // filter skalar terus menghasilkan WHERE langsung tanpa pembungkus IN-subquery.
    const updateOperation = updateManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: 'id tempatLahir',
      data: { tempatLahir: 'Kota Diperbarui Skalar' },
      filter: { id: { eq: TEST_PENDUDUK_IDS.TANPA_KK } },
    });

    const updateResponse = await makeGraphqlAPIRequest(updateOperation);

    expect(updateResponse.body.errors).toBeUndefined();
    expect(updateResponse.body.data.updateDaftarPenduduk).toHaveLength(1);
    expect(updateResponse.body.data.updateDaftarPenduduk[0].tempatLahir).toEqual(
      'Kota Diperbarui Skalar',
    );
  });
});
