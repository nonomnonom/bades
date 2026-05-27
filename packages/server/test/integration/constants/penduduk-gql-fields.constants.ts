// GQL fields untuk object SID `penduduk` di integration test.
// Menggantikan PERSON_GQL_FIELDS yang berasal dari CRM warisan.
//
// Pemetaan semantik penting:
//   person.name (FULL_NAME)    → penduduk.namaLengkap (FULL_NAME)
//   person.city (TEXT)         → penduduk.tempatLahir (TEXT)
//   person.jobTitle (TEXT)     → penduduk.pekerjaan (SELECT)  ⚠ tipe beda
//   person.emails (EMAILS)     → tidak ada padanan composite; pakai email
//                                TEXT atau hapus assertion.
//   person.phones (PHONES)     → tidak ada padanan composite; pakai noHp
//                                TEXT atau hapus assertion.
//   person.company (RELATION)  → penduduk.keluarga (RELATION)
export const PENDUDUK_GQL_FIELDS = `
    id
    nik
    nomorKk
    tempatLahir
    tanggalLahir
    jenisKelamin
    agama
    statusPerkawinan
    pendidikan
    pekerjaan
    kewarganegaraan
    statusHidup
    namaLengkap {
      firstName
      lastName
    }
    createdAt
    deletedAt
`;
