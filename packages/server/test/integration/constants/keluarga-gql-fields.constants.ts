// GQL fields untuk object SID `keluarga` di integration test.
// Menggantikan COMPANY_GQL_FIELDS yang berasal dari CRM warisan Twenty.
//
// Pemetaan semantik:
//   company.name (TEXT)         → keluarga.nomorKk (TEXT identifier utama)
//   company.domainName (LINKS)  → tidak ada padanan; hapus assertion
//   company.linkedinLink (LINKS) → tidak ada padanan; hapus assertion
//
// Keluarga tidak punya field `name` tunggal. Gunakan `nomorKk` sebagai
// identifier utama, dan `alamat` sebagai field text sekunder yang setara
// dengan field "deskriptif" company.
export const KELUARGA_GQL_FIELDS = `
    id
    nomorKk
    alamat
    createdAt
    deletedAt
`;
