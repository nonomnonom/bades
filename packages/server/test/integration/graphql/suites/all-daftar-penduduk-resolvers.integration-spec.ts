import { PENDUDUK_GQL_FIELDS } from 'test/integration/constants/penduduk-gql-fields.constants';
import {
  TEST_PENDUDUK_1_ID,
  TEST_PENDUDUK_2_ID,
  TEST_PENDUDUK_3_ID,
} from 'test/integration/constants/test-penduduk-ids.constants';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { deleteManyOperationFactory } from 'test/integration/graphql/utils/delete-many-operation-factory.util';
import { deleteOneOperationFactory } from 'test/integration/graphql/utils/delete-one-operation-factory.util';
import { destroyManyOperationFactory } from 'test/integration/graphql/utils/destroy-many-operation-factory.util';
import { destroyOneOperationFactory } from 'test/integration/graphql/utils/destroy-one-operation-factory.util';
import { findManyOperationFactory } from 'test/integration/graphql/utils/find-many-operation-factory.util';
import { findOneOperationFactory } from 'test/integration/graphql/utils/find-one-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { updateManyOperationFactory } from 'test/integration/graphql/utils/update-many-operation-factory.util';
import { updateOneOperationFactory } from 'test/integration/graphql/utils/update-one-operation-factory.util';
import { deleteAllRecords } from 'test/integration/utils/delete-all-records';
import { generateRecordName } from 'test/integration/utils/generate-record-name';

describe('daftarPenduduk resolvers (integration)', () => {
  beforeAll(async () => {
    await deleteAllRecords('penduduk');
  });

  it('1. harus membuat dan mengembalikan banyak penduduk', async () => {
    const tempatLahir1 = generateRecordName(TEST_PENDUDUK_1_ID);
    const tempatLahir2 = generateRecordName(TEST_PENDUDUK_2_ID);
    const graphqlOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: [
        {
          id: TEST_PENDUDUK_1_ID,
          tempatLahir: tempatLahir1,
        },
        {
          id: TEST_PENDUDUK_2_ID,
          tempatLahir: tempatLahir2,
        },
      ],
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.createDaftarPenduduk).toHaveLength(2);

    // @ts-expect-error legacy noImplicitAny
    response.body.data.createDaftarPenduduk.forEach((penduduk) => {
      expect(penduduk).toHaveProperty('tempatLahir');
      expect([tempatLahir1, tempatLahir2]).toContain(penduduk.tempatLahir);

      expect(penduduk).toHaveProperty('id');
      expect(penduduk).toHaveProperty('nik');
      expect(penduduk).toHaveProperty('nomorKk');
      expect(penduduk).toHaveProperty('jenisKelamin');
      expect(penduduk).toHaveProperty('agama');
      expect(penduduk).toHaveProperty('statusPerkawinan');
      expect(penduduk).toHaveProperty('pendidikan');
      expect(penduduk).toHaveProperty('pekerjaan');
      expect(penduduk).toHaveProperty('kewarganegaraan');
      expect(penduduk).toHaveProperty('statusHidup');
      expect(penduduk).toHaveProperty('namaLengkap');
      expect(penduduk).toHaveProperty('createdAt');
      expect(penduduk).toHaveProperty('deletedAt');
    });
  });

  it('1b. harus membuat dan mengembalikan satu penduduk', async () => {
    const tempatLahir3 = generateRecordName(TEST_PENDUDUK_3_ID);

    const graphqlOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: {
        id: TEST_PENDUDUK_3_ID,
        tempatLahir: tempatLahir3,
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    const createdPenduduk = response.body.data.createPenduduk;

    expect(createdPenduduk).toHaveProperty('tempatLahir');
    expect(createdPenduduk.tempatLahir).toEqual(tempatLahir3);

    expect(createdPenduduk).toHaveProperty('id');
    expect(createdPenduduk).toHaveProperty('nik');
    expect(createdPenduduk).toHaveProperty('nomorKk');
    expect(createdPenduduk).toHaveProperty('jenisKelamin');
    expect(createdPenduduk).toHaveProperty('agama');
    expect(createdPenduduk).toHaveProperty('statusPerkawinan');
    expect(createdPenduduk).toHaveProperty('pendidikan');
    expect(createdPenduduk).toHaveProperty('pekerjaan');
    expect(createdPenduduk).toHaveProperty('kewarganegaraan');
    expect(createdPenduduk).toHaveProperty('statusHidup');
    expect(createdPenduduk).toHaveProperty('namaLengkap');
    expect(createdPenduduk).toHaveProperty('createdAt');
    expect(createdPenduduk).toHaveProperty('deletedAt');
  });

  it('2. harus menemukan banyak penduduk', async () => {
    const graphqlOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    const data = response.body.data.daftarPenduduk;

    expect(data).toBeDefined();
    expect(Array.isArray(data.edges)).toBe(true);

    const edges = data.edges;

    if (edges.length > 0) {
      const penduduk = edges[0].node;

      expect(penduduk).toHaveProperty('id');
      expect(penduduk).toHaveProperty('nik');
      expect(penduduk).toHaveProperty('nomorKk');
      expect(penduduk).toHaveProperty('jenisKelamin');
      expect(penduduk).toHaveProperty('statusPerkawinan');
      expect(penduduk).toHaveProperty('namaLengkap');
      expect(penduduk).toHaveProperty('createdAt');
      expect(penduduk).toHaveProperty('deletedAt');
    }
  });

  it('2b. harus menemukan satu penduduk', async () => {
    const graphqlOperation = findOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          eq: TEST_PENDUDUK_3_ID,
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    const penduduk = response.body.data.penduduk;

    expect(penduduk).toHaveProperty('tempatLahir');

    expect(penduduk).toHaveProperty('id');
    expect(penduduk).toHaveProperty('nik');
    expect(penduduk).toHaveProperty('nomorKk');
    expect(penduduk).toHaveProperty('jenisKelamin');
    expect(penduduk).toHaveProperty('statusPerkawinan');
    expect(penduduk).toHaveProperty('namaLengkap');
    expect(penduduk).toHaveProperty('createdAt');
    expect(penduduk).toHaveProperty('deletedAt');
  });

  it('3. harus memperbarui banyak penduduk', async () => {
    const graphqlOperation = updateManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: {
        tempatLahir: 'Bandung',
      },
      filter: {
        id: {
          in: [TEST_PENDUDUK_1_ID, TEST_PENDUDUK_2_ID],
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    const updatedDaftarPenduduk = response.body.data.updateDaftarPenduduk;

    expect(updatedDaftarPenduduk).toHaveLength(2);

    // @ts-expect-error legacy noImplicitAny
    updatedDaftarPenduduk.forEach((penduduk) => {
      expect(penduduk.tempatLahir).toEqual('Bandung');
    });
  });

  it('3b. harus memperbarui satu penduduk', async () => {
    const graphqlOperation = updateOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: {
        tempatLahir: 'Surabaya',
      },
      recordId: TEST_PENDUDUK_3_ID,
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    const updatedPenduduk = response.body.data.updatePenduduk;

    expect(updatedPenduduk.tempatLahir).toEqual('Surabaya');
  });

  it('4. harus menemukan banyak penduduk dengan tempatLahir yang sudah diperbarui', async () => {
    const graphqlOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        tempatLahir: {
          eq: 'Bandung',
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.daftarPenduduk.edges).toHaveLength(2);
  });

  it('4b. harus menemukan satu penduduk dengan tempatLahir yang sudah diperbarui', async () => {
    const graphqlOperation = findOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        tempatLahir: {
          eq: 'Surabaya',
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.penduduk.tempatLahir).toEqual('Surabaya');
  });

  it('5. harus menghapus (soft-delete) banyak penduduk', async () => {
    const graphqlOperation = deleteManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [TEST_PENDUDUK_1_ID, TEST_PENDUDUK_2_ID],
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    const deleteDaftarPenduduk = response.body.data.deleteDaftarPenduduk;

    expect(deleteDaftarPenduduk).toHaveLength(2);

    // @ts-expect-error legacy noImplicitAny
    deleteDaftarPenduduk.forEach((penduduk) => {
      expect(penduduk.deletedAt).toBeTruthy();
    });
  });

  it('5b. harus menghapus (soft-delete) satu penduduk', async () => {
    const graphqlOperation = deleteOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      recordId: TEST_PENDUDUK_3_ID,
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.deletePenduduk.deletedAt).toBeTruthy();
  });

  it('6. harus tidak menemukan banyak penduduk yang sudah dihapus', async () => {
    const graphqlOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [TEST_PENDUDUK_1_ID, TEST_PENDUDUK_2_ID],
        },
      },
    });

    const findDaftarPendudukResponse = await makeGraphqlAPIRequest(graphqlOperation);

    expect(findDaftarPendudukResponse.body.data.daftarPenduduk.edges).toHaveLength(0);
  });

  it('6b. harus tidak menemukan satu penduduk yang sudah dihapus', async () => {
    const graphqlOperation = findOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          eq: TEST_PENDUDUK_3_ID,
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.penduduk).toBeNull();
  });

  it('7. harus menemukan banyak penduduk yang dihapus dengan filter deletedAt', async () => {
    const graphqlOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [TEST_PENDUDUK_1_ID, TEST_PENDUDUK_2_ID],
        },
        not: {
          deletedAt: {
            is: 'NULL',
          },
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.daftarPenduduk.edges).toHaveLength(2);
  });

  it('7b. harus menemukan satu penduduk yang dihapus dengan filter deletedAt', async () => {
    const graphqlOperation = findOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          eq: TEST_PENDUDUK_3_ID,
        },
        not: {
          deletedAt: {
            is: 'NULL',
          },
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.penduduk.id).toEqual(TEST_PENDUDUK_3_ID);
  });

  it('8. harus menghapus permanen banyak penduduk', async () => {
    const graphqlOperation = destroyManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [TEST_PENDUDUK_1_ID, TEST_PENDUDUK_2_ID],
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.destroyDaftarPenduduk).toHaveLength(2);
  });

  it('8b. harus menghapus permanen satu penduduk', async () => {
    const graphqlOperation = destroyOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      recordId: TEST_PENDUDUK_3_ID,
    });

    const destroyDaftarPendudukResponse =
      await makeGraphqlAPIRequest(graphqlOperation);

    expect(destroyDaftarPendudukResponse.body.data.destroyPenduduk).toBeTruthy();
  });

  it('9. harus tidak menemukan banyak penduduk setelah dihapus permanen', async () => {
    const graphqlOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          in: [TEST_PENDUDUK_1_ID, TEST_PENDUDUK_2_ID],
        },
        not: {
          deletedAt: {
            is: 'NULL',
          },
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.daftarPenduduk.edges).toHaveLength(0);
  });

  it('9b. harus tidak menemukan satu penduduk setelah dihapus permanen', async () => {
    const graphqlOperation = findOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        id: {
          eq: TEST_PENDUDUK_3_ID,
        },
        not: {
          deletedAt: {
            is: 'NULL',
          },
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.penduduk).toBeNull();
  });
});
