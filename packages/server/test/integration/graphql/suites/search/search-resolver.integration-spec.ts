import { KELUARGA_GQL_FIELDS } from 'test/integration/constants/keluarga-gql-fields.constants';
import { OBJECT_MODEL_COMMON_FIELDS } from 'test/integration/constants/object-model-common-fields';
import { PENDUDUK_GQL_FIELDS } from 'test/integration/constants/penduduk-gql-fields.constants';
import {
  TEST_KELUARGA_1_ID,
  TEST_KELUARGA_2_ID,
} from 'test/integration/constants/test-keluarga-ids.constants';
import {
  TEST_PENDUDUK_1_ID,
  TEST_PENDUDUK_2_ID,
  TEST_PENDUDUK_3_ID,
  TEST_PENDUDUK_4_ID,
  TEST_PENDUDUK_5_ID,
  TEST_PENDUDUK_6_ID,
  TEST_PENDUDUK_7_ID,
  TEST_PENDUDUK_8_ID,
  TEST_PENDUDUK_9_ID,
} from 'test/integration/constants/test-penduduk-ids.constants';
import {
  TEST_PET_ID_1,
  TEST_PET_ID_2,
  TEST_PET_ID_3,
  TEST_PET_ID_4,
  TEST_PET_ID_5,
} from 'test/integration/constants/test-pet-ids.constants';
import { createManyOperation } from 'test/integration/graphql/utils/create-many-operation.util';
import { search } from 'test/integration/graphql/utils/search.util';
import { deleteAllRecords } from 'test/integration/utils/delete-all-records';
import {
  eachTestingContextFilter,
  type EachTestingContext,
} from 'shared/testing';

import {
  decodeCursor,
  encodeCursorData,
} from 'src/engine/api/graphql/graphql-query-runner/utils/cursors.util';
import { type SearchArgs } from 'src/engine/core-modules/search/dtos/search-args';
import { type SearchResultEdgeDTO } from 'src/engine/core-modules/search/dtos/search-result-edge.dto';
import { type SearchCursor } from 'src/engine/core-modules/search/services/search.service';

describe('SearchResolver', () => {
  // Penduduk dengan namaLengkap unik untuk keperluan pencarian
  const penduduks = [
    {
      id: TEST_PENDUDUK_1_ID,
      namaLengkap: { firstName: 'searchInput1' },
      nik: '3201000000000001',
    },
    {
      id: TEST_PENDUDUK_2_ID,
      namaLengkap: { firstName: 'searchInput2' },
      nik: '3201000000000002',
    },
    { id: TEST_PENDUDUK_3_ID, namaLengkap: { firstName: 'searchInput3' }, nik: '3201000000000003' },
    {
      id: TEST_PENDUDUK_4_ID,
      namaLengkap: { firstName: 'José', lastName: 'García' },
      nik: '3201000000000004',
    },
    {
      id: TEST_PENDUDUK_5_ID,
      namaLengkap: { firstName: 'François', lastName: 'Müller' },
      nik: '3201000000000005',
    },
    {
      id: TEST_PENDUDUK_6_ID,
      namaLengkap: { firstName: 'Jose', lastName: 'Garcia' },
      nik: '3201000000000006',
    },
    {
      id: TEST_PENDUDUK_7_ID,
      namaLengkap: { firstName: 'Francois', lastName: 'Muller' },
      nik: '3201000000000007',
    },
    {
      id: TEST_PENDUDUK_8_ID,
      namaLengkap: { firstName: 'Budi', lastName: 'Santoso' },
      nik: '3201111111111111',
    },
    {
      id: TEST_PENDUDUK_9_ID,
      namaLengkap: { firstName: 'Siti', lastName: 'Rahayu' },
      nik: '3201222222222222',
    },
  ];

  const keluargas = [
    {
      id: TEST_KELUARGA_1_ID,
      nomorKk: 'Café KK',
      alamat: 'Jl. Café No. 1, Desa Mekar',
    },
    {
      id: TEST_KELUARGA_2_ID,
      nomorKk: 'Naïve KK',
      alamat: 'Jl. Naïve No. 2, Desa Sari',
    },
  ];

  const pets = [
    { id: TEST_PET_ID_1, name: 'searchInput1' },
    { id: TEST_PET_ID_2, name: 'searchInput2' },
    { id: TEST_PET_ID_3, name: 'Café' },
    { id: TEST_PET_ID_4, name: 'Naïve' },
    { id: TEST_PET_ID_5, name: '示例商业线索' },
  ];

  const [
    searchInput1Penduduk,
    searchInput2Penduduk,
    searchInput3Penduduk,
    josePenduduk,
    francoisPenduduk,
    josePendudukNoAccent,
    francoisPendudukNoAccent,
    budiPenduduk,
    sitiPenduduk,
  ] = penduduks;
  const [cafeKk, naiveKk] = keluargas;
  const [searchInput1Pet, searchInput2Pet, cafePet, naivePet, cjkPet] = pets;

  beforeAll(async () => {
    // TODO refactor not a good practice, or should at least restore afterwards
    await deleteAllRecords('penduduk');
    await deleteAllRecords('keluarga');
    await deleteAllRecords('note');
    await deleteAllRecords('task');
    await deleteAllRecords('noteTarget');
    await deleteAllRecords('taskTarget');
    await deleteAllRecords('dashboard');
    await deleteAllRecords('_pet');
    await deleteAllRecords('_surveyResult');
    await deleteAllRecords('_rocket');
    ///

    await createManyOperation({
      objectMetadataSingularName: 'pet',
      objectMetadataPluralName: 'pets',
      gqlFields: OBJECT_MODEL_COMMON_FIELDS,
      data: pets,
    });

    await createManyOperation({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS,
      data: penduduks,
    });

    await createManyOperation({
      objectMetadataSingularName: 'keluarga',
      objectMetadataPluralName: 'keluargas',
      gqlFields: KELUARGA_GQL_FIELDS,
      data: keluargas,
    });
  });

  const testsUseCases: EachTestingContext<{
    input: SearchArgs;
    eval: {
      orderedRecordIds: string[];
      pageInfo: {
        hasNextPage: boolean;
        decodedEndCursor: SearchCursor | null;
      };
    };
  }>[] = [
    {
      title:
        'should return all records for "isSearchable:true" objects when no search input is provided',
      context: {
        input: {
          searchInput: '',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
            'workflow',
          ],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [
            searchInput1Penduduk.id,
            searchInput2Penduduk.id,
            searchInput3Penduduk.id,
            josePenduduk.id,
            francoisPenduduk.id,
            josePendudukNoAccent.id,
            francoisPendudukNoAccent.id,
            budiPenduduk.id,
            sitiPenduduk.id,
            naiveKk.id,
            cafeKk.id,
            searchInput1Pet.id,
            searchInput2Pet.id,
            cjkPet.id,
            cafePet.id,
            naivePet.id,
          ],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0, tsRankCD: 0 },
              lastRecordIdsPerObject: {
                penduduk: sitiPenduduk.id,
                keluarga: cafeKk.id,
                pet: naivePet.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should return filtered records when search input is provided',
      context: {
        input: {
          searchInput: 'searchInput1',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [searchInput1Penduduk.id, searchInput1Pet.id],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
              lastRecordIdsPerObject: {
                penduduk: searchInput1Penduduk.id,
                pet: searchInput1Pet.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should return record from included Objects only',
      context: {
        input: {
          searchInput: '',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          includedObjectNameSingulars: ['pet'],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [
            searchInput1Pet.id,
            searchInput2Pet.id,
            cjkPet.id,
            cafePet.id,
            naivePet.id,
          ],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0, tsRankCD: 0 },
              lastRecordIdsPerObject: {
                pet: naivePet.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should not return record from excludedObject',
      context: {
        input: {
          searchInput: '',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'penduduk',
            'employmentHistory',
            'petCareAgreement',
            'workflow',
          ],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [
            naiveKk.id,
            cafeKk.id,
            searchInput1Pet.id,
            searchInput2Pet.id,
            cjkPet.id,
            cafePet.id,
            naivePet.id,
          ],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0, tsRankCD: 0 },
              lastRecordIdsPerObject: {
                keluarga: cafeKk.id,
                pet: naivePet.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should return filtered records when filter is provided',
      context: {
        input: {
          searchInput: '',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          filter: { id: { eq: searchInput1Pet.id } },
          limit: 50,
        },
        eval: {
          orderedRecordIds: [searchInput1Pet.id],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0, tsRankCD: 0 },
              lastRecordIdsPerObject: {
                pet: searchInput1Pet.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should limit records number with limit',
      context: {
        input: {
          searchInput: '',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 4,
        },
        eval: {
          orderedRecordIds: [
            searchInput1Penduduk.id,
            searchInput2Penduduk.id,
            searchInput3Penduduk.id,
            josePenduduk.id,
          ],
          pageInfo: {
            hasNextPage: true,
            decodedEndCursor: {
              lastRanks: { tsRank: 0, tsRankCD: 0 },
              lastRecordIdsPerObject: {
                penduduk: josePenduduk.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should return endCursor when paginating',
      context: {
        input: {
          searchInput: '',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 2,
        },
        eval: {
          orderedRecordIds: [
            searchInput1Penduduk.id,
            searchInput2Penduduk.id,
          ],
          pageInfo: {
            hasNextPage: true,
            decodedEndCursor: {
              lastRanks: { tsRank: 0, tsRankCD: 0 },
              lastRecordIdsPerObject: {
                penduduk: searchInput2Penduduk.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should return endCursor when paginating with Cursor',
      context: {
        input: {
          searchInput: '',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          after: encodeCursorData({
            lastRanks: { tsRank: 0, tsRankCD: 0 },
            lastRecordIdsPerObject: {
              penduduk: searchInput2Penduduk.id,
            },
          }),
          limit: 2,
        },
        eval: {
          orderedRecordIds: [searchInput3Penduduk.id, josePenduduk.id],
          pageInfo: {
            hasNextPage: true,
            decodedEndCursor: {
              lastRanks: { tsRank: 0, tsRankCD: 0 },
              lastRecordIdsPerObject: {
                penduduk: josePenduduk.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should limit records number with limit and searchInput',
      context: {
        input: {
          searchInput: 'searchInput',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 4,
        },
        eval: {
          orderedRecordIds: [
            searchInput1Penduduk.id,
            searchInput2Penduduk.id,
            searchInput3Penduduk.id,
            searchInput1Pet.id,
          ],
          pageInfo: {
            hasNextPage: true,
            decodedEndCursor: {
              lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
              lastRecordIdsPerObject: {
                pet: searchInput1Pet.id,
                penduduk: searchInput3Penduduk.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should return endCursor when paginating with searchInput',
      context: {
        input: {
          searchInput: 'searchInput',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 2,
        },
        eval: {
          orderedRecordIds: [
            searchInput1Penduduk.id,
            searchInput2Penduduk.id,
          ],
          pageInfo: {
            hasNextPage: true,
            decodedEndCursor: {
              lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
              lastRecordIdsPerObject: {
                penduduk: searchInput2Penduduk.id,
              },
            },
          },
        },
      },
    },
    {
      title:
        'should return endCursor when paginating with searchInput with Cursor',
      context: {
        input: {
          searchInput: 'searchInput',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          after: encodeCursorData({
            lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
            lastRecordIdsPerObject: {
              penduduk: searchInput2Penduduk.id,
            },
          }),
          limit: 2,
        },
        eval: {
          orderedRecordIds: [searchInput3Penduduk.id, searchInput1Pet.id],
          pageInfo: {
            hasNextPage: true,
            decodedEndCursor: {
              lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
              lastRecordIdsPerObject: {
                pet: searchInput1Pet.id,
                penduduk: searchInput3Penduduk.id,
              },
            },
          },
        },
      },
    },
    {
      title:
        'should return endCursor when paginating with searchInput with Cursor and filter',
      context: {
        input: {
          searchInput: 'searchInput',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          after: encodeCursorData({
            lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
            lastRecordIdsPerObject: {
              penduduk: searchInput2Penduduk.id,
            },
          }),
          limit: 2,
          filter: { id: { neq: searchInput1Pet.id } },
        },
        eval: {
          orderedRecordIds: [searchInput3Penduduk.id, searchInput2Pet.id],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
              lastRecordIdsPerObject: {
                penduduk: searchInput3Penduduk.id,
                pet: searchInput2Pet.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should paginate properly with excludedObject',
      context: {
        input: {
          searchInput: '',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'penduduk',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 1,
        },
        eval: {
          orderedRecordIds: [naiveKk.id],
          pageInfo: {
            hasNextPage: true,
            decodedEndCursor: {
              lastRanks: { tsRank: 0, tsRankCD: 0 },
              lastRecordIdsPerObject: {
                keluarga: naiveKk.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should paginate properly with included Objects only',
      context: {
        input: {
          searchInput: '',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          includedObjectNameSingulars: ['pet'],
          limit: 1,
        },
        eval: {
          orderedRecordIds: [searchInput1Pet.id],
          pageInfo: {
            hasNextPage: true,
            decodedEndCursor: {
              lastRanks: { tsRank: 0, tsRankCD: 0 },
              lastRecordIdsPerObject: {
                pet: searchInput1Pet.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should paginate properly when no records are returned',
      context: {
        input: {
          searchInput: '',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 0,
        },
        eval: {
          orderedRecordIds: [],
          pageInfo: {
            hasNextPage: true,
            decodedEndCursor: null,
          },
        },
      },
    },
    {
      title:
        'should find both "José" and "Jose" when searching for "jose" (bidirectional accent-insensitive)',
      context: {
        input: {
          searchInput: 'jose',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [josePenduduk.id, josePendudukNoAccent.id],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0.12158542, tsRankCD: 0.2 },
              lastRecordIdsPerObject: {
                penduduk: josePendudukNoAccent.id,
              },
            },
          },
        },
      },
    },
    {
      title:
        'should find both "García" and "Garcia" when searching for "garcia" (bidirectional accent-insensitive)',
      context: {
        input: {
          searchInput: 'garcia',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [josePenduduk.id, josePendudukNoAccent.id],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
              lastRecordIdsPerObject: {
                penduduk: josePendudukNoAccent.id,
              },
            },
          },
        },
      },
    },
    {
      title:
        'should find both accented and non-accented "Café"/"Cafe" records when searching for "cafe" (bidirectional accent-insensitive)',
      context: {
        input: {
          searchInput: 'cafe',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [cafeKk.id, cafePet.id],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
              lastRecordIdsPerObject: {
                keluarga: cafeKk.id,
                pet: cafePet.id,
              },
            },
          },
        },
      },
    },
    {
      title:
        'should find both accented and non-accented "Naïve"/"Naive" records when searching for "naive" (bidirectional accent-insensitive)',
      context: {
        input: {
          searchInput: 'naive',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [
            naiveKk.id,
            francoisPenduduk.id,
            francoisPendudukNoAccent.id,
            naivePet.id,
          ],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
              lastRecordIdsPerObject: {
                penduduk: francoisPendudukNoAccent.id,
                keluarga: naiveKk.id,
                pet: naivePet.id,
              },
            },
          },
        },
      },
    },
    {
      title:
        'should find both "Müller" and "Muller" when searching for "muller" (bidirectional accent-insensitive)',
      context: {
        input: {
          searchInput: 'muller',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [francoisPenduduk.id, francoisPendudukNoAccent.id],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
              lastRecordIdsPerObject: {
                penduduk: francoisPendudukNoAccent.id,
              },
            },
          },
        },
      },
    },
    {
      title:
        'should find both "François" and "Francois" when searching for "francois" (bidirectional accent-insensitive)',
      context: {
        input: {
          searchInput: 'francois',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [francoisPenduduk.id, francoisPendudukNoAccent.id],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0.12158542, tsRankCD: 0.2 },
              lastRecordIdsPerObject: {
                penduduk: francoisPendudukNoAccent.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should find penduduk by NIK',
      context: {
        input: {
          searchInput: '3201111111111111',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [budiPenduduk.id],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
              lastRecordIdsPerObject: {
                penduduk: budiPenduduk.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should find penduduk by partial NIK',
      context: {
        input: {
          searchInput: '320122',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [sitiPenduduk.id],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
              lastRecordIdsPerObject: {
                penduduk: sitiPenduduk.id,
              },
            },
          },
        },
      },
    },
    {
      title:
        'should rank search results appropriately vs other field matches',
      context: {
        input: {
          searchInput: 'searchInput1',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [searchInput1Penduduk.id, searchInput1Pet.id],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
              lastRecordIdsPerObject: {
                penduduk: searchInput1Penduduk.id,
                pet: searchInput1Pet.id,
              },
            },
          },
        },
      },
    },
    {
      title: 'should find keluarga by nomorKk partial match',
      context: {
        input: {
          searchInput: 'NaivePortal',
          excludedObjectNameSingulars: ['workspaceMember'],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: null,
          },
        },
      },
    },
    {
      title:
        'should find CJK records via ILIKE fallback when tsvector tokenization fails',
      context: {
        input: {
          searchInput: '商业',
          excludedObjectNameSingulars: [
            'workspaceMember',
            'employmentHistory',
            'petCareAgreement',
          ],
          includedObjectNameSingulars: ['pet'],
          limit: 50,
        },
        eval: {
          orderedRecordIds: [cjkPet.id],
          pageInfo: {
            hasNextPage: false,
            decodedEndCursor: {
              lastRanks: { tsRank: 0, tsRankCD: 0 },
              lastRecordIdsPerObject: {
                pet: cjkPet.id,
              },
            },
          },
        },
      },
    },
  ];

  it.each(eachTestingContextFilter(testsUseCases))(
    '$title',
    async ({ context }) => {
      const response = await search({
        ...context.input,
        expectToFail: false,
      });

      expect(response.data).toBeDefined();
      expect(response.data.search).toBeDefined();

      const searchResult = response.data.search;
      const edges = searchResult.edges;
      const pageInfo = searchResult.pageInfo;

      if (context.eval.orderedRecordIds.length > 0) {
        expect(edges).not.toHaveLength(0);
      } else {
        expect(edges).toHaveLength(0);
      }

      expect(
        edges.map((edge: SearchResultEdgeDTO) => edge.node.recordId),
      ).toEqual(context.eval.orderedRecordIds);

      expect(pageInfo).toBeDefined();
      expect(context.eval.pageInfo.hasNextPage).toEqual(pageInfo.hasNextPage);
      expect(context.eval.pageInfo.decodedEndCursor).toEqual(
        pageInfo.endCursor
          ? decodeCursor(pageInfo.endCursor)
          : pageInfo.endCursor,
      );
    },
  );

  it('should return cursor for each search edge', async () => {
    const response = await search({
      searchInput: 'searchInput',
      excludedObjectNameSingulars: [
        'workspaceMember',
        'employmentHistory',
        'petCareAgreement',
      ],
      limit: 2,
      expectToFail: false,
    });

    const expectedResult = {
      edges: [
        {
          cursor: encodeCursorData({
            lastRanks: { tsRankCD: 0.1, tsRank: 0.06079271 },
            lastRecordIdsPerObject: {
              penduduk: searchInput1Penduduk.id,
            },
          }),
        },
        {
          cursor: encodeCursorData({
            lastRanks: { tsRankCD: 0.1, tsRank: 0.06079271 },
            lastRecordIdsPerObject: {
              penduduk: searchInput2Penduduk.id,
            },
          }),
        },
      ],
      pageInfo: {
        hasNextPage: true,
        endCursor: encodeCursorData({
          lastRanks: { tsRankCD: 0.1, tsRank: 0.06079271 },
          lastRecordIdsPerObject: {
            penduduk: searchInput2Penduduk.id,
          },
        }),
      },
    };

    expect({
      ...response.data.search,
      edges: response.data.search.edges.map((edge: SearchResultEdgeDTO) => ({
        cursor: edge.cursor,
      })),
    }).toEqual(expectedResult);
  });

  it('should return cursor for each search edge with after cursor input', async () => {
    const response = await search({
      searchInput: 'searchInput',
      excludedObjectNameSingulars: [
        'workspaceMember',
        'employmentHistory',
        'petCareAgreement',
      ],
      limit: 2,
      after: encodeCursorData({
        lastRanks: { tsRank: 0.06079271, tsRankCD: 0.1 },
        lastRecordIdsPerObject: {
          penduduk: searchInput2Penduduk.id,
        },
      }),
      expectToFail: false,
    });

    const expectedResult = {
      edges: [
        {
          cursor: encodeCursorData({
            lastRanks: { tsRankCD: 0.1, tsRank: 0.06079271 },
            lastRecordIdsPerObject: {
              penduduk: searchInput3Penduduk.id,
            },
          }),
        },
        {
          cursor: encodeCursorData({
            lastRanks: { tsRankCD: 0.1, tsRank: 0.06079271 },
            lastRecordIdsPerObject: {
              penduduk: searchInput3Penduduk.id,
              pet: searchInput1Pet.id,
            },
          }),
        },
      ],
      pageInfo: {
        hasNextPage: true,
        endCursor: encodeCursorData({
          lastRanks: { tsRankCD: 0.1, tsRank: 0.06079271 },
          lastRecordIdsPerObject: {
            penduduk: searchInput3Penduduk.id,
            pet: searchInput1Pet.id,
          },
        }),
      },
    };

    expect({
      ...response.data.search,
      edges: response.data.search.edges.map((edge: SearchResultEdgeDTO) => ({
        cursor: edge.cursor,
      })),
    }).toEqual(expectedResult);
  });
});
