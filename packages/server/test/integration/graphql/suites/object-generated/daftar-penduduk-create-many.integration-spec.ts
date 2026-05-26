import { PENDUDUK_GQL_FIELDS } from 'test/integration/constants/penduduk-gql-fields.constants';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { findManyOperationFactory } from 'test/integration/graphql/utils/find-many-operation-factory.util';
import { findOneOperationFactory } from 'test/integration/graphql/utils/find-one-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { deleteAllRecords } from 'test/integration/utils/delete-all-records';

describe('daftarPenduduk resolvers (integration)', () => {
  let penduduk2Id: string;

  beforeAll(async () => {
    await deleteAllRecords('penduduk');
  });

  it('should create many daftarPenduduk', async () => {
    const graphqlOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: [
        {
          namaLengkap: {
            firstName: 'Budi',
            lastName: 'Santoso',
          },
          nik: '3201234567890001',
          tempatLahir: 'Bandung',
        },
        {
          namaLengkap: {
            firstName: 'Siti',
            lastName: 'Rahayu',
          },
          nik: '3201234567890002',
          tempatLahir: 'Bogor',
        },
        {
          namaLengkap: {
            firstName: 'Ahmad',
            lastName: 'Fauzi',
          },
          nik: '3201234567890003',
          tempatLahir: 'Cirebon',
        },
      ],
      upsert: true,
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.createDaftarPenduduk).toHaveLength(3);
    expect(response.body.errors).toBeUndefined();
  });

  it('should update many daftarPenduduk', async () => {
    const findOneOperation = findOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      filter: {
        nik: {
          eq: '3201234567890002',
        },
      },
    });

    const findOneResponse = await makeGraphqlAPIRequest(findOneOperation);

    penduduk2Id = findOneResponse.body.data.penduduk.id;

    const graphqlOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: [
        {
          nik: '3201234567890001',
          tempatLahir: 'Jakarta',
        },
        {
          id: penduduk2Id,
          tempatLahir: 'Depok',
        },
      ],
      upsert: true,
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    const findAllOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
    });

    const findAllResponse = await makeGraphqlAPIRequest(findAllOperation);

    expect(findAllResponse.body.data.daftarPenduduk.edges.length).toBe(3);

    expect(response.body.data.createDaftarPenduduk).toHaveLength(2);
    expect(response.body.errors).toBeUndefined();

    response.body.data.createDaftarPenduduk.forEach((penduduk: any) => {
      expect(penduduk.tempatLahir).toBeTruthy();
    });
  });

  it('should update and create many daftarPenduduk', async () => {
    const graphqlOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: [
        {
          nik: '3201234567890003',
          tempatLahir: 'Bekasi',
        },
        {
          nik: '3201234567890004',
          namaLengkap: {
            firstName: 'Rini',
            lastName: 'Wulandari',
          },
          tempatLahir: 'Sukabumi',
        },
        {
          id: penduduk2Id,
          namaLengkap: {
            firstName: 'Siti',
            lastName: 'Nurhaliza',
          },
          tempatLahir: 'Bogor Diperbarui',
        },
      ],
      upsert: true,
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    const findAllOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
    });

    const findAllResponse = await makeGraphqlAPIRequest(findAllOperation);

    expect(findAllResponse.body.data.daftarPenduduk.edges.length).toBe(4);

    expect(response.body.data.createDaftarPenduduk).toHaveLength(3);
    expect(
      response.body.data.createDaftarPenduduk.find(
        (penduduk: any) => penduduk.id === penduduk2Id,
      ).namaLengkap.firstName,
    ).toEqual('Siti');
    expect(response.body.errors).toBeUndefined();
  });
});
