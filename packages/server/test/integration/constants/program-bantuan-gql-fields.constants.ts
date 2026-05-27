// GQL fields untuk object SID `programBantuan` di integration test.
// Menggantikan OPPORTUNITY_GQL_FIELDS yang berasal dari CRM warisan.
//
// Pemetaan semantik:
//   opportunity.name (TEXT)        → programBantuan.namaProgram (TEXT)
//   opportunity.amount (CURRENCY)  → programBantuan.totalAnggaran (NUMBER)
//                                     ⚠ tipe beda — assertion mungkin perlu
//                                     disesuaikan.
//   opportunity.stage (SELECT)     → programBantuan.status (SELECT)
//   opportunity.companyId          → tidak ada relasi langsung;
//                                     penerimaBantuan adalah junction yang
//                                     pas. Untuk test relation generik,
//                                     gunakan penduduk.keluarga.
export const PROGRAM_BANTUAN_GQL_FIELDS = `
    id
    namaProgram
    jenisBantuan
    tahunAnggaran
    sumberDana
    totalAnggaran
    nominalPerPenerima
    kuotaPenerima
    status
    createdAt
    deletedAt
`;
