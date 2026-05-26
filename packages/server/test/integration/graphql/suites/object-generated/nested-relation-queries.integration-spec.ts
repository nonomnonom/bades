import {
  TEST_KELUARGA_1_ID,
  TEST_KELUARGA_2_ID,
} from 'test/integration/constants/test-keluarga-ids.constants';
import {
  TEST_PENDUDUK_1_ID,
  TEST_PENDUDUK_2_ID,
} from 'test/integration/constants/test-penduduk-ids.constants';
import {
  TEST_PET_ID_1,
  TEST_PET_ID_2,
  TEST_PET_ID_3,
} from 'test/integration/constants/test-pet-ids.constants';
import { TEST_ROCKET_ID_1 } from 'test/integration/constants/test-rocket-ids.constants';
import { TEST_SURVEY_RESULT_1_ID } from 'test/integration/constants/test-survey-result-ids.constants';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { createManyOperation } from 'test/integration/graphql/utils/create-many-operation.util';
import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { destroyManyOperationFactory } from 'test/integration/graphql/utils/destroy-many-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { updateManyOperationFactory } from 'test/integration/graphql/utils/update-many-operation-factory.util';
import { updateOneOperationFactory } from 'test/integration/graphql/utils/update-one-operation-factory.util';
import { type ObjectRecord } from 'shared/types';

import { ErrorCode } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';

// Bades: penduduk (warga desa) terhubung ke keluarga (Kartu Keluarga) via
// relasi MANY-TO-ONE. Menggantikan person→company dari CRM warisan Twenty.
const PENDUDUK_GQL_FIELDS_WITH_KELUARGA = `
  id
  tempatLahir
  kartuKeluarga {
    id
  }
`;

const PET_GQL_FIELDS_WITH_OWNER = `
  id
  name
  polymorphicOwnerSurveyResultId
  polymorphicOwnerSurveyResult {
    id
    name
  }
  polymorphicOwnerRocketId
  polymorphicOwnerRocket {
    id
    name
  }
`;

describe('relation connect in workspace createOne/createMany resolvers  (e2e)', () => {
  const [keluarga1, keluarga2] = [
    { id: TEST_KELUARGA_1_ID, nomorKk: '3201010101010001' },
    { id: TEST_KELUARGA_2_ID, nomorKk: '3201010101010002' },
  ];

  beforeAll(async () => {
    await makeGraphqlAPIRequest(
      destroyManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'keluargas',
        gqlFields: `id`,
        filter: {
          id: {
            in: [TEST_KELUARGA_1_ID, TEST_KELUARGA_2_ID],
          },
        },
      }),
    );

    await createManyOperation({
      objectMetadataSingularName: 'keluarga',
      objectMetadataPluralName: 'keluargas',
      gqlFields: 'id',
      data: [keluarga1, keluarga2],
    });
  });

  beforeEach(async () => {
    await makeGraphqlAPIRequest(
      destroyManyOperationFactory({
        objectMetadataSingularName: 'penduduk',
        objectMetadataPluralName: 'penduduks',
        gqlFields: `id`,
        filter: {
          id: {
            in: [TEST_PENDUDUK_1_ID, TEST_PENDUDUK_2_ID],
          },
        },
      }),
    );
  });

  afterAll(async () => {
    await makeGraphqlAPIRequest(
      destroyManyOperationFactory({
        objectMetadataSingularName: 'keluarga',
        objectMetadataPluralName: 'keluargas',
        gqlFields: `id`,
        filter: {
          id: {
            in: [TEST_KELUARGA_1_ID, TEST_KELUARGA_2_ID],
          },
        },
      }),
    );
    await makeGraphqlAPIRequest(
      destroyManyOperationFactory({
        objectMetadataSingularName: 'penduduk',
        objectMetadataPluralName: 'penduduks',
        gqlFields: `id`,
        filter: {
          id: {
            in: [TEST_PENDUDUK_1_ID, TEST_PENDUDUK_2_ID],
          },
        },
      }),
    );
  });

  it('should connect to other records through a MANY-TO-ONE relation - create One', async () => {
    const graphqlOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: {
        id: TEST_PENDUDUK_1_ID,
        keluarga: {
          connect: {
            where: { nomorKk: '3201010101010001' },
          },
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.createPenduduk).toBeDefined();
    expect(response.body.data.createPenduduk.id).toBe(TEST_PENDUDUK_1_ID);
    expect(response.body.data.createPenduduk.keluarga.id).toBe(
      TEST_KELUARGA_1_ID,
    );
  });

  it('should connect to other records through a MANY-TO-ONE relation - create Many - upsert false', async () => {
    const graphqlOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: [
        {
          id: TEST_PENDUDUK_1_ID,
          keluarga: {
            connect: {
              where: { nomorKk: '3201010101010001' },
            },
          },
        },
        {
          id: TEST_PENDUDUK_2_ID,
          keluarga: {
            connect: {
              where: { nomorKk: '3201010101010002' },
            },
          },
        },
      ],
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.createPenduduks).toBeDefined();
    expect(response.body.data.createPenduduks).toHaveLength(2);
    expect(response.body.data.createPenduduks[0].keluarga.id).toBe(
      TEST_KELUARGA_1_ID,
    );
    expect(response.body.data.createPenduduks[1].keluarga.id).toBe(
      TEST_KELUARGA_2_ID,
    );
  });

  it('should connect to other records through a MANY-TO-ONE relation - create Many - upsert true', async () => {
    const createPendudukToUpdateOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: {
        id: TEST_PENDUDUK_1_ID,
        tempatLahir: 'Sukamaju',
        kartuKeluargaId: TEST_KELUARGA_1_ID,
      },
    });

    await makeGraphqlAPIRequest(createPendudukToUpdateOperation);

    const graphqlOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: [
        {
          id: TEST_PENDUDUK_1_ID,
          keluarga: {
            connect: {
              where: { nomorKk: '3201010101010002' },
            },
          },
        },
        {
          id: TEST_PENDUDUK_2_ID,
          tempatLahir: 'Cirebon',
          keluarga: {
            connect: {
              where: { nomorKk: '3201010101010001' },
            },
          },
        },
      ],
      upsert: true,
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.createPenduduks).toBeDefined();
    expect(response.body.data.createPenduduks).toHaveLength(2);

    const updatedPenduduk = response.body.data.createPenduduks.find(
      (penduduk: ObjectRecord) => penduduk.id === TEST_PENDUDUK_1_ID,
    );

    const insertedPenduduk = response.body.data.createPenduduks.find(
      (penduduk: ObjectRecord) => penduduk.id === TEST_PENDUDUK_2_ID,
    );

    expect(updatedPenduduk.keluarga.id).toBe(TEST_KELUARGA_2_ID);
    expect(updatedPenduduk.tempatLahir).toBe('Sukamaju');

    expect(insertedPenduduk.keluarga.id).toBe(TEST_KELUARGA_1_ID);
    expect(insertedPenduduk.tempatLahir).toBe('Cirebon');
  });

  it('should connect to other records through a MANY-TO-ONE relation - update One', async () => {
    const createPendudukToUpdateOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: {
        id: TEST_PENDUDUK_1_ID,
        tempatLahir: 'Sukamaju',
        kartuKeluargaId: TEST_KELUARGA_1_ID,
      },
    });

    await makeGraphqlAPIRequest(createPendudukToUpdateOperation);

    const graphqlOperation = updateOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      recordId: TEST_PENDUDUK_1_ID,
      data: {
        keluarga: {
          connect: {
            where: { nomorKk: '3201010101010002' },
          },
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.updatePenduduk).toBeDefined();
    expect(response.body.data.updatePenduduk.keluarga.id).toBe(
      TEST_KELUARGA_2_ID,
    );
    expect(response.body.data.updatePenduduk.tempatLahir).toBe('Sukamaju');
  });

  it('should connect to other records through a MANY-TO-ONE relation - update Many', async () => {
    const createPenduduksToUpdateOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: [
        {
          id: TEST_PENDUDUK_1_ID,
          kartuKeluargaId: TEST_KELUARGA_1_ID,
        },
        {
          id: TEST_PENDUDUK_2_ID,
        },
      ],
    });

    await makeGraphqlAPIRequest(createPenduduksToUpdateOperation);

    const graphqlOperation = updateManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      filter: {
        id: {
          in: [TEST_PENDUDUK_1_ID, TEST_PENDUDUK_2_ID],
        },
      },
      data: {
        keluarga: {
          connect: {
            where: { nomorKk: '3201010101010002' },
          },
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.updatePenduduks).toBeDefined();
    expect(response.body.data.updatePenduduks).toHaveLength(2);

    expect(response.body.data.updatePenduduks[0].keluarga.id).toBe(
      TEST_KELUARGA_2_ID,
    );
    expect(response.body.data.updatePenduduks[1].keluarga.id).toBe(
      TEST_KELUARGA_2_ID,
    );
  });

  it('should throw an error if relation id field and relation connect field are both provided', async () => {
    const graphqlOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: {
        id: TEST_PENDUDUK_1_ID,
        kartuKeluargaId: TEST_KELUARGA_1_ID,
        keluarga: {
          connect: {
            where: { nomorKk: '3201010101010001' },
          },
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      'keluarga and kartuKeluargaId cannot be both provided.',
    );
    expect(response.body.errors[0].extensions.code).toBe(
      ErrorCode.BAD_USER_INPUT,
    );
  });

  it('should throw an error if record to connect to does not exist', async () => {
    const graphqlOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: {
        id: TEST_PENDUDUK_1_ID,
        keluarga: {
          connect: {
            where: { nomorKk: '9999999999999999' },
          },
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      'Expected 1 record to connect to keluarga, but found 0 for nomorKk = 9999999999999999',
    );
    expect(response.body.errors[0].extensions.code).toBe(
      ErrorCode.BAD_USER_INPUT,
    );
  });

  it('should throw an error if unique constraint is not the same for all created records', async () => {
    const graphqlOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: [
        {
          id: TEST_PENDUDUK_1_ID,
          keluarga: {
            connect: {
              where: { nomorKk: '3201010101010001' },
            },
          },
        },
        {
          id: TEST_PENDUDUK_2_ID,
          keluarga: {
            connect: {
              where: { id: TEST_KELUARGA_2_ID },
            },
          },
        },
      ],
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      'Expected the same constraint fields to be used consistently across all operations for keluarga.',
    );
    expect(response.body.errors[0].extensions.code).toBe(
      ErrorCode.BAD_USER_INPUT,
    );
  });

  // Bades: test scenario "connect with non-unique field" — field nomorKk adalah unique constraint
  // yang valid. Test ini memastikan error muncul saat field bukan bagian dari unique constraint.
  it('should throw an error if connect field is not set with field from unique constraint', async () => {
    const graphqlOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: {
        id: TEST_PENDUDUK_1_ID,
        keluarga: {
          connect: {
            where: { alamat: 'Jl. Merdeka 1' },
          },
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      "Missing required fields: at least one unique constraint have to be fully populated for 'keluarga'.",
    );
    expect(response.body.errors[0].extensions.code).toBe(
      ErrorCode.BAD_USER_INPUT,
    );
  });

  it('should throw an error if connect and disconnect are both provided', async () => {
    const graphqlOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: {
        id: TEST_PENDUDUK_1_ID,
        keluarga: {
          connect: {
            where: { nomorKk: '3201010101010001' },
          },
          disconnect: true,
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(
      'Cannot have both connect and disconnect for the same field on undefined.',
    );
  });

  it('should disconnect a record from a MANY-TO-ONE relation - update One', async () => {
    const createPendudukToUpdateOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: {
        id: TEST_PENDUDUK_1_ID,
        kartuKeluargaId: TEST_KELUARGA_1_ID,
      },
    });

    await makeGraphqlAPIRequest(createPendudukToUpdateOperation);

    const graphqlOperation = updateOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      recordId: TEST_PENDUDUK_1_ID,
      data: {
        keluarga: {
          disconnect: true,
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.updatePenduduk).toBeDefined();
    expect(response.body.data.updatePenduduk.keluarga?.id).toBeUndefined();
  });

  it('should not disconnect a record from a MANY-TO-ONE relation - update One', async () => {
    const createPendudukToUpdateOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: {
        id: TEST_PENDUDUK_1_ID,
        kartuKeluargaId: TEST_KELUARGA_1_ID,
      },
    });

    await makeGraphqlAPIRequest(createPendudukToUpdateOperation);

    const graphqlOperation = updateOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      recordId: TEST_PENDUDUK_1_ID,
      data: {
        keluarga: {
          disconnect: false,
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.updatePenduduk).toBeDefined();
    expect(response.body.data.updatePenduduk.keluarga?.id).toBe(
      TEST_KELUARGA_1_ID,
    );
  });

  it('should disconnect a record from a MANY-TO-ONE relation - update Many', async () => {
    const createPenduduksToUpdateOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: [
        {
          id: TEST_PENDUDUK_1_ID,
          kartuKeluargaId: TEST_KELUARGA_1_ID,
        },
        {
          id: TEST_PENDUDUK_2_ID,
          kartuKeluargaId: TEST_KELUARGA_2_ID,
        },
      ],
    });

    await makeGraphqlAPIRequest(createPenduduksToUpdateOperation);

    const graphqlOperation = updateManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      filter: {
        id: {
          in: [TEST_PENDUDUK_1_ID, TEST_PENDUDUK_2_ID],
        },
      },
      data: {
        keluarga: {
          disconnect: true,
        },
      },
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.updatePenduduks).toBeDefined();
    expect(response.body.data.updatePenduduks).toHaveLength(2);

    expect(response.body.data.updatePenduduks[0].keluarga?.id).toBeUndefined();
    expect(response.body.data.updatePenduduks[1].keluarga?.id).toBeUndefined();
  });

  it('should disconnect a record from a MANY-TO-ONE relation - create Many - upsert true', async () => {
    const createPendudukToUpdateOperation = createOneOperationFactory({
      objectMetadataSingularName: 'penduduk',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: {
        id: TEST_PENDUDUK_1_ID,
        kartuKeluargaId: TEST_KELUARGA_1_ID,
      },
    });

    await makeGraphqlAPIRequest(createPendudukToUpdateOperation);

    const graphqlOperation = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS_WITH_KELUARGA,
      data: [
        {
          id: TEST_PENDUDUK_1_ID,
          keluarga: {
            disconnect: true,
          },
        },
        {
          id: TEST_PENDUDUK_2_ID,
          keluarga: {
            connect: {
              where: { nomorKk: '3201010101010002' },
            },
          },
        },
      ],
      upsert: true,
    });

    const response = await makeGraphqlAPIRequest(graphqlOperation);

    expect(response.body.data.createPenduduks).toBeDefined();
    expect(response.body.data.createPenduduks).toHaveLength(2);

    const updatedPenduduk = response.body.data.createPenduduks.find(
      (penduduk: ObjectRecord) => penduduk.id === TEST_PENDUDUK_1_ID,
    );

    const insertedPenduduk = response.body.data.createPenduduks.find(
      (penduduk: ObjectRecord) => penduduk.id === TEST_PENDUDUK_2_ID,
    );

    expect(updatedPenduduk.keluarga?.id).toBeUndefined();
    expect(insertedPenduduk.keluarga?.id).toBe(TEST_KELUARGA_2_ID);
  });

  it('should connect a morph relation polymorphicOwnerSurveyResult on pet via the connect feature', async () => {
    const PET_OBJECT_NAME = 'pet';
    const SURVEY_RESULT_OBJECT_NAME = 'surveyResult';
    const TEST_PET_ID = TEST_PET_ID_1;
    const TEST_SURVEY_RESULT_ID = TEST_SURVEY_RESULT_1_ID;

    // Create the survey result record first
    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: SURVEY_RESULT_OBJECT_NAME,
        gqlFields: 'id',
        data: {
          id: TEST_SURVEY_RESULT_ID,
          name: 'Test Survey Result',
        },
      }),
    );

    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: PET_OBJECT_NAME,
        gqlFields: 'id',
        data: {
          id: TEST_PET_ID,
          name: 'Test Pet',
        },
      }),
    );

    const updatePetOwnerSurveyResultOp = updateOneOperationFactory({
      objectMetadataSingularName: PET_OBJECT_NAME,
      recordId: TEST_PET_ID,
      gqlFields: PET_GQL_FIELDS_WITH_OWNER,
      data: {
        polymorphicOwnerSurveyResult: {
          connect: {
            where: { id: TEST_SURVEY_RESULT_ID },
          },
        },
      },
    });

    const response = await makeGraphqlAPIRequest(updatePetOwnerSurveyResultOp);

    expect(response.body.data.updatePet).toBeDefined();
    expect(
      response.body.data.updatePet.polymorphicOwnerSurveyResult,
    ).toBeDefined();
    expect(response.body.data.updatePet.polymorphicOwnerSurveyResult.id).toBe(
      TEST_SURVEY_RESULT_ID,
    );
    expect(response.body.data.updatePet.polymorphicOwnerRocketId).toBeFalsy();
  });

  it('should disconnect a morph relation successfully', async () => {
    const PET_OBJECT_NAME = 'pet';
    const SURVEY_RESULT_OBJECT_NAME = 'surveyResult';
    const TEST_PET_ID = TEST_PET_ID_2;
    const TEST_SURVEY_RESULT_ID = TEST_SURVEY_RESULT_1_ID;

    // Create the survey result record first (if not already created by previous test)
    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: SURVEY_RESULT_OBJECT_NAME,
        gqlFields: 'id',
        data: {
          id: TEST_SURVEY_RESULT_ID,
          name: 'Test Survey Result',
        },
      }),
    );

    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: PET_OBJECT_NAME,
        gqlFields: 'id',
        data: {
          id: TEST_PET_ID,
          name: 'Test Pet 2',
        },
      }),
    );

    const updatePetOwnerSurveyResultOp = updateOneOperationFactory({
      objectMetadataSingularName: PET_OBJECT_NAME,
      recordId: TEST_PET_ID,
      gqlFields: PET_GQL_FIELDS_WITH_OWNER,
      data: {
        polymorphicOwnerSurveyResult: {
          connect: {
            where: { id: TEST_SURVEY_RESULT_ID },
          },
        },
      },
    });

    let response = await makeGraphqlAPIRequest(updatePetOwnerSurveyResultOp);

    expect(
      response.body.data.updatePet.polymorphicOwnerSurveyResult,
    ).toBeDefined();

    const updatePetOwnerSurveyResultDisconnectOp = updateOneOperationFactory({
      objectMetadataSingularName: PET_OBJECT_NAME,
      recordId: TEST_PET_ID,
      gqlFields: PET_GQL_FIELDS_WITH_OWNER,
      data: {
        polymorphicOwnerSurveyResult: {
          disconnect: true,
        },
      },
    });

    response = await makeGraphqlAPIRequest(
      updatePetOwnerSurveyResultDisconnectOp,
    );
    expect(
      response.body.data.updatePet.polymorphicOwnerSurveyResult,
    ).toBeFalsy();
  });

  // TODO: run this test when validations are implemented in commonAPI
  xit('should fail to create a morph relation on both target objects', async () => {
    const PET_OBJECT_NAME = 'pet';
    const TEST_PET_ID = TEST_PET_ID_3;
    const TEST_ROCKET_ID = TEST_ROCKET_ID_1;

    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: PET_OBJECT_NAME,
        gqlFields: 'id',
        data: {
          id: TEST_PET_ID,
          name: 'Test Pet 3',
        },
      }),
    );

    const TEST_SURVEY_RESULT_ID = TEST_SURVEY_RESULT_1_ID;

    const updatePetOwnerSurveyResultOp = updateOneOperationFactory({
      objectMetadataSingularName: PET_OBJECT_NAME,
      recordId: TEST_PET_ID,
      gqlFields: PET_GQL_FIELDS_WITH_OWNER,
      data: {
        polymorphicOwnerSurveyResult: {
          connect: {
            where: { id: TEST_SURVEY_RESULT_ID },
          },
        },
        polymorphicOwnerRocket: {
          connect: {
            where: { id: TEST_ROCKET_ID },
          },
        },
      },
    });

    let response = await makeGraphqlAPIRequest(updatePetOwnerSurveyResultOp);

    expect(response.body.errors).toBeTruthy();
  });
});
