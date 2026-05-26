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

describe('GraphQL DaftarPenduduk Pagination with Composite Field Sorting', () => {
  beforeAll(async () => {
    await deleteAllRecords('penduduk');

    const testDaftarPenduduk = [
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

    for (const penduduk of testDaftarPenduduk) {
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
      objectMetadataPluralName: 'daftarPenduduk',
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

    const firstPageDaftarPenduduk = firstPageResponse.body.data.daftarPenduduk.edges.map(
      (edge: any) => edge.node,
    );
    const firstPageCursor =
      firstPageResponse.body.data.daftarPenduduk.pageInfo.endCursor;

    expect(firstPageDaftarPenduduk).toHaveLength(2);
    expect(
      firstPageResponse.body.data.daftarPenduduk.pageInfo.hasNextPage,
    ).toBe(true);

    expect(firstPageDaftarPenduduk[0].namaLengkap.firstName).toBe('Aisyah');
    expect(firstPageDaftarPenduduk[0].namaLengkap.lastName).toBe('Budiman');
    expect(firstPageDaftarPenduduk[1].namaLengkap.firstName).toBe('Aisyah');
    expect(firstPageDaftarPenduduk[1].namaLengkap.lastName).toBe('Santoso');

    const secondPageOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
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

    const secondPageDaftarPenduduk =
      secondPageResponse.body.data.daftarPenduduk.edges.map(
        (edge: any) => edge.node,
      );

    expect(secondPageDaftarPenduduk).toHaveLength(2);

    expect(secondPageDaftarPenduduk[0].namaLengkap.firstName).toBe('Budi');
    expect(secondPageDaftarPenduduk[0].namaLengkap.lastName).toBe('Hartono');
    expect(secondPageDaftarPenduduk[1].namaLengkap.firstName).toBe('Budi');
    expect(secondPageDaftarPenduduk[1].namaLengkap.lastName).toBe('Wibowo');

    const firstPageIds = firstPageDaftarPenduduk.map((p: { id: string }) => p.id);
    const secondPageIds = secondPageDaftarPenduduk.map((p: { id: string }) => p.id);
    const intersection = firstPageIds.filter((id: string) =>
      secondPageIds.includes(id),
    );

    expect(intersection).toHaveLength(0);

    const thirdPageOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      orderBy: {
        namaLengkap: {
          firstName: 'AscNullsLast',
          lastName: 'AscNullsLast',
        },
      },
      first: 2,
      after: secondPageResponse.body.data.daftarPenduduk.pageInfo.endCursor,
    });

    const thirdPageResponse =
      await makeGraphqlAPIRequest(thirdPageOperation).expect(200);

    const thirdPageDaftarPenduduk = thirdPageResponse.body.data.daftarPenduduk.edges.map(
      (edge: any) => edge.node,
    );

    expect(thirdPageDaftarPenduduk).toHaveLength(1);
    expect(thirdPageDaftarPenduduk[0].namaLengkap.firstName).toBe('Cahyo');
    expect(thirdPageDaftarPenduduk[0].namaLengkap.lastName).toBe('Darmawan');
    expect(
      thirdPageResponse.body.data.daftarPenduduk.pageInfo.hasNextPage,
    ).toBe(false);
  });

  it('should support cursor-based pagination with namaLengkap in descending order', async () => {
    const firstPageOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
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

    const firstPageDaftarPenduduk = firstPageResponse.body.data.daftarPenduduk.edges.map(
      (edge: any) => edge.node,
    );

    expect(firstPageDaftarPenduduk).toHaveLength(2);

    expect(firstPageDaftarPenduduk[0].namaLengkap.firstName).toBe('Cahyo');
    expect(firstPageDaftarPenduduk[0].namaLengkap.lastName).toBe('Darmawan');
    expect(firstPageDaftarPenduduk[1].namaLengkap.firstName).toBe('Budi');
    expect(firstPageDaftarPenduduk[1].namaLengkap.lastName).toBe('Wibowo');

    const secondPageOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      orderBy: {
        namaLengkap: {
          firstName: 'DescNullsLast',
          lastName: 'DescNullsLast',
        },
      },
      first: 2,
      after: firstPageResponse.body.data.daftarPenduduk.pageInfo.endCursor,
    });

    const secondPageResponse =
      await makeGraphqlAPIRequest(secondPageOperation).expect(200);

    const secondPageDaftarPenduduk =
      secondPageResponse.body.data.daftarPenduduk.edges.map(
        (edge: any) => edge.node,
      );

    expect(secondPageDaftarPenduduk).toHaveLength(2);

    expect(secondPageDaftarPenduduk[0].namaLengkap.firstName).toBe('Budi');
    expect(secondPageDaftarPenduduk[0].namaLengkap.lastName).toBe('Hartono');
    expect(secondPageDaftarPenduduk[1].namaLengkap.firstName).toBe('Aisyah');
    expect(secondPageDaftarPenduduk[1].namaLengkap.lastName).toBe('Santoso');
  });

  it('should support backward pagination with namaLengkap composite field in ascending order', async () => {
    const allDaftarPendudukOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: PENDUDUK_GQL_FIELDS,
      orderBy: {
        namaLengkap: {
          firstName: 'AscNullsLast',
          lastName: 'AscNullsLast',
        },
      },
    });

    const allDaftarPendudukResponse =
      await makeGraphqlAPIRequest(allDaftarPendudukOperation).expect(200);

    const allDaftarPenduduk = allDaftarPendudukResponse.body.data.daftarPenduduk.edges.map(
      (edge: any) => edge.node,
    );
    const lastPendudukCursor =
      allDaftarPendudukResponse.body.data.daftarPenduduk.pageInfo.endCursor;

    const backwardPageOperation = findManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
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

    const backwardPageDaftarPenduduk =
      backwardPageResponse.body.data.daftarPenduduk.edges.map(
        (edge: any) => edge.node,
      );

    expect(backwardPageDaftarPenduduk).toHaveLength(2);

    expect(backwardPageDaftarPenduduk[0].id).toBe(allDaftarPenduduk.at(-3)?.id);
    expect(backwardPageDaftarPenduduk[1].id).toBe(allDaftarPenduduk.at(-2)?.id);
  });
});
