import request from 'supertest';

const client = request(`http://localhost:${APP_PORT}`);

describe('peopleResolver (e2e)', () => {
  it('should find many daftarPenduduk', () => {
    const queryData = {
      query: `
        query daftarPenduduk {
          daftarPenduduk {
            edges {
              node {
                jobTitle
                city
                avatarUrl
                avatarFile {
                  fileId
                  label
                  extension
                  url
                }
                position
                searchVector
                id
                createdAt
                updatedAt
                deletedAt
                companyId
                intro
                workPreference
                performanceRating
              }
            }
          }
        }
      `,
    };

    return client
      .post('/graphql')
      .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
      .send(queryData)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeDefined();
        expect(res.body.errors).toBeUndefined();
      })
      .expect((res) => {
        const data = res.body.data.daftarPenduduk;

        expect(data).toBeDefined();
        expect(Array.isArray(data.edges)).toBe(true);

        const edges = data.edges;

        if (edges.length > 0) {
          const daftarPenduduk = edges[0].node;

          expect(daftarPenduduk).toHaveProperty('jobTitle');
          expect(daftarPenduduk).toHaveProperty('city');
          expect(daftarPenduduk).toHaveProperty('avatarUrl');
          expect(daftarPenduduk).toHaveProperty('avatarFile');
          expect(daftarPenduduk).toHaveProperty('position');
          expect(daftarPenduduk).toHaveProperty('searchVector');
          expect(daftarPenduduk).toHaveProperty('id');
          expect(daftarPenduduk).toHaveProperty('createdAt');
          expect(daftarPenduduk).toHaveProperty('updatedAt');
          expect(daftarPenduduk).toHaveProperty('deletedAt');
          expect(daftarPenduduk).toHaveProperty('companyId');
          expect(daftarPenduduk).toHaveProperty('intro');
          expect(daftarPenduduk).toHaveProperty('workPreference');
          expect(daftarPenduduk).toHaveProperty('performanceRating');
        }
      });
  });
});
