// Pengujian pagination pada composite field FULL_NAME (`namaLengkap`) di objek `penduduk`.
//
// Scenario EMAILS (person.emails) dan LINKS (company.domainName) dihapus karena
// tidak ada padanan composite field di skema SID Bades.
// Composite FULL_NAME (`namaLengkap`) tetap diuji karena masih relevan dan identik
// secara struktur dengan FULL_NAME CRM sebelumnya.

import { PENDUDUK_GQL_FIELDS } from 'test/integration/constants/penduduk-gql-fields.constants';
import {
  TEST_PENDUDUK_1_ID,
  TEST_PENDUDUK_2_ID,
  TEST_PENDUDUK_3_ID,
  TEST_PENDUDUK_4_ID,
  TEST_PENDUDUK_5_ID,
} from 'test/integration/constants/test-penduduk-ids.constants';
import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { findManyOperationFactory } from 'test/integration/graphql/utils/find-many-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { deleteAllRecords } from 'test/integration/utils/delete-all-records';

describe('GraphQL Penduduks Pagination with Composite Field Sorting', () => {
  beforeAll(async () => {
    await deleteAllRecords('penduduk');

    const testPenduduks = [
      {
        id: TEST_PENDUDUK_1_ID,
        firstName: 'Aisyah',
        lastName: 'Budiman',
      },
      {
        id: TEST_PENDUDUK_2_ID,
        firstName: 'Aisyah',
        lastName: 'Santoso',
      },
      {
        id: TEST_PENDUDUK_3_ID,
        firstName: 'Budi',
        lastName: 'Hartono',
      },
      {
        id: TEST_PENDUDUK_4_ID,
        firstName: 'Budi',
        lastName: 'Wibowo',
      },
      {
        id: TEST_PENDUDUK_5_ID,
        firstName: 'Cahyo',
        lastName: 'Darmawan',
      },
    ];

    for (const penduduk of testPenduduks) {
      const graphqlOperation = createOneOperationFactory({
        objectMetadataSingularName: 'penduduk',
        gqlFields: PENDUDUK_GQL_FIELDS,
        data: {
          id: penduduk.id,
          namaLengkap: {
            firstName: penduduk.firstName,
            lastName: penduduk.lastName,
          },
        },
      });

      await makeGraphqlAPIRequest(graphqlOperation).expect(200);
    }
  });

  it('should support pagination with namaLengkap composite field in ascending order', async () => {
    const firstPageOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS,
      orderBy: {
        namaLengkap: {
          firstName: 'AscNullsLast',
          lastName: 'AscNullsLast',
        },
      },
      first: 2,
    });

    const firstPageResponse =
      await makeGraphqlAPIRequest(firstPageOperation).expect(200);

    const firstPagePenduduks = firstPageResponse.body.data.penduduks.edges.map(
      (edge: any) => edge.node,
    );
    const firstPageCursor =
      firstPageResponse.body.data.penduduks.pageInfo.endCursor;

    expect(firstPagePenduduks).toHaveLength(2);
    expect(
      firstPageResponse.body.data.penduduks.pageInfo.hasNextPage,
    ).toBe(true);

    expect(firstPagePenduduks[0].namaLengkap.firstName).toBe('Aisyah');
    expect(firstPagePenduduks[0].namaLengkap.lastName).toBe('Budiman');
    expect(firstPagePenduduks[1].namaLengkap.firstName).toBe('Aisyah');
    expect(firstPagePenduduks[1].namaLengkap.lastName).toBe('Santoso');

    const secondPageOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS,
      orderBy: {
        namaLengkap: {
          firstName: 'AscNullsLast',
          lastName: 'AscNullsLast',
        },
      },
      first: 2,
      after: firstPageCursor,
    });

    const secondPageResponse =
      await makeGraphqlAPIRequest(secondPageOperation).expect(200);

    const secondPagePenduduks =
      secondPageResponse.body.data.penduduks.edges.map(
        (edge: any) => edge.node,
      );

    expect(secondPagePenduduks).toHaveLength(2);

    expect(secondPagePenduduks[0].namaLengkap.firstName).toBe('Budi');
    expect(secondPagePenduduks[0].namaLengkap.lastName).toBe('Hartono');
    expect(secondPagePenduduks[1].namaLengkap.firstName).toBe('Budi');
    expect(secondPagePenduduks[1].namaLengkap.lastName).toBe('Wibowo');

    const firstPageIds = firstPagePenduduks.map((p: { id: string }) => p.id);
    const secondPageIds = secondPagePenduduks.map((p: { id: string }) => p.id);
    const intersection = firstPageIds.filter((id: string) =>
      secondPageIds.includes(id),
    );

    expect(intersection).toHaveLength(0);

    const thirdPageOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS,
      orderBy: {
        namaLengkap: {
          firstName: 'AscNullsLast',
          lastName: 'AscNullsLast',
        },
      },
      first: 2,
      after: secondPageResponse.body.data.penduduks.pageInfo.endCursor,
    });

    const thirdPageResponse =
      await makeGraphqlAPIRequest(thirdPageOperation).expect(200);

    const thirdPagePenduduks = thirdPageResponse.body.data.penduduks.edges.map(
      (edge: any) => edge.node,
    );

    expect(thirdPagePenduduks).toHaveLength(1);
    expect(thirdPagePenduduks[0].namaLengkap.firstName).toBe('Cahyo');
    expect(thirdPagePenduduks[0].namaLengkap.lastName).toBe('Darmawan');
    expect(
      thirdPageResponse.body.data.penduduks.pageInfo.hasNextPage,
    ).toBe(false);
  });

  it('should support cursor-based pagination with namaLengkap in descending order', async () => {
    const firstPageOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS,
      orderBy: {
        namaLengkap: {
          firstName: 'DescNullsLast',
          lastName: 'DescNullsLast',
        },
      },
      first: 2,
    });

    const firstPageResponse =
      await makeGraphqlAPIRequest(firstPageOperation).expect(200);

    const firstPagePenduduks = firstPageResponse.body.data.penduduks.edges.map(
      (edge: any) => edge.node,
    );

    expect(firstPagePenduduks).toHaveLength(2);

    expect(firstPagePenduduks[0].namaLengkap.firstName).toBe('Cahyo');
    expect(firstPagePenduduks[0].namaLengkap.lastName).toBe('Darmawan');
    expect(firstPagePenduduks[1].namaLengkap.firstName).toBe('Budi');
    expect(firstPagePenduduks[1].namaLengkap.lastName).toBe('Wibowo');

    const secondPageOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS,
      orderBy: {
        namaLengkap: {
          firstName: 'DescNullsLast',
          lastName: 'DescNullsLast',
        },
      },
      first: 2,
      after: firstPageResponse.body.data.penduduks.pageInfo.endCursor,
    });

    const secondPageResponse =
      await makeGraphqlAPIRequest(secondPageOperation).expect(200);

    const secondPagePenduduks =
      secondPageResponse.body.data.penduduks.edges.map(
        (edge: any) => edge.node,
      );

    expect(secondPagePenduduks).toHaveLength(2);

    expect(secondPagePenduduks[0].namaLengkap.firstName).toBe('Budi');
    expect(secondPagePenduduks[0].namaLengkap.lastName).toBe('Hartono');
    expect(secondPagePenduduks[1].namaLengkap.firstName).toBe('Aisyah');
    expect(secondPagePenduduks[1].namaLengkap.lastName).toBe('Santoso');
  });

  it('should support backward pagination with namaLengkap composite field in ascending order', async () => {
    const allPenduduksOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS,
      orderBy: {
        namaLengkap: {
          firstName: 'AscNullsLast',
          lastName: 'AscNullsLast',
        },
      },
    });

    const allPenduduksResponse =
      await makeGraphqlAPIRequest(allPenduduksOperation).expect(200);

    const allPenduduks = allPenduduksResponse.body.data.penduduks.edges.map(
      (edge: any) => edge.node,
    );
    const lastPendudukCursor =
      allPenduduksResponse.body.data.penduduks.pageInfo.endCursor;

    const backwardPageOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'penduduks',
      gqlFields: PENDUDUK_GQL_FIELDS,
      orderBy: {
        namaLengkap: {
          firstName: 'AscNullsLast',
          lastName: 'AscNullsLast',
        },
      },
      last: 2,
      before: lastPendudukCursor,
    });

    const backwardPageResponse = await makeGraphqlAPIRequest(
      backwardPageOperation,
    ).expect(200);

    const backwardPagePenduduks =
      backwardPageResponse.body.data.penduduks.edges.map(
        (edge: any) => edge.node,
      );

    expect(backwardPagePenduduks).toHaveLength(2);

    expect(backwardPagePenduduks[0].id).toBe(allPenduduks.at(-3)?.id);
    expect(backwardPagePenduduks[1].id).toBe(allPenduduks.at(-2)?.id);
  });
});
