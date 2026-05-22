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

- Goal akhir proyek ini adalah **Bades sepenuhnya**, sampai pada titik di mana
  istilah `Twenty` tidak lagi menjadi bagian dari identitas produk, bahasa
  operasional, dokumentasi, sample data, maupun surface publik lainnya.
- Keep engine, permission system, workflows, dashboards, layout, API, AI,
  relations, automation, dan extensibility Twenty tetap utuh.
- Ubah seluruh bahasa produk dari konteks CRM umum menjadi konteks
  pemerintahan desa, layanan warga, administrasi, keuangan desa, dan program
  sosial.
- Bades tetap diposisikan sebagai **produk SaaS swasta** yang modern dan
  terkelola, bukan software engineer-centric dan bukan platform extensibility
  teknis untuk end user.
- Arah produk Bades adalah **produk operasional untuk pengguna non-teknis**.
  Karena target utamanya perangkat desa dan operator administrasi, pengalaman
  akhir tidak boleh bergantung pada konsep developer platform.
- Semua bahasa user-facing, constants, label, empty state, onboarding,
  placeholder, seeded profile, dan preferred field names harus terasa natural
  untuk pengguna balai desa Indonesia.
- Target kualitas bahasa adalah **native Indonesia penuh**: tidak ada campuran
  English yang terasa "produk luar yang diterjemahkan setengah jadi".
- Semua fitur AI, skill, agent prompt, helper text AI, nama asisten, nama
  workflow otomatis, dan output yang terlihat user harus memakai Bahasa
  Indonesia native. Jika istilah teknis perlu tetap Inggris untuk kontrak
  model atau API, istilah itu tidak boleh menjadi bahasa utama yang dilihat
  pengguna.
- Bades **tidak lagi diarahkan sebagai produk multi-language**. Pengalaman
  produk utama harus dikunci ke **Bahasa Indonesia saja** sebagai bahasa
  operasional tunggal.
- Semua surface pemilihan bahasa, locale switcher, pilihan terjemahan,
  fallback locale, dan pengalaman i18n user-facing harus dihapus dari produk
  utama.
- Infrastruktur **i18n**, **multi-language**, dan **Lingui** tidak lagi
  diperlakukan sebagai capability produk yang dipelihara. Jika masih ada di
  codebase, perlakukan itu sebagai debt migrasi yang harus dibersihkan
  bertahap.
- Jadikan **Bades SID Standard Seed** sebagai pengalaman default saat instalasi
  pertama, bukan seed CRM generik.
- **Seed harus diganti total**, bukan sekadar rename. Jangan sisakan default
  seed, demo records, example objects, pipeline, company/contact/opportunity
  sample, atau terminologi seed bawaan Twenty.
- Refactor penuh example data, demo records, dan default objects agar terasa
  seperti sistem operasional desa Indonesia.
- Migrasikan layer pembayaran dan billing dari **Stripe** ke **Midtrans**
  sebagai arah default Bades, agar pengalaman pembayaran, metode bayar,
  settlement, dan notifikasi transaksi lebih selaras dengan konteks Indonesia.
- Target akhir billing publik adalah **Midtrans-first**: checkout, payment
  status, notifikasi pembayaran, konfigurasi merchant, dan dokumentasi
  operasional tidak lagi bergantung pada narasi atau surface Stripe.
- Sistem **application/app extensibility** tidak perlu dihapus dari engine,
  tetapi harus diubah konsep dan arsitekturnya: bukan lagi kapabilitas
  developer-platform untuk end user, melainkan **kapabilitas internal tim
  Bades** untuk membangun, mengelola, dan merilis modul/aplikasi resmi yang
  dibutuhkan produk atau implementasi klien.
- Hapus atau keluarkan dari pengalaman produk utama semua surface ekosistem
  developer seperti API key, webhook, app platform, SDK exposure, GraphQL/REST
  playground, automation builder teknis, dan menu developer lain yang
  mengasumsikan user paham konsep engineering.
- Rebrand codebase harus dibantu **script/audit replacement** untuk menemukan
  dan mengganti semua brand `Twenty` pada copy, asset reference, metadata,
  email template, docs, title, env example, dan sample data.
- Program transformasi Bades bukan sekadar rebrand visual. Ini juga merupakan
  program **clean up surface warisan** dan **refactor arsitektur produk** agar
  codebase tidak lagi berpikir seperti produk Twenty lama pada layer yang
  terlihat user, admin, dan repo publik.
- Fokus delivery aktif Bades **bukan** pada website marketing dan docs publik.
  Keduanya harus dihapus, diarsipkan, atau dikeluarkan dari prioritas utama
  sampai tidak lagi menjadi beban arah produk.
- Fokus implementasi utama harus dipusatkan ke **engine**, **server worker**,
  dan **front aplikasi platform** sebagai inti produk yang benar-benar dipakai
  dan dikembangkan.

## Branding Rollout

- Gunakan `bd.svg` sebagai source of truth logo Bades.
- Buat script atau tooling untuk scan string `Twenty`, `twenty`, nama asset lama,
  dan referensi branding lain agar tidak ada brand lama yang tertinggal.
- Karena Bades dikelola sebagai **private repository** dan produk privat milik
  swasta, tidak ada keharusan untuk mempertahankan **narasi sejarah awal
  Bades/Twenty** pada surface publik, docs utama, metadata repo, release note,
  README, atau onboarding.
- Riwayat asal-usul produk boleh tetap ada hanya pada catatan internal teknis,
  konteks migrasi, atau boundary kompatibilitas yang memang memerlukannya.
- Target rollout bukan sekadar menyamarkan asal-usul produk, tetapi **menghapus
  seluruh istilah `Twenty`** dari pengalaman Bades hingga pengguna tidak lagi
  berinteraksi dengan nama lama itu di produk akhir.
- Cakupan rebrand meliputi UI, docs, emails, website, favicon, manifest,
  metadata SEO, sample workspace, onboarding, dan seed data.
- Jika ada nama teknis internal yang belum aman diubah, pisahkan antara
  **branding publik** dan **identifier internal sementara**, tetapi target akhir
  tetap eliminasi penuh brand lama pada surface user-facing.

## Cleanup Dan Refactor

- Perlakukan **clean up** dan **refactor** sebagai goal inti, bukan pekerjaan
  kosmetik belakangan.
- `Clean up` berarti membereskan surface yang salah arah, termasuk:
  branding lama, istilah CRM generik, narasi self-hosting/open-source,
  settings developer-first, docs yang salah audience, workflow GitHub lama,
  seed/demo legacy, dan wording billing yang masih Stripe-first.
- `Refactor` berarti memetakan ulang arsitektur produk agar capability engine
  tetap ada, tetapi audience, akses, dan surface-nya berubah mengikuti arah
  Bades.
- Prioritas clean up harus dimulai dari surface dengan dampak publik tertinggi:
  repo metadata, `.github`, README, website, docs utama, onboarding, settings,
  email, billing, dan sample data.
- Untuk fase eksekusi saat ini, **website** dan **docs utama** tidak
  diperlakukan sebagai stream produk yang terus dikembangkan. Arah yang
  diinginkan adalah menghapus surface tersebut dari fokus aktif dan
  memindahkan tenaga kerja ke engine, server worker, dan front aplikasi.
- Clean up juga harus mencakup penghapusan surface dan infrastruktur
  **multi-language/i18n/Lingui** yang tidak lagi relevan dengan arah
  single-language Bades.
- Refactor tidak harus selalu berarti rename besar-besaran. Jika rename teknis
  berisiko, dahulukan pemisahan boundary, pengurangan surface, perubahan alur,
  dan reposisi capability.

## Target Refactor Arsitektur

- Bades harus bergerak ke model tiga lapisan:
  1. **Lapisan operator desa** untuk pekerjaan harian yang sederhana dan
     administratif.
  2. **Lapisan admin terkontrol** untuk konfigurasi operasional dan integrasi
     yang memang diperlukan.
  3. **Lapisan internal tim Bades** untuk capability platform, publishing,
     release, app system, dan extensibility engine.
- Capability engine Twenty boleh tetap dipertahankan, tetapi surface-nya harus
  dipetakan ulang agar tidak semua user melihat semua kekuatan platform.
- Fitur yang terlalu platform-centric jangan otomatis dihapus; nilai dulu
  apakah fitur itu:
  - tetap public tapi perlu disederhanakan,
  - dipindah ke admin-only,
  - atau dipindah ke internal-team-only.
- App system, application registry, publishing flow, dan capability sejenis
  harus diarahkan sebagai **platform internal/terkurasi**, bukan marketplace
  terbuka atau builder bebas untuk pengguna akhir.
- Release center, update center, dan capability operasional serupa harus
  diperlakukan sebagai kandidat kuat untuk dipindah dari surface user ke
  workflow internal tim Bades.

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
- Mode bahasa: **single-language only**
- Tidak ada locale alternatif, language switcher, atau strategi fallback
  multi-bahasa pada pengalaman produk utama.

## Non-Technical Product Focus

- Anggap perangkat desa sebagai **pengguna administratif non-teknis**.
- Pertahankan karakter **SaaS** seperti multi-user, dashboard, role, billing,
  dan operasi produk terkelola, selama semua itu tetap mudah dipakai oleh user
  administratif.
- Fitur yang membutuhkan pemahaman engineering, integrasi manual, kredensial
  API, webhook endpoint, token, schema, query language, atau deployment app
  bukan target utama produk akhir Bades.
- Jika kemampuan teknis seperti itu masih ada di codebase untuk alasan warisan
  engine, fitur tersebut harus dihapus dari surface produk atau minimal
  dipisahkan total dari pengalaman pengguna utama.
- Jika sistem aplikasi/extensibility tetap dipertahankan, posisikan itu sebagai
  workflow **internal team**, bukan fitur self-service untuk perangkat desa
  atau pengguna akhir.
- Navigasi, onboarding, settings, dan dokumentasi pengguna tidak boleh
  mendorong pengguna desa masuk ke workflow developer.
- Prinsip utama: **produk harus terasa seperti alat kerja administrasi desa,
  bukan platform untuk developer**.

## Model Distribusi

- Bades diarahkan sebagai **private repository** dan produk terkelola milik
  swasta, bukan distribusi komunitas yang berpusat pada self-hosting.
- **Self-hosting bukan fokus utama produk**. Dokumentasi, onboarding,
  positioning, dan surface operasional harus berasumsi penggunaan layanan
  terkelola, bukan instalasi mandiri oleh pengguna akhir.
- Jika masih ada artefak self-hosting atau open-source distribution dari warisan
  engine, perlakukan itu sebagai debt arah produk, terutama pada docs, website,
  workflow, dan metadata repo.

## Pembayaran Indonesia

- Prioritaskan Midtrans sebagai gateway pembayaran utama untuk Bades.
- Metode pembayaran yang diutamakan harus cocok untuk konteks Indonesia, seperti
  Virtual Account, QRIS, e-wallet, dan metode lokal lain yang tersedia melalui
  Midtrans.
- Billing, checkout, redirect, dan notifikasi pembayaran harus dirancang dengan
  asumsi merchant Indonesia dan transaksi `IDR`.
- Surface publik seperti halaman billing, settings pembayaran, env example,
  workflow docs, dan email terkait pembayaran harus berhenti memakai bahasa
  Stripe-first dan beralih ke Midtrans-first.
- Jika ada flow subscription atau enterprise billing warisan Stripe yang belum
  bisa diganti total sekaligus, perlakukan itu sebagai migrasi bertahap dengan
  target akhir eliminasi surface Stripe pada pengalaman utama Bades.

## Goal Billing Utama

- Goal billing utama Bades adalah **top up credit** dan **billing bulanan**
  berbasis Midtrans.
- Sistem pembayaran boleh mendukung dua pola utama:
  1. **Top up credit** untuk saldo/pemakaian yang dikelola di backend Bades.
  2. **Billing bulanan** untuk paket langganan, tagihan rutin, atau biaya
     berulang yang sesuai model SaaS swasta.
- Midtrans berperan sebagai payment rail untuk charge, checkout, invoice,
  notifikasi, dan settlement.
- Ledger pemakaian, perhitungan credit, status saldo, dan aturan konsumsi harus
  tetap dikelola di backend Bades, bukan dipindahkan ke payment gateway.
- Jika ada fitur metered usage, fitur itu harus dihitung di Bades dulu lalu
  ditagihkan melalui alur Midtrans yang sesuai.

## Goal AI Satu Model

- Goal AI Bades adalah **satu model operasional saja** untuk pengalaman produk
  utama, bukan daftar model yang bisa dipilih user.
- Model default operasional harus mengarah ke `tencent/hy3-preview` via
  OpenRouter sebagai model utama yang dipakai oleh fitur AI, agent, dan
  workflow otomatis.
- User-facing UI **tidak boleh menampilkan pemilihan model**, daftar model,
  dropdown model, label provider, atau pembandingan model apa pun.
- User-facing AI juga **tidak perlu diberitahu** model apa yang dipakai,
  kecuali ada kebutuhan operasional internal yang benar-benar khusus dan tidak
  tampil ke user akhir.
- Jika secara teknis ada routing, fallback, atau konfigurasi provider di
  belakang layar, itu harus dianggap detail implementasi internal tim Bades,
  bukan surface produk.
- Pada sisi produk, AI harus terasa seperti satu kapabilitas yang konsisten:
  satu pengalaman, satu gaya jawaban, satu baseline perilaku.
- Halaman settings, admin panel, atau tooling internal yang masih menyentuh AI
  harus diarahkan untuk operasi tim Bades, bukan untuk memilih model oleh user
  akhir.
- Jika ada sisa arsitektur multi-model warisan Twenty, itu harus dianggap debt
  migrasi dan dibersihkan bertahap sampai user-facing surface benar-benar
  single-model.

## Language Rules

- Prioritaskan istilah Indonesia yang dipahami pegawai balai desa, bukan jargon
  CRM/SaaS.
- Default bahasa proyek adalah **Bahasa Indonesia native**. Ini berlaku untuk
  copy produk, dokumentasi, komentar, test, fixture, seed, contoh data, dan
  penamaan konsep bisnis di codebase.
- Arah akhir lokalisasi Bades adalah **bukan sistem terjemahan multi-bahasa**,
  melainkan **satu bahasa operasional tunggal: Bahasa Indonesia**.
- Semua surface yang terlihat user harus memakai **Bahasa Indonesia yang
  benar-benar natural**, sederhana, formal secukupnya, dan familiar bagi
  operator desa.
- Hindari istilah Inggris keras pada menu, tombol, label, helper text, empty
  state, toast, modal, onboarding, email, dokumen, template, seed, dan sample
  workspace.
- Untuk code, gunakan Bahasa Indonesia pada nama konsep domain, nama test,
  komentar, fixture, seed, dan dokumentasi internal selama tidak berbenturan
  dengan kontrak teknis framework, library, atau protokol.
- Ganti istilah seperti `company`, `people`, `opportunity`, `pipeline`,
  `workspace`, `deal`, atau `task` jika muncul di surface user-facing dengan
  padanan yang sesuai konteks desa.
- Default names, seeded users, seeded institutions, seeded regions, dan sample
  records harus memakai format Indonesia.
- Constants, enum labels, option values, dan seeded config yang tampil ke user
  harus di-review agar sesuai administrasi desa Indonesia.
- Jika istilah teknis internal masih memakai English untuk alasan kompatibilitas
  codebase, istilah itu **tidak boleh bocor** ke pengalaman user.
- Bahasa Inggris hanya boleh dipakai untuk keyword bahasa pemrograman, nama API
  framework/library, kontrak teknis eksternal, atau identifier legacy yang
  memang belum aman diubah.
- Jangan pertahankan katalog terjemahan, locale registry, message extraction,
  compile pipeline terjemahan, atau dependency seperti **Lingui** sebagai
  workflow utama jika hasil akhirnya tetap hanya Bahasa Indonesia.

## Guardrails

- Jangan ubah platform menjadi produk baru; ini tetap **Twenty yang
  di-Indonesia-kan secara total**.
- Namun target jangka akhirnya adalah **nol istilah `Twenty`** pada produk
  final, dokumentasi final, seed final, dan code path yang aman untuk
  dibersihkan. Jika istilah itu masih ada, anggap sebagai sisa migrasi yang
  harus dihabiskan bertahap.
- Untuk layer **seed dan sample data**, jangan pertahankan warisan Twenty sama
  sekali. Semua seed harus native Bades/SID.
- Jangan pertahankan Stripe sebagai asumsi pembayaran utama pada produk final,
  docs final, settings final, atau workflow operasional final jika Midtrans
  sudah dapat menggantikan use case yang sama.
- Jangan pertahankan fitur **multi-language**, **i18n runtime**, **locale
  switcher**, atau dependency/wiring **Lingui** pada produk final jika semuanya
  hanya mempertahankan kompleksitas tanpa kebutuhan bisnis nyata.
- Jangan memposisikan Bades sebagai produk self-hosting-first atau
  open-source-distribution-first pada surface publik, docs utama, workflow
  utama, atau repo metadata utama.
- Jangan mempertahankan cerita “Bades berasal dari Twenty” atau histori
  branding lama sebagai bagian dari narasi utama produk, repo, docs, atau
  onboarding publik.
- Jangan pertahankan menu, halaman, docs, atau settings yang berfokus pada
  API key, webhook, app framework, developer platform, atau extensibility
  teknis sebagai bagian dari produk utama Bades.
- Jika app system masih ada, jangan memposisikannya sebagai marketplace,
  builder, atau platform ekstensi terbuka untuk user akhir; arahkan itu
  sebagai kapabilitas internal tim Bades.
- Jangan memperlakukan clean up sebagai sekadar translasi copy; jika struktur,
  nav, docs, atau boundary produknya salah, perbaiki lewat refactor.
- Jangan jadikan instance surat, tahun, atau RT tertentu sebagai object baru jika
  cukup menjadi record/field.
- Privasi data warga harus mengikuti UU PDP, termasuk masking NIK untuk role
  tertentu.
