import { randomUUID } from 'crypto';

import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { deleteOneOperationFactory } from 'test/integration/graphql/utils/delete-one-operation-factory.util';
import { destroyOneOperationFactory } from 'test/integration/graphql/utils/destroy-one-operation-factory.util';
import { findOneOperationFactory } from 'test/integration/graphql/utils/find-one-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { restoreOneOperationFactory } from 'test/integration/graphql/utils/restore-one-operation-factory.util';

const PENDUDUK_DENGAN_KELUARGA_GQL_FIELDS = `
  id
  kartuKeluargaId
  kartuKeluarga {
    id
    nomorKk
  }
`;

describe('soft-deleted relation', () => {
  const keluargaId = randomUUID();
  const pendudukId = randomUUID();

  beforeAll(async () => {
    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: 'id nomorKk',
        data: { id: keluargaId, nomorKk: '3201234567890001' },
      }),
    );

    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'penduduk',
        gqlFields: PENDUDUK_DENGAN_KELUARGA_GQL_FIELDS,
        data: {
          id: pendudukId,
          kartuKeluargaId: keluargaId,
          namaLengkap: { firstName: 'Budi' },
        },
      }),
    );
  });

  afterAll(async () => {
    // Pastikan record tidak dalam kondisi soft-deleted sebelum destroy
    await makeGraphqlAPIRequest(
      restoreOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: 'id',
        recordId: keluargaId,
      }),
    );

    await makeGraphqlAPIRequest(
      destroyOneOperationFactory({
        objectMetadataSingularName: 'penduduk',
        gqlFields: 'id',
        recordId: pendudukId,
      }),
    );

    await makeGraphqlAPIRequest(
      destroyOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: 'id',
        recordId: keluargaId,
      }),
    );
  });

  it('should return relasi keluarga ketika keluarga masih aktif', async () => {
    const response = await makeGraphqlAPIRequest(
      findOneOperationFactory({
        objectMetadataSingularName: 'penduduk',
        gqlFields: PENDUDUK_DENGAN_KELUARGA_GQL_FIELDS,
        filter: { id: { eq: pendudukId } },
      }),
    );

    const penduduk = response.body.data.penduduk;

    expect(penduduk.kartuKeluargaId).toBe(keluargaId);
    expect(penduduk.kartuKeluarga).toBeDefined();
    expect(penduduk.kartuKeluarga.id).toBe(keluargaId);
    expect(penduduk.kartuKeluarga.nomorKk).toBe('3201234567890001');
  });

  it('should nullify kartuKeluargaId ketika keluarga di-soft-delete', async () => {
    await makeGraphqlAPIRequest(
      deleteOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: 'id deletedAt',
        recordId: keluargaId,
      }),
    );

    const response = await makeGraphqlAPIRequest(
      findOneOperationFactory({
        objectMetadataSingularName: 'penduduk',
        gqlFields: PENDUDUK_DENGAN_KELUARGA_GQL_FIELDS,
        filter: { id: { eq: pendudukId } },
      }),
    );

    const penduduk = response.body.data.penduduk;

    expect(penduduk.kartuKeluargaId).toBeNull();
    expect(penduduk.kartuKeluarga).toBeNull();
  });

  it('should restore relasi keluarga ketika keluarga di-restore', async () => {
    await makeGraphqlAPIRequest(
      restoreOneOperationFactory({
        objectMetadataSingularName: 'keluarga',
        gqlFields: 'id deletedAt',
        recordId: keluargaId,
      }),
    );

    const response = await makeGraphqlAPIRequest(
      findOneOperationFactory({
        objectMetadataSingularName: 'penduduk',
        gqlFields: PENDUDUK_DENGAN_KELUARGA_GQL_FIELDS,
        filter: { id: { eq: pendudukId } },
      }),
    );

    const penduduk = response.body.data.penduduk;

    expect(penduduk.kartuKeluargaId).toBe(keluargaId);
    expect(penduduk.kartuKeluarga).toBeDefined();
    expect(penduduk.kartuKeluarga.id).toBe(keluargaId);
  });
});
