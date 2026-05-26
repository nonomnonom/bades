import gql from 'graphql-tag';
import { createManyOperationFactory } from 'test/integration/graphql/utils/create-many-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';

// Bades: test ORDER BY pada relasi penduduk→kartuKeluarga. Field `nomorKk`
// adalah identifier KK 16-digit (numerik strict per Permendagri 109/2019),
// sehingga tidak cocok untuk uji sort alphabetical + case-insensitive.
// Gunakan field `alamat` (TEXT bebas) yang memang dimaksudkan untuk konten
// natural berbasis huruf — sort lexicographic + collation case-insensitive
// jadi bermakna.

const TEST_KELUARGA_IDS = {
  ANGGREK: '20202020-aaaa-4000-8000-000000000001',
  BELIMBING: '20202020-aaaa-4000-8000-000000000002',
  CENDANA: '20202020-aaaa-4000-8000-000000000003',
  // Keluarga untuk uji pengurutan case-insensitive (huruf kecil vs kapital)
  DAHLIA_LOWER: '20202020-aaaa-4000-8000-000000000004',
  DAHLIA_UPPER: '20202020-aaaa-4000-8000-000000000005',
  ZAMRUD: '20202020-aaaa-4000-8000-000000000006',
};

const TEST_PENDUDUK_IDS = [
  '20202020-bbbb-4000-8000-000000000001',
  '20202020-bbbb-4000-8000-000000000002',
  '20202020-bbbb-4000-8000-000000000003',
  '20202020-bbbb-4000-8000-000000000004',
  '20202020-bbbb-4000-8000-000000000005',
  '20202020-bbbb-4000-8000-000000000006',
  '20202020-bbbb-4000-8000-000000000007',
  '20202020-bbbb-4000-8000-000000000008',
  '20202020-bbbb-4000-8000-000000000009',
  '20202020-bbbb-4000-8000-000000000010',
];

const CASE_INSENSITIVE_TEST_PENDUDUK_IDS = [
  '20202020-bbbb-4000-8000-000000000011',
  '20202020-bbbb-4000-8000-000000000012',
  '20202020-bbbb-4000-8000-000000000013',
];

describe('Order by relation field (e2e)', () => {
  beforeAll(async () => {
    // Setiap keluarga punya nomorKk 16-digit unik (sesuai format KTP-el) +
    // alamat sebagai field TEXT yang akan dipakai uji sort.
    const createDaftarKeluarga = createManyOperationFactory({
      objectMetadataSingularName: 'keluarga',
      objectMetadataPluralName: 'daftarKeluarga',
      gqlFields: 'id nomorKk alamat',
      data: [
        {
          id: TEST_KELUARGA_IDS.ANGGREK,
          nomorKk: '3201010000000001',
          alamat: 'Jl. Anggrek No. 1',
        },
        {
          id: TEST_KELUARGA_IDS.BELIMBING,
          nomorKk: '3201010000000002',
          alamat: 'Jl. Belimbing No. 2',
        },
        {
          id: TEST_KELUARGA_IDS.CENDANA,
          nomorKk: '3201010000000003',
          alamat: 'Jl. Cendana No. 3',
        },
        // Keluarga untuk uji pengurutan case-insensitive (huruf kecil vs kapital)
        {
          id: TEST_KELUARGA_IDS.DAHLIA_LOWER,
          nomorKk: '3201010000000004',
          alamat: 'jl. dahlia no. 4',
        },
        {
          id: TEST_KELUARGA_IDS.DAHLIA_UPPER,
          nomorKk: '3201010000000005',
          alamat: 'JL. DAHLIA NO. 5',
        },
        {
          id: TEST_KELUARGA_IDS.ZAMRUD,
          nomorKk: '3201010000000006',
          alamat: 'Jl. Zamrud No. 99',
        },
      ],
      upsert: true,
    });

    await makeGraphqlAPIRequest(createDaftarKeluarga);

    // Buat test penduduk dengan relasi kartuKeluarga dan beberapa tanpa relasi (untuk uji null)
    const createDaftarPenduduk = createManyOperationFactory({
      objectMetadataSingularName: 'penduduk',
      objectMetadataPluralName: 'daftarPenduduk',
      gqlFields: 'id',
      data: [
        // Penduduk dengan kartuKeluarga (untuk uji pengurutan)
        { id: TEST_PENDUDUK_IDS[0], kartuKeluargaId: TEST_KELUARGA_IDS.ANGGREK },
        { id: TEST_PENDUDUK_IDS[1], kartuKeluargaId: TEST_KELUARGA_IDS.ANGGREK },
        {
          id: TEST_PENDUDUK_IDS[2],
          kartuKeluargaId: TEST_KELUARGA_IDS.BELIMBING,
        },
        {
          id: TEST_PENDUDUK_IDS[3],
          kartuKeluargaId: TEST_KELUARGA_IDS.BELIMBING,
        },
        { id: TEST_PENDUDUK_IDS[4], kartuKeluargaId: TEST_KELUARGA_IDS.CENDANA },
        { id: TEST_PENDUDUK_IDS[5], kartuKeluargaId: TEST_KELUARGA_IDS.CENDANA },
        // Penduduk tanpa kartuKeluarga (untuk uji NULLS LAST)
        { id: TEST_PENDUDUK_IDS[6], kartuKeluargaId: null },
        { id: TEST_PENDUDUK_IDS[7], kartuKeluargaId: null },
        { id: TEST_PENDUDUK_IDS[8], kartuKeluargaId: null },
        { id: TEST_PENDUDUK_IDS[9], kartuKeluargaId: null },
        // Penduduk untuk uji pengurutan case-insensitive
        {
          id: CASE_INSENSITIVE_TEST_PENDUDUK_IDS[0],
          kartuKeluargaId: TEST_KELUARGA_IDS.DAHLIA_LOWER,
        },
        {
          id: CASE_INSENSITIVE_TEST_PENDUDUK_IDS[1],
          kartuKeluargaId: TEST_KELUARGA_IDS.DAHLIA_UPPER,
        },
        {
          id: CASE_INSENSITIVE_TEST_PENDUDUK_IDS[2],
          kartuKeluargaId: TEST_KELUARGA_IDS.ZAMRUD,
        },
      ],
      upsert: true,
    });

    await makeGraphqlAPIRequest(createDaftarPenduduk);
  });

  it('should sort daftarPenduduk by kartuKeluarga alamat ascending', async () => {
    const queryData = {
      query: gql`
        query DaftarPenduduk(
          $orderBy: [PendudukOrderByInput]
          $filter: PendudukFilterInput
        ) {
          daftarPenduduk(orderBy: $orderBy, filter: $filter, first: 10) {
            edges {
              node {
                id
                namaLengkap {
                  firstName
                  lastName
                }
                kartuKeluarga {
                  alamat
                }
              }
            }
          }
        }
      `,
      variables: {
        orderBy: [{ kartuKeluarga: { alamat: 'AscNullsLast' } }],
        filter: { id: { in: TEST_PENDUDUK_IDS } },
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    expect(response.body.data).toBeDefined();
    expect(response.body.errors).toBeUndefined();

    const edges = response.body.data.daftarPenduduk.edges;

    expect(Array.isArray(edges)).toBe(true);
    expect(edges.length).toBeGreaterThan(0);

    // Verifikasi alamat urut ascending (null di akhir)
    const alamatList = edges
      .map(
        (edge: { node: { kartuKeluarga?: { alamat: string } } }) =>
          edge.node.kartuKeluarga?.alamat,
      )
      .filter(Boolean);

    const sortedAlamatList = [...alamatList].sort((a, b) => a.localeCompare(b));

    expect(alamatList).toEqual(sortedAlamatList);
  });

  it('should sort daftarPenduduk by kartuKeluarga alamat descending', async () => {
    const queryData = {
      query: gql`
        query DaftarPenduduk(
          $orderBy: [PendudukOrderByInput]
          $filter: PendudukFilterInput
        ) {
          daftarPenduduk(orderBy: $orderBy, filter: $filter, first: 10) {
            edges {
              node {
                id
                namaLengkap {
                  firstName
                  lastName
                }
                kartuKeluarga {
                  alamat
                }
              }
            }
          }
        }
      `,
      variables: {
        orderBy: [{ kartuKeluarga: { alamat: 'DescNullsLast' } }],
        filter: { id: { in: TEST_PENDUDUK_IDS } },
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    expect(response.body.data).toBeDefined();
    expect(response.body.errors).toBeUndefined();

    const edges = response.body.data.daftarPenduduk.edges;

    expect(Array.isArray(edges)).toBe(true);
    expect(edges.length).toBeGreaterThan(0);

    // Verifikasi alamat urut descending (null di akhir)
    const alamatList = edges
      .map(
        (edge: { node: { kartuKeluarga?: { alamat: string } } }) =>
          edge.node.kartuKeluarga?.alamat,
      )
      .filter(Boolean);

    const sortedAlamatList = [...alamatList].sort((a, b) => b.localeCompare(a));

    expect(alamatList).toEqual(sortedAlamatList);
  });

  it('should handle null relations with NULLS LAST', async () => {
    const queryData = {
      query: gql`
        query DaftarPenduduk(
          $orderBy: [PendudukOrderByInput]
          $filter: PendudukFilterInput
        ) {
          daftarPenduduk(orderBy: $orderBy, filter: $filter, first: 50) {
            edges {
              node {
                id
                namaLengkap {
                  firstName
                  lastName
                }
                kartuKeluarga {
                  alamat
                }
              }
            }
          }
        }
      `,
      variables: {
        orderBy: [{ kartuKeluarga: { alamat: 'AscNullsLast' } }],
        filter: { id: { in: TEST_PENDUDUK_IDS } },
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    expect(response.body.data).toBeDefined();
    expect(response.body.errors).toBeUndefined();

    const edges = response.body.data.daftarPenduduk.edges;

    expect(Array.isArray(edges)).toBe(true);
    expect(edges.length).toBeGreaterThan(0);

    // Pastikan penduduk tanpa kartuKeluarga muncul di akhir
    let seenNull = false;

    for (const edge of edges) {
      if (edge.node.kartuKeluarga === null) {
        seenNull = true;
      } else if (seenNull) {
        // Jika sudah menemukan null, record non-null sesudahnya berarti urutan salah
        throw new Error(
          'Records tanpa kartuKeluarga harus muncul di paling akhir',
        );
      }
    }
  });

  it('should work with offset pagination', async () => {
    // Request pertama untuk mendapatkan data awal
    const firstQueryData = {
      query: gql`
        query DaftarPenduduk(
          $orderBy: [PendudukOrderByInput]
          $filter: PendudukFilterInput
          $limit: Int
        ) {
          daftarPenduduk(orderBy: $orderBy, filter: $filter, first: $limit) {
            edges {
              node {
                id
                kartuKeluarga {
                  alamat
                }
              }
            }
            totalCount
          }
        }
      `,
      variables: {
        orderBy: [{ kartuKeluarga: { alamat: 'AscNullsLast' } }],
        filter: { id: { in: TEST_PENDUDUK_IDS } },
        limit: 3,
      },
    };

    const firstResponse = await makeGraphqlAPIRequest(firstQueryData);

    expect(firstResponse.body.data).toBeDefined();
    expect(firstResponse.body.errors).toBeUndefined();

    const firstPageEdges = firstResponse.body.data.daftarPenduduk.edges;
    const totalCount = firstResponse.body.data.daftarPenduduk.totalCount;

    expect(Array.isArray(firstPageEdges)).toBe(true);
    expect(firstPageEdges.length).toBeGreaterThan(0);
    expect(totalCount).toBeGreaterThan(3);

    // Request kedua menggunakan offset (sesuai perilaku frontend)
    const secondQueryData = {
      query: gql`
        query DaftarPenduduk(
          $orderBy: [PendudukOrderByInput]
          $filter: PendudukFilterInput
          $limit: Int
          $offset: Int
        ) {
          daftarPenduduk(
            orderBy: $orderBy
            filter: $filter
            first: $limit
            offset: $offset
          ) {
            edges {
              node {
                id
                kartuKeluarga {
                  alamat
                }
              }
            }
          }
        }
      `,
      variables: {
        orderBy: [{ kartuKeluarga: { alamat: 'AscNullsLast' } }],
        filter: { id: { in: TEST_PENDUDUK_IDS } },
        limit: 3,
        offset: 3,
      },
    };

    const secondResponse = await makeGraphqlAPIRequest(secondQueryData);

    expect(secondResponse.body.data).toBeDefined();
    expect(secondResponse.body.errors).toBeUndefined();

    const secondPageEdges = secondResponse.body.data.daftarPenduduk.edges;

    expect(Array.isArray(secondPageEdges)).toBe(true);

    // Verifikasi record berbeda dikembalikan (tidak ada tumpang tindih)
    const firstPageIds = firstPageEdges.map(
      (edge: { node: { id: string } }) => edge.node.id,
    );
    const secondPageIds = secondPageEdges.map(
      (edge: { node: { id: string } }) => edge.node.id,
    );
    const overlap = firstPageIds.filter((id: string) =>
      secondPageIds.includes(id),
    );

    expect(overlap.length).toBe(0);
  });

  it.skip('should return clear error when using cursor pagination with relation orderBy', async () => {
    // Ambil cursor terlebih dahulu dengan memuat record
    const firstQueryData = {
      query: gql`
        query DaftarPenduduk(
          $orderBy: [PendudukOrderByInput]
          $filter: PendudukFilterInput
        ) {
          daftarPenduduk(orderBy: $orderBy, filter: $filter, first: 3) {
            edges {
              node {
                id
              }
              cursor
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
      variables: {
        orderBy: [{ kartuKeluarga: { alamat: 'AscNullsLast' } }],
        filter: { id: { in: TEST_PENDUDUK_IDS } },
      },
    };

    const firstResponse = await makeGraphqlAPIRequest(firstQueryData);

    expect(firstResponse.body.data).toBeDefined();
    expect(firstResponse.body.errors).toBeUndefined();

    const pageInfo = firstResponse.body.data.daftarPenduduk.pageInfo;

    // Pastikan data cukup untuk uji pagination
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.endCursor).toBeDefined();

    // Coba gunakan cursor dengan relation orderBy — harus gagal dengan pesan jelas
    const secondQueryData = {
      query: gql`
        query DaftarPenduduk(
          $orderBy: [PendudukOrderByInput]
          $filter: PendudukFilterInput
          $after: String
        ) {
          daftarPenduduk(orderBy: $orderBy, filter: $filter, first: 3, after: $after) {
            edges {
              node {
                id
              }
            }
          }
        }
      `,
      variables: {
        orderBy: [{ kartuKeluarga: { alamat: 'AscNullsLast' } }],
        filter: { id: { in: TEST_PENDUDUK_IDS } },
        after: pageInfo.endCursor,
      },
    };

    const secondResponse = await makeGraphqlAPIRequest(secondQueryData);

    expect(secondResponse.body.errors).toBeDefined();

    expect(secondResponse.body.errors[0].message).toContain(
      'Cursor-based pagination is not supported with relation field ordering',
    );
  });

  it('should allow sorting by relation FK (backward compatibility)', async () => {
    const queryData = {
      query: gql`
        query DaftarPenduduk(
          $orderBy: [PendudukOrderByInput]
          $filter: PendudukFilterInput
        ) {
          daftarPenduduk(orderBy: $orderBy, filter: $filter, first: 10) {
            edges {
              node {
                id
                kartuKeluargaId
              }
            }
          }
        }
      `,
      variables: {
        orderBy: [{ kartuKeluargaId: 'AscNullsLast' }],
        filter: { id: { in: TEST_PENDUDUK_IDS } },
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    expect(response.body.data).toBeDefined();
    expect(response.body.errors).toBeUndefined();

    const edges = response.body.data.daftarPenduduk.edges;

    expect(Array.isArray(edges)).toBe(true);
    expect(edges.length).toBeGreaterThan(0);
  });

  it('should sort case-insensitively (jl. dahlia dan JL. DAHLIA harus berdampingan sebelum Jl. Zamrud)', async () => {
    const queryData = {
      query: gql`
        query DaftarPenduduk(
          $orderBy: [PendudukOrderByInput]
          $filter: PendudukFilterInput
        ) {
          daftarPenduduk(orderBy: $orderBy, filter: $filter, first: 10) {
            edges {
              node {
                id
                kartuKeluarga {
                  alamat
                }
              }
            }
          }
        }
      `,
      variables: {
        orderBy: [{ kartuKeluarga: { alamat: 'AscNullsLast' } }],
        filter: { id: { in: CASE_INSENSITIVE_TEST_PENDUDUK_IDS } },
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    expect(response.body.data).toBeDefined();
    expect(response.body.errors).toBeUndefined();

    const edges = response.body.data.daftarPenduduk.edges;
    const alamatList = edges.map(
      (edge: { node: { kartuKeluarga?: { alamat: string } } }) =>
        edge.node.kartuKeluarga?.alamat,
    );

    expect(alamatList.length).toBe(3);

    // Baik "jl. dahlia" maupun "JL. DAHLIA" harus muncul sebelum "Jl. Zamrud"
    const zamrudIndex = alamatList.findIndex((alamat: string) =>
      alamat.toLowerCase().startsWith('jl. zamrud'),
    );
    const dahliaIndices = alamatList
      .map((alamat: string, index: number) =>
        alamat.toLowerCase().startsWith('jl. dahlia') ? index : -1,
      )
      .filter((index: number) => index !== -1);

    for (const dahliaIndex of dahliaIndices) {
      expect(dahliaIndex).toBeLessThan(zamrudIndex);
    }
  });

  it('should sort case-insensitively in descending order', async () => {
    const queryData = {
      query: gql`
        query DaftarPenduduk(
          $orderBy: [PendudukOrderByInput]
          $filter: PendudukFilterInput
        ) {
          daftarPenduduk(orderBy: $orderBy, filter: $filter, first: 10) {
            edges {
              node {
                id
                kartuKeluarga {
                  alamat
                }
              }
            }
          }
        }
      `,
      variables: {
        orderBy: [{ kartuKeluarga: { alamat: 'DescNullsLast' } }],
        filter: { id: { in: CASE_INSENSITIVE_TEST_PENDUDUK_IDS } },
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    expect(response.body.data).toBeDefined();
    expect(response.body.errors).toBeUndefined();

    const edges = response.body.data.daftarPenduduk.edges;
    const alamatList = edges.map(
      (edge: { node: { kartuKeluarga?: { alamat: string } } }) =>
        edge.node.kartuKeluarga?.alamat,
    );

    expect(alamatList.length).toBe(3);

    // Pada pengurutan case-insensitive descending, "Jl. Zamrud" harus muncul pertama
    const zamrudIndex = alamatList.findIndex((alamat: string) =>
      alamat.toLowerCase().startsWith('jl. zamrud'),
    );
    const dahliaIndices = alamatList
      .map((alamat: string, index: number) =>
        alamat.toLowerCase().startsWith('jl. dahlia') ? index : -1,
      )
      .filter((index: number) => index !== -1);

    for (const dahliaIndex of dahliaIndices) {
      expect(zamrudIndex).toBeLessThan(dahliaIndex);
    }
  });

  it('should work with filter + relation orderBy + scalar orderBy with minimal fields selected', async () => {
    // Test ini mereproduksi bug di mana subquery DISTINCT TypeORM gagal
    // ketika orderBy menyertakan kolom yang tidak ada dalam klausa SELECT.
    // Bug termanifestasi sebagai: "column distinctAlias.penduduk_position does not exist"
    const queryData = {
      query: gql`
        query DaftarPenduduk(
          $orderBy: [PendudukOrderByInput]
          $filter: PendudukFilterInput
          $limit: Int
        ) {
          daftarPenduduk(orderBy: $orderBy, filter: $filter, first: $limit) {
            edges {
              node {
                id
              }
              cursor
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            totalCount
          }
        }
      `,
      variables: {
        // Filter mengecualikan satu record — kunci untuk memicu jalur subquery DISTINCT
        filter: { id: { neq: TEST_PENDUDUK_IDS[0] } },
        // Beberapa orderBy: field relasi + field skalar (position tidak ada di SELECT)
        orderBy: [
          { kartuKeluarga: { alamat: 'DescNullsLast' } },
          { position: 'AscNullsFirst' },
        ],
        limit: 60,
      },
    };

    const response = await makeGraphqlAPIRequest(queryData);

    // Harus berhasil tanpa error "column distinctAlias.penduduk_position does not exist"
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.daftarPenduduk).toBeDefined();

    const edges = response.body.data.daftarPenduduk.edges;

    expect(Array.isArray(edges)).toBe(true);

    // Verifikasi record yang difilter tidak ada di hasil
    const resultIds = edges.map(
      (edge: { node: { id: string } }) => edge.node.id,
    );

    expect(resultIds).not.toContain(TEST_PENDUDUK_IDS[0]);
  });
});
