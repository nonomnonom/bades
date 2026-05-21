# Bades Goal

## Vision

Rebrand Twenty menjadi **bades.id / Balaidesa** sebagai **SID native Indonesia**
tanpa mengurangi kemampuan inti produk. Targetnya adalah mempertahankan **100%
fitur Twenty**, sambil mengganti branding, istilah CRM, seed data, contoh object,
copy UI, dan default workspace agar relevan untuk pemerintahan desa.

Logo utama Bades adalah `bd.svg` di root repo dan harus menjadi acuan untuk
penggantian logo, favicon, app mark, dan identitas visual utama.

Target user utama adalah **orang yang bekerja di balai desa di Indonesia**:
operator desa, perangkat desa, admin layanan, sekretariat desa, dan pihak
terkait administrasi warga.

## Product Direction

- Keep engine, permission system, workflows, dashboards, layout, API, AI,
  relations, automation, dan extensibility Twenty tetap utuh.
- Ubah seluruh bahasa produk dari konteks CRM umum menjadi konteks
  pemerintahan desa, layanan warga, administrasi, keuangan desa, dan program
  sosial.
- Semua bahasa user-facing, constants, label, empty state, onboarding,
  placeholder, seeded profile, dan preferred field names harus terasa natural
  untuk pengguna balai desa Indonesia.
- Target kualitas bahasa adalah **native Indonesia penuh**: tidak ada campuran
  English yang terasa "produk luar yang diterjemahkan setengah jadi".
- Jadikan **Bades SID Standard Seed** sebagai pengalaman default saat instalasi
  pertama, bukan seed CRM generik.
- **Seed harus diganti total**, bukan sekadar rename. Jangan sisakan default
  seed, demo records, example objects, pipeline, company/contact/opportunity
  sample, atau terminologi seed bawaan Twenty.
- Refactor penuh example data, demo records, dan default objects agar terasa
  seperti sistem operasional desa Indonesia.
- Rebrand codebase harus dibantu **script/audit replacement** untuk menemukan
  dan mengganti semua brand `Twenty` pada copy, asset reference, metadata,
  email template, docs, title, env example, dan sample data.

## Branding Rollout

- Gunakan `bd.svg` sebagai source of truth logo Bades.
- Buat script atau tooling untuk scan string `Twenty`, `twenty`, nama asset lama,
  dan referensi branding lain agar tidak ada brand lama yang tertinggal.
- Cakupan rebrand meliputi UI, docs, emails, website, favicon, manifest,
  metadata SEO, sample workspace, onboarding, dan seed data.
- Jika ada nama teknis internal yang belum aman diubah, pisahkan antara
  **branding publik** dan **identifier internal sementara**, tetapi target akhir
  tetap eliminasi penuh brand lama pada surface user-facing.

## Bades SID Standard Seed

Seed bawaan dibagi ke 6 domain:

1. **Demografi & Wilayah**: Penduduk, Keluarga/KK, Rumah Tangga, Wilayah.
2. **Pemerintahan Desa**: Jabatan, Periode Jabatan, Lembaga Desa.
3. **Pelayanan Surat**: Jenis Surat, Permohonan Layanan, Surat Keluar, Surat Masuk.
4. **Keuangan Desa**: APBDes, Bidang Anggaran, Kegiatan, Realisasi, Sumber Dana.
5. **Program Sosial & Bantuan**: Program Bantuan, Penerima Bantuan, Posyandu.
6. **Aset & Ekonomi**: Aset Desa, Bidang Tanah, UMKM, Kegiatan Desa.

## Data Priorities

`Penduduk` menjadi object fondasi dengan field minimal: nama lengkap, NIK
unik, nomor KK, tempat/tanggal lahir, jenis kelamin, agama, status perkawinan,
pendidikan, pekerjaan, golongan darah, kewarganegaraan, alamat, relasi
RT/RW/Dusun, status hubungan keluarga, tipe warga, status hidup, NIK ayah/ibu,
foto, dan tanggal sinkron Dukcapil.

Relasi kunci:

- Wilayah -> Keluarga -> Penduduk
- Permohonan Layanan -> Penduduk + Jenis Surat
- Surat Keluar -> Permohonan
- Junction penting: Keanggotaan Lembaga, Periode Jabatan, Penerima Bantuan,
  Peserta Kegiatan

## Localization Defaults

- Locale: `id-ID`
- Currency: `IDR`
- Phone country code: `+62`
- Date format: `DD/MM/YYYY`
- Bahasa utama: `Bahasa Indonesia`

## Language Rules

- Prioritaskan istilah Indonesia yang dipahami pegawai balai desa, bukan jargon
  CRM/SaaS.
- Semua surface yang terlihat user harus memakai **Bahasa Indonesia yang
  benar-benar natural**, sederhana, formal secukupnya, dan familiar bagi
  operator desa.
- Hindari istilah Inggris keras pada menu, tombol, label, helper text, empty
  state, toast, modal, onboarding, email, dokumen, template, seed, dan sample
  workspace.
- Ganti istilah seperti `company`, `people`, `opportunity`, `pipeline`,
  `workspace`, `deal`, atau `task` jika muncul di surface user-facing dengan
  padanan yang sesuai konteks desa.
- Default names, seeded users, seeded institutions, seeded regions, dan sample
  records harus memakai format Indonesia.
- Constants, enum labels, option values, dan seeded config yang tampil ke user
  harus di-review agar sesuai administrasi desa Indonesia.
- Jika istilah teknis internal masih memakai English untuk alasan kompatibilitas
  codebase, istilah itu **tidak boleh bocor** ke pengalaman user.

## Guardrails

- Jangan ubah platform menjadi produk baru; ini tetap **Twenty yang
  di-Indonesia-kan secara total**.
- Untuk layer **seed dan sample data**, jangan pertahankan warisan Twenty sama
  sekali. Semua seed harus native Bades/SID.
- Jangan jadikan instance surat, tahun, atau RT tertentu sebagai object baru jika
  cukup menjadi record/field.
- Privasi data warga harus mengikuti UU PDP, termasuk masking NIK untuk role
  tertentu.
