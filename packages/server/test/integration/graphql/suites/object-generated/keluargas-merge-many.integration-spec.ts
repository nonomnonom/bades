import { KELUARGA_GQL_FIELDS } from 'test/integration/constants/keluarga-gql-fields.constants';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { mergeManyOperationFactory } from 'test/integration/graphql/utils/merge-many-operation-factory.util';
import { deleteRecordsByIds } from 'test/integration/utils/delete-records-by-ids';

describe('keluargas merge resolvers (integration)', () => {
  let createdKeluargaIds: string[] = [];

  afterEach(async () => {
    if (createdKeluargaIds.length > 0) {
      await deleteRecordsByIds('keluarga', createdKeluargaIds);
      createdKeluargaIds = [];
    }
  });

  describe('merging keluarga records', () => {
    it('should merge two keluarga records and retain priority nomorKk', async () => {
      const createKeluargasOperation = createManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'keluargas',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: [
          {
            nomorKk: '3201234567890001',
            alamat: 'Jl. Merdeka No. 1, Desa Sukamaju',
          },
          {
            nomorKk: '3201234567890002',
            alamat: 'Jl. Pahlawan No. 2, Desa Mekar Sari',
          },
        ],
      });

      const createResponse = await makeGraphqlAPIRequest(
        createKeluargasOperation,
      );

      expect(createResponse.body.data.createKeluargas).toHaveLength(2);

      const keluarga1Id = createResponse.body.data.createKeluargas[0].id;
      const keluarga2Id = createResponse.body.data.createKeluargas[1].id;

      createdKeluargaIds.push(keluarga1Id, keluarga2Id);

      const mergeOperation = mergeManyOperationFactory({
        objectMetadataPluralName: 'keluargas',
        gqlFields: KELUARGA_GQL_FIELDS,
        ids: [keluarga1Id, keluarga2Id],
        conflictPriorityIndex: 0,
      });

      const mergeResponse = await makeGraphqlAPIRequest(mergeOperation);

      expect(mergeResponse.body.errors).toBeUndefined();

      const mergedKeluarga = mergeResponse.body.data.mergeKeluargas;

      // priorityIndex 0 → keluarga pertama menang
      expect(mergedKeluarga.nomorKk).toBe('3201234567890001');
      expect(mergedKeluarga.alamat).toBe('Jl. Merdeka No. 1, Desa Sukamaju');
    });

    it('should merge with second priority taking precedence', async () => {
      const createKeluargasOperation = createManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'keluargas',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: [
          {
            nomorKk: '3201234567890003',
            alamat: 'Jl. Soekarno No. 3, Desa Harjosari',
          },
          {
            nomorKk: '3201234567890004',
            alamat: 'Jl. Hatta No. 4, Desa Tanjungsari',
          },
        ],
      });

      const createResponse = await makeGraphqlAPIRequest(
        createKeluargasOperation,
      );

      const keluarga1Id = createResponse.body.data.createKeluargas[0].id;
      const keluarga2Id = createResponse.body.data.createKeluargas[1].id;

      createdKeluargaIds.push(keluarga1Id, keluarga2Id);

      const mergeOperation = mergeManyOperationFactory({
        objectMetadataPluralName: 'keluargas',
        gqlFields: KELUARGA_GQL_FIELDS,
        ids: [keluarga1Id, keluarga2Id],
        conflictPriorityIndex: 1,
      });

      const mergeResponse = await makeGraphqlAPIRequest(mergeOperation);

      expect(mergeResponse.body.errors).toBeUndefined();

      const mergedKeluarga = mergeResponse.body.data.mergeKeluargas;

      // priorityIndex 1 → keluarga kedua menang
      expect(mergedKeluarga.nomorKk).toBe('3201234567890004');
      expect(mergedKeluarga.alamat).toBe('Jl. Hatta No. 4, Desa Tanjungsari');
    });

    it('should merge three keluarga records with first priority', async () => {
      const createKeluargasOperation = createManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'keluargas',
        gqlFields: KELUARGA_GQL_FIELDS,
        data: [
          {
            nomorKk: '3201234567890005',
            alamat: 'Jl. Diponegoro No. 5, Desa Wonosari',
          },
          {
            nomorKk: '3201234567890006',
            alamat: 'Jl. Sudirman No. 6, Desa Ngawi',
          },
          {
            nomorKk: '3201234567890007',
            alamat: 'Jl. Gatot Subroto No. 7, Desa Madiun',
          },
        ],
      });

      const createResponse = await makeGraphqlAPIRequest(
        createKeluargasOperation,
      );

      expect(createResponse.body.data.createKeluargas).toHaveLength(3);

      const keluarga1Id = createResponse.body.data.createKeluargas[0].id;
      const keluarga2Id = createResponse.body.data.createKeluargas[1].id;
      const keluarga3Id = createResponse.body.data.createKeluargas[2].id;

      createdKeluargaIds.push(keluarga1Id, keluarga2Id, keluarga3Id);

      const mergeOperation = mergeManyOperationFactory({
        objectMetadataPluralName: 'keluargas',
        gqlFields: KELUARGA_GQL_FIELDS,
        ids: [keluarga1Id, keluarga2Id, keluarga3Id],
        conflictPriorityIndex: 0,
      });

      const mergeResponse = await makeGraphqlAPIRequest(mergeOperation);

      expect(mergeResponse.body.errors).toBeUndefined();

      const mergedKeluarga = mergeResponse.body.data.mergeKeluargas;

      expect(mergedKeluarga.id).toBeDefined();
      expect(mergedKeluarga.nomorKk).toBe('3201234567890005');
    });
  });
});
