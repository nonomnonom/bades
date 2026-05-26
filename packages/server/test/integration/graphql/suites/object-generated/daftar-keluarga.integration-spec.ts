import request from 'supertest';

const client = request(`http://localhost:${APP_PORT}`);

describe('companiesResolver (e2e)', () => {
  it('should find many daftarKeluarga', () => {
    const queryData = {
      query: `
        query daftarKeluarga {
          daftarKeluarga {
            edges {
              node {
                name
                employees
                idealCustomerProfile
                position
                searchVector
                id
                createdAt
                updatedAt
                deletedAt
                accountOwnerId
                tagline
                workPolicy
                visaSponsorship
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
        const data = res.body.data.daftarKeluarga;

        expect(data).toBeDefined();
        expect(Array.isArray(data.edges)).toBe(true);

        const edges = data.edges;

        if (edges.length > 0) {
          const daftarKeluarga = edges[0].node;

          expect(daftarKeluarga).toHaveProperty('name');
          expect(daftarKeluarga).toHaveProperty('employees');
          expect(daftarKeluarga).toHaveProperty('idealCustomerProfile');
          expect(daftarKeluarga).toHaveProperty('position');
          expect(daftarKeluarga).toHaveProperty('searchVector');
          expect(daftarKeluarga).toHaveProperty('id');
          expect(daftarKeluarga).toHaveProperty('createdAt');
          expect(daftarKeluarga).toHaveProperty('updatedAt');
          expect(daftarKeluarga).toHaveProperty('deletedAt');
          expect(daftarKeluarga).toHaveProperty('accountOwnerId');
          expect(daftarKeluarga).toHaveProperty('tagline');
          expect(daftarKeluarga).toHaveProperty('workPolicy');
          expect(daftarKeluarga).toHaveProperty('visaSponsorship');
        }
      });
  });
});
