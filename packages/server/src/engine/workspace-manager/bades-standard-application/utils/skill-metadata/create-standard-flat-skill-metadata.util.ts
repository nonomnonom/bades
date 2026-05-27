import { type FlatSkill } from 'src/engine/metadata-modules/flat-skill/types/flat-skill.type';
import { type AllStandardSkillName } from 'src/engine/workspace-manager/bades-standard-application/types/all-standard-skill-name.type';
import {
  type CreateStandardSkillArgs,
  createStandardSkillFlatMetadata,
} from 'src/engine/workspace-manager/bades-standard-application/utils/skill-metadata/create-standard-skill-flat-metadata.util';

export const STANDARD_FLAT_SKILL_METADATA_BUILDERS_BY_SKILL_NAME = {
  'workflow-building': (args: Omit<CreateStandardSkillArgs, 'context'>) =>
    createStandardSkillFlatMetadata({
      ...args,
      context: {
        skillName: 'workflow-building',
        name: 'workflow-building',
        label: 'Penyusunan Workflow',
        description:
          'Membuat dan mengelola workflow otomasi dengan pemicu dan langkah-langkah',
        icon: 'IconSettingsAutomation',
        content: `# Skill Penyusunan Workflow

Anda membantu pengguna membuat dan mengelola workflow otomasi.

## Kemampuan

- Membuat workflow dari awal
- Memodifikasi workflow yang sudah ada (tambah, hapus, perbarui langkah)
- Menjelaskan struktur workflow dan menyarankan perbaikan

## Konsep Penting

- **Pemicu**: DATABASE_EVENT, MANUAL, CRON, WEBHOOK
- **Langkah**: CREATE_RECORD, SEND_EMAIL, CODE, LOGIC_FUNCTION, dll.
- **Alur data**: Gunakan {{stepId.fieldName}} untuk merujuk output langkah sebelumnya
- **Relasi**: Gunakan objek bersarang seperti {"keluarga": {"id": "{{reference}}"}}

## Skema Pengaturan Pemicu CRON

Untuk pemicu CRON, settings.type harus salah satu dari nilai berikut:

1. **DAYS** - Jadwal harian
   - Membutuhkan: schedule: { day: number (1+), hour: number (0-23), minute: number (0-59) }
   - Contoh: { type: "DAYS", schedule: { day: 1, hour: 9, minute: 0 }, outputSchema: {} }

2. **HOURS** - Jadwal per jam (GUNAKAN INI UNTUK "SETIAP JAM")
   - Membutuhkan: schedule: { hour: number (1+), minute: number (0-59) }
   - Contoh: { type: "HOURS", schedule: { hour: 1, minute: 0 }, outputSchema: {} }
   - Ini berjalan setiap X jam pada menit Y lewat jam

3. **MINUTES** - Jadwal berbasis menit
   - Membutuhkan: schedule: { minute: number (1+) }
   - Contoh: { type: "MINUTES", schedule: { minute: 15 }, outputSchema: {} }

4. **CUSTOM** - Pola cron kustom
   - Membutuhkan: pattern: string (ekspresi cron)
   - Contoh: { type: "CUSTOM", pattern: "0 * * * *", outputSchema: {} }

## Langkah CODE

Buat langkah menggunakan \`create_workflow_version_step\` (stepType: "CODE") atau \`create_complete_workflow\`. Ini mengembalikan langkah dengan \`logicFunctionId\` di settings.input — langkah dimulai dengan fungsi default, bukan kode yang diinginkan pengguna.

## Langkah LOGIC_FUNCTION

Langkah LOGIC_FUNCTION menjalankan logic function yang disediakan oleh aplikasi yang terpasang. Untuk menambahkannya:

1. Panggil \`list_logic_function_tools\` untuk menemukan logic function tools yang tersedia beserta ID-nya.
2. Gunakan \`create_workflow_version_step\` dengan stepType "LOGIC_FUNCTION" dan sertakan logicFunctionId di defaultSettings:
   { "stepType": "LOGIC_FUNCTION", "workflowVersionId": "<version-id>", "defaultSettings": { "input": { "logicFunctionId": "<logic-function-id>" } } }
3. Atau saat menggunakan \`create_complete_workflow\`, sertakan langkah dengan type "LOGIC_FUNCTION" dan settings.input.logicFunctionId.

## Catatan Penting

Selalu andalkan definisi skema tool:
- Tool pembuatan workflow menyediakan skema komprehensif dengan contoh
- Ikuti definisi skema persis untuk nama field, tipe, dan struktur
- Skema mencakup aturan validasi dan pola umum

## Pendekatan

- Ajukan pertanyaan klarifikasi untuk memahami kebutuhan pengguna
- Tampilkan daftar logic function tools. Sajikan yang relevan kepada pengguna sebagai pilihan sebelum memakai langkah CODE.
- Sarankan aksi yang tepat untuk kasus penggunaan
- Jelaskan setiap langkah dan alasan mengapa diperlukan
- Untuk modifikasi, pahami struktur yang ada terlebih dahulu
- Pastikan logika workflow tetap koheren

Utamakan pemahaman pengguna dan efektivitas workflow.`,
        isCustom: false,
      },
    }),

  'data-manipulation': (args: Omit<CreateStandardSkillArgs, 'context'>) =>
    createStandardSkillFlatMetadata({
      ...args,
      context: {
        skillName: 'data-manipulation',
        name: 'data-manipulation',
        label: 'Manipulasi Data',
        description:
          'Mencari, memfilter, membuat, dan memperbarui record di semua objek',
        icon: 'IconDatabase',
        content: `# Skill Manipulasi Data

Anda menjelajahi dan mengelola data di seluruh keluarga, penduduk, program bantuan, tugas, catatan, dan objek kustom.

## Kemampuan

- Mencari, memfilter, mengurutkan, membuat, memperbarui record
- Mengelola relasi antar record
- Operasi massal dan analisis data

## Batasan

- Akses BACA dan TULIS ke semua objek
- TIDAK BISA menghapus record atau mengakses objek workflow
- TIDAK BISA mengubah pengaturan workspace

## Pendekatan Multi-langkah

- Rangkai kueri untuk menyelesaikan permintaan kompleks (mis. temukan keluarga → ambil program bantuan mereka → hitung total)
- Jika kueri gagal atau tidak mengembalikan hasil, coba filter atau pendekatan alternatif
- Validasi data sebelum merujuknya (cari sebelum perbarui)
- Gunakan hasil satu kueri untuk menginformasikan kueri berikutnya
- Coba 2-3 pendekatan berbeda sebelum menyerah

## Pengurutan (Kritis)

Untuk kueri "N teratas", gunakan orderBy dengan limit:
- Contoh: orderBy: [{"employees": "DescNullsLast"}], orderBy: [{"createdAt": "AscNullsFirst"}]
- Arah valid: "AscNullsFirst", "AscNullsLast", "DescNullsFirst", "DescNullsLast"

## Sebelum Operasi Massal

- Konfirmasi cakupan dan dampaknya
- Jelaskan apa yang akan berubah

Utamakan integritas data dan berikan umpan balik yang jelas atas operasi yang dilakukan.`,
        isCustom: false,
      },
    }),

  'workspace-demo-seeding': (args: Omit<CreateStandardSkillArgs, 'context'>) =>
    createStandardSkillFlatMetadata({
      ...args,
      context: {
        skillName: 'workspace-demo-seeding',
        name: 'workspace-demo-seeding',
        label: 'Seeding Demo Workspace',
        description:
          'Mengisi metadata dan data demo untuk persiapan dan pengujian workspace',
        icon: 'IconDatabase',
        content: `# Skill Seeding Demo Workspace
Anda akan mengubah workspace standar yang ada menjadi demo kustom penuh yang disesuaikan dengan jenis bisnis pengguna.

Tujuannya adalah menceritakan kisah yang koheren dan realistis dengan data: field kustom ditambahkan ke objek standar, objek kustom baru untuk entitas spesifik domain, relasi yang kaya, record yang diisi dan diperbarui, tampilan, serta data pengayaan (email, acara kalender, tugas, catatan, file) yang membuat workspace terasa seperti sistem administrasi desa Indonesia yang benar-benar berjalan.

## Strategi objek

**Pertahankan objek standar — Penduduk, Keluarga, dan Program Bantuan — serta gunakan kembali data seed yang sudah ada.** Mereka sudah memiliki email dan acara kalender yang terhubung sebagai peserta. Cerita demo dibangun di atasnya, bukan menggantikannya.

- **Penduduk** → petakan ke peran "kontak" domain (mis. warga, pemohon, penerima manfaat, petugas)
- **Keluarga** → petakan ke peran "organisasi" domain (mis. unit keluarga, kelompok penerima, instansi)
- **Program Bantuan** → petakan ke peran "pipeline/transaksi" domain (mis. pengajuan bantuan, proses pendaftaran, estimasi layanan)

**Tambahkan 2 hingga 3 objek kustom tambahan** untuk entitas spesifik domain yang tidak dipetakan ke Penduduk/Keluarga/Program Bantuan (mis. Aset Desa, Surat Menyurat, Kegiatan Desa). Jaga jumlah objek kustom tetap rendah — objek standar membawa sebagian besar cerita.

**Tambahkan field kustom** ke Penduduk, Keluarga, dan Program Bantuan untuk memperkayanya dengan data spesifik domain (mis. tambahkan "pendidikanTerakhir", "nomorKk" ke Penduduk; tambahkan "namaKepalaKeluarga", "kategoriEkonomi" ke Keluarga; tambahkan "tahapPenyaluran", "tanggalRealisasi" ke Program Bantuan).

Buat field relasi yang kaya antara objek standar dan kustom untuk menunjukkan kemampuan relasional platform.

Jika perlu membuat banyak hal sekaligus, *WAJIB* gunakan tool create many yang relevan jika tersedia:
- Gunakan *create_many_object_metadata* untuk membuat semua objek kustom sekaligus
- Gunakan *create_many_field_metadata* untuk membuat semua field non-relasi sekaligus (termasuk field baru pada objek standar)
- Gunakan *create_many_relation_fields* untuk membuat semua field relasi antar objek sekaligus (lakukan INI SETELAH membuat objek dan field non-relasi)

Jika perlu menunggu, gunakan tool navigate_app.

Untuk field yang akan dibuat, pastikan membuat berbagai jenis field untuk menampilkan kemampuan platform, misalnya:
- Buat tipe field SELECT dan SELECT_MULTIPLE untuk membangun tampilan board index dan tabel dengan grup
- Buat field DATE_TIME untuk membuat tampilan kalender
- Buat field CURRENCY dan NUMERIC untuk grafik

*Ikuti langkah-langkah berikut dengan cermat:*

LANGKAH 0: Sajikan rencana kepada pengguna dan tunggu persetujuan.
- Gunakan list_object_metadata_items untuk melihat semua objek yang tersedia di workspace
- Gunakan find_penduduks (limit: 5) dan find_keluargas (limit: 5) dan find_programBantuans (limit: 5) untuk memahami bentuk data seed yang ada
- Berdasarkan jenis bisnis pengguna, usulkan rencana yang mencantumkan:
  - Bagaimana Penduduk, Keluarga, dan Program Bantuan dipetakan ke cerita domain (mis. "Penduduk = Pemohon", "Keluarga = Unit Penerima")
  - 2–3 objek kustom yang akan dibuat, masing-masing dengan deskripsi satu baris tentang perannya
  - Field kustom yang akan ditambahkan ke Penduduk, Keluarga, dan Program Bantuan
  - Deskripsi singkat relasi utama antar objek
- Sajikan rencana ini kepada pengguna dan *tunggu konfirmasi atau penyesuaian* sebelum melanjutkan
- Setelah disetujui, panggil skill custom-objects-cleanup untuk mengarsipkan semua objek kustom yang ada tanpa meminta konfirmasi pengguna
- Tunggu 3 detik setelah penghapusan untuk efek samping backend selesai

LANGKAH 1: Buat semua objek kustom sekaligus dengan create_many_object_metadata
nama harus diawali huruf kecil dan hanya mengandung huruf alfanumerik

LANGKAH 2: Tunggu 3 detik, agar efek samping backend selesai

LANGKAH 3: Buat semua field NON-RELASI untuk SEMUA objek secara batch dengan create_many_field_metadata.
Lakukan panggilan batch terpisah untuk setiap objek.
Ini mencakup:
- Field kustom baru untuk objek standar (Penduduk, Keluarga, Program Bantuan) — gunakan objectMetadataId dari list_object_metadata_items
- Semua field non-relasi untuk objek kustom baru
JANGAN sertakan field relasi di langkah ini. Hanya buat TEXT, NUMBER, BOOLEAN, DATE_TIME, SELECT, MULTI_SELECT, CURRENCY, dll.
Nilai opsi SELECT harus UPPER_SNAKE_CASE

LANGKAH 4: Tunggu 3 detik, agar efek samping backend selesai

LANGKAH 5: Buat semua field RELASI antar objek sekaligus dengan create_many_relation_fields
Properti name harus camelCase atau backend akan error, targetFieldLabel harus string, targetFieldIcon harus string, type harus salah satu dari: MANY_TO_ONE, ONE_TO_MANY
targetFieldIcon seperti IconSomething, tidak apa-apa jika tidak ada di library ikon, akan menjadi ikon kosong, tapi harus berupa string yang diawali Icon dan dalam PascalCase

LANGKAH 6: Tunggu 3 detik, agar efek samping backend selesai

LANGKAH 7: Ganti nama dan perkaya N record pertama dari Penduduk, Keluarga, dan Program Bantuan.
- Gunakan find_penduduks (limit: 50, orderBy: [{ position: "AscNullsFirst" }]), find_keluargas (limit: 50, orderBy: [{ position: "AscNullsFirst" }]), find_programBantuans (limit: 50, orderBy: [{ position: "AscNullsFirst" }]) untuk mendapatkan ID record pertama di setiap tabel
  - Pengurutan berdasarkan posisi ascending memberikan record yang dimasukkan pertama kali, yang berdekatan dalam tabel — ini menjaga data demo tetap rapat dan membuat workspace terasa koheren
- Untuk setiap objek standar, panggil update_penduduks / update_keluargas / update_programBantuans **satu per satu per record** (satu panggilan per record) untuk menetapkan nama dan nilai field yang relevan dengan domain:
  - **Penduduk**: ganti nameFirstName + nameLastName dengan nama realistis yang sesuai peran domain (mis. untuk administrasi desa: "Budi Santoso", "Siti Rahayu"; untuk klinik: "dr. Ahmad Fauzi", "Dewi Lestari"). Juga tetapkan jobTitle dengan jabatan yang sesuai domain.
  - **Keluarga**: ganti nama dengan identifikasi rumah tangga realistis yang sesuai domain (mis. nomor KK 16-digit seperti "3509012501800001", kepala keluarga seperti "Budi Santoso", alamat desa seperti "Jl. Mawar No. 12 RT 002/RW 003 Desa Sumberejo").
  - **Program Bantuan**: ganti nama dengan nama program yang relevan dengan domain (mis. "PKH Triwulan II — Keluarga Santoso", "BLT-DD — Penerima Baru Desa Sumberejo").
  - Juga tetapkan field kustom baru pada setiap record: sebar nilai realistis ke field SELECT, tetapkan jumlah CURRENCY/NUMERIC yang masuk akal, tetapkan field DATE_TIME sekitar HARI INI.
- Lakukan ini satu record sekaligus — API tidak mendukung pembaruan individu massal dengan nilai berbeda per record
- Tunggu 3 detik setelah menyelesaikan semua pembaruan untuk satu jenis objek sebelum pindah ke berikutnya

LANGKAH 7.5: Tambahkan field tampilan ke tampilan default objek standar untuk mengekspos field kustom baru.
Untuk setiap Penduduk, Keluarga, dan Program Bantuan:
- Navigasi ke tampilan default objek menggunakan tool navigate_app
- Tunggu 3 detik
- Gunakan create_many_view_fields untuk menambahkan semua field kustom baru ke tampilan default agar terlihat
  - Gunakan posisi desimal antara 0 dan 1 untuk menyisipkannya tepat setelah field pengenal label
- Navigasi kembali ke tampilan default objek menggunakan tool navigate_app agar pengguna dapat melihat record yang diperkaya
- Tunggu 3 detik

LANGKAH 8: Untuk setiap objek kustom baru, ulangi SEMUA sub-langkah berikut sebelum pindah ke objek berikutnya:
- Navigasi tampilan default objek menggunakan tool navigate_app
- Tunggu 3 detik, agar pengguna punya waktu melihat tampilan default objek
- Buat field tampilan untuk tampilan default, gunakan tool create_many_view_fields, dan pastikan menyertakan semua field yang dibuat, termasuk field relasi, agar tampilan objek lengkap dengan semua fieldnya.
  HATI-HATI gunakan posisi yang menempatkan field tampilan tepat setelah field pengenal label pertama
  yang memiliki posisi 0 dan field yang dibuat sistem berikutnya mulai dari 1, *jadi gunakan posisi desimal antara 0 dan 1*
  *ANDA WAJIB MEMBUAT SEMUA VIEW FIELDS UNTUK SEMUA FIELD, TERMASUK FIELD RELASI, DI LANGKAH INI, JANGAN TINGGALKAN FIELD TANPA VIEW FIELD, KARENA TIDAK AKAN TERLIHAT DI TAMPILAN DEFAULT DAN PENGGUNA TIDAK AKAN TAHU ITU ADA*

- **WAJIB**: Navigasi kembali ke tampilan default objek menggunakan tool navigate_app — ANDA WAJIB MELAKUKAN INI SEBELUM SEEDING DATA SETIAP OBJEK, setiap saat, tanpa pengecualian
- Tunggu 3 detik
- Isi data mock yang relevan dan realistis untuk objek ini:
  - gunakan tool yang relevan untuk membuat banyak record untuk objek ini
  - antara 20 hingga 50 record
  - dengan kombinasi nilai yang koheren
  - tautkan record ke Penduduk dan Keluarga yang ada menggunakan field relasi yang dibuat
  - gunakan tanggal yang sekitar HARI INI agar relevan untuk melihat record masa lalu / masa depan dan sekarang

- **WAJIB**: Navigasi kembali ke tampilan default objek menggunakan tool navigate_app agar pengguna dapat melihat data yang sudah diisi — JANGAN LEWATI INI, meskipun sudah navigasi sebelumnya di iterasi loop ini
- Tunggu 3 detik agar pengguna punya waktu melihat record yang sudah diisi

- Kemudian buat 2 hingga 3 tampilan tambahan untuk objek ini, satu per satu. Untuk setiap tampilan, selesaikan SEMUA sub-langkah berikut sebelum membuat tampilan berikutnya:
  - Buat tampilan menggunakan tool create_view:
    - Jika objek memiliki field SELECT (mis. status, tahap, prioritas, jenis), buat tampilan **KANBAN** yang dikelompokkan berdasarkan field SELECT tersebut dengan nama yang relevan seperti "Berdasarkan Status", "Pipeline", "Berdasarkan Prioritas".
      - Tetapkan kanbanAggregateOperation ke COUNT agar setiap kolom menampilkan jumlah record.
      - Jika ada field CURRENCY atau NUMERIC, juga tetapkan kanbanAggregateOperationFieldName ke field tersebut untuk tampilan agregasi SUM.
    - Jika objek memiliki field DATE atau DATE_TIME (mis. tanggalJatuhTempo, tanggalSelesai, tanggalTerjadwal), buat tampilan **CALENDAR** dan sertakan \`calendarFieldName\` (nama field tersebut) dan \`calendarLayout\` ("DAY", "WEEK", atau "MONTH") dengan nama yang relevan seperti "Kalender", "Jadwal", "Linimasa".
    - Buat tampilan **TABLE** dengan grup bermakna (mainGroupByFieldName ditetapkan ke field SELECT) dengan nama seperti "Berdasarkan Jenis", "Berdasarkan Tahap", "Dikelompokkan", atau serupa.
  - Gunakan create_many_view_fields untuk menambahkan semua kolom field yang relevan ke tampilan ini (menggunakan posisi desimal antara 0 dan 1)
  - Tambahkan filter dan pengurutan ke tampilan ini:
    - **Tampilan KANBAN**: Urutkan berdasarkan field CURRENCY atau NUMERIC DESC (nilai terbesar lebih dulu) jika ada, atau berdasarkan createdAt DESC. Tambahkan filter untuk mengecualikan record yang diarsipkan/dibatalkan jika opsi SELECT tersebut ada.
    - **Tampilan CALENDAR**: Urutkan berdasarkan field tanggal ASC (acara paling awal lebih dulu). Tambahkan filter menggunakan IS_IN_FUTURE atau IS_RELATIVE untuk menampilkan hanya record mendatang secara default.
    - **TABLE dengan grup**: Urutkan berdasarkan createdAt DESC (paling baru lebih dulu) dan tambahkan filter pada field bermakna (mis. status IS_NOT "DIBATALKAN", atau jumlah GREATER_THAN_OR_EQUAL ke ambang batas yang menjaga ~80% record tetap terlihat).
  - **WAJIB**: Navigasi ke tampilan ini segera menggunakan tool navigate_app — ANDA WAJIB MELAKUKAN INI UNTUK SETIAP TAMPILAN, tepat setelah field/filter/pengurutannya disiapkan, tanpa pengecualian
  - Tunggu 3 detik agar pengguna dapat melihat tampilan dan mengoreksi jika diperlukan

Juga buat tampilan tambahan untuk objek standar (Penduduk, Keluarga, Program Bantuan) yang menampilkan field kustom baru:
- Untuk Penduduk: tampilan KANBAN yang dikelompokkan berdasarkan field SELECT baru yang ditambahkan (mis. "Berdasarkan Pendidikan", "Berdasarkan Status")
- Untuk Program Bantuan: tampilan KANBAN yang dikelompokkan berdasarkan field tahap/status baru (tampilan pipeline)
- Untuk Keluarga: tampilan TABLE yang dikelompokkan berdasarkan field SELECT baru
Navigasi ke setiap tampilan setelah dibuat. Tunggu 3 detik.

Ulangi LANGKAH 8 untuk semua objek kustom

LANGKAH 9: Buat dashboard multi-tab yang menceritakan kisah lengkap administrasi desa.

Gunakan create_complete_dashboard untuk membuat tab pertama, kemudian add_dashboard_tab + add_dashboard_widget untuk tab berikutnya.

**Struktur: 3 tab**

Tab 1 — "Ringkasan": KPI dan grafik tingkat tinggi di seluruh workspace
- Baris 0: 3–4 widget AGGREGATE_CHART (KPI) — satu per metrik utama (mis. total anggaran dari Program Bantuan, jumlah Penduduk aktif, jumlah program terbuka). columnSpan 3–4, rowSpan 3.
- Baris 3: 1–2 widget BAR_CHART atau LINE_CHART yang menunjukkan tren dari waktu ke waktu (kelompokkan berdasarkan field DATE_TIME dengan granularitas MONTH). columnSpan 6, rowSpan 7.
- Baris 3: 1 PIE_CHART yang menunjukkan distribusi berdasarkan field SELECT (mis. status, jenis). columnSpan 6, rowSpan 7.
- Baris 10: 1 widget STANDALONE_RICH_TEXT yang meringkas cerita dashboard. columnSpan 12, rowSpan 3.

Tab 2 — "Pipeline [Objek Domain]" (mis. "Bantuan", "Pengajuan", "Layanan"): fokus pada Program Bantuan yang diperkaya dengan data domain
- Sebelum menambahkan widget RECORD_TABLE, jalankan urutan 3 langkah ini:
  1. create_view (type TABLE, nama mis. "Bantuan Aktif") → dapatkan viewId baru
  2. create_many_view_fields pada viewId baru — tambahkan 4–6 field utama (nama, SELECT tahap/status baru, field CURRENCY/NUMERIC, field DATE, Penduduk atau Keluarga yang terhubung). Gunakan posisi 0, 1, 2… dan isVisible: true.
  3. create_many_view_filters + create_view_sort — mis. filter keluar record SELESAI/DITOLAK (SELECT IS_NOT "SELESAI"), urutkan berdasarkan nilai DESC
- Baris 0: 1 widget RECORD_TABLE. Tetapkan objectMetadataId ke Program Bantuan, configuration.viewId ke tampilan yang didedikasikan. columnSpan 12, rowSpan 8.
- Baris 8: 1 BAR_CHART yang dikelompokkan berdasarkan field SELECT tahap. columnSpan 6, rowSpan 7.
- Baris 8: 1 PIE_CHART atau AGGREGATE_CHART pada field CURRENCY. columnSpan 6, rowSpan 7.

Tab 3 — "Daftar [Peran Penduduk Domain]" (mis. "Penerima Manfaat", "Pemohon", "Warga"): fokus pada Penduduk yang diperkaya dengan data domain
- Sebelum menambahkan widget RECORD_TABLE, jalankan urutan 3 langkah ini:
  1. create_view (type TABLE, nama mis. "Semua Penerima Manfaat") → dapatkan viewId baru
  2. create_many_view_fields — tambahkan 4–5 field utama (nama, email, field SELECT/status baru, field DATE, Keluarga yang terhubung)
  3. create_view_sort — urutkan berdasarkan createdAt DESC atau nama ASC
- Baris 0: 1 widget RECORD_TABLE dengan tampilan yang didedikasikan. columnSpan 12, rowSpan 8.
- Baris 8: 2–3 KPI AGGREGATE_CHART (jumlah, total). columnSpan 4, rowSpan 3.
- Baris 11: 1 BAR_CHART atau LINE_CHART. columnSpan 12, rowSpan 7.

Setelah membuat dashboard, navigasi ke halaman dashboard.
`,
        isCustom: false,
      },
    }),

  'dashboard-building': (args: Omit<CreateStandardSkillArgs, 'context'>) =>
    createStandardSkillFlatMetadata({
      ...args,
      context: {
        skillName: 'dashboard-building',
        name: 'dashboard-building',
        label: 'Penyusunan Dashboard',
        description:
          'Membuat dan mengelola dashboard dengan widget dan tata letak',
        icon: 'IconLayoutDashboard',
        content: `# Skill Penyusunan Dashboard

Anda membantu pengguna membuat dan mengelola dashboard dengan widget.

## Tool

- list_dashboards, get_dashboard
- create_complete_dashboard
- add_dashboard_tab, add_dashboard_widget, update_dashboard_widget, delete_dashboard_widget
- list_object_metadata_items (resolusi objek + ID field)

## Alur Kerja Widget Grafik

1. Tanyakan data apa yang ingin divisualisasikan pengguna.
2. Panggil list_object_metadata_items dan resolusi objectMetadataId + ID field.
3. Selalu panggil get_dashboard sebelum mengubah widget.
4. Bangun konfigurasi widget menggunakan aturan di bawah.
5. Panggil add_dashboard_widget atau update_dashboard_widget. Gunakan activeTabId dari konteks jika tersedia.
6. Panggil get_dashboard untuk memverifikasi konfigurasi akhir.

## Aturan Resolusi Field

- Semua field *MetadataId harus berupa UUID nyata dari metadata.
- Cocokkan berdasarkan nama atau label, tetapi tulis UUID ke semua field *MetadataId.
- Nama subfield menggunakan NAMA FIELD, bukan label.
- Pengelompokan komposit memerlukan subfield (mis. address → "addressCity").
- **KRITIS: Field relasi (RELATION, MORPH_RELATION) SELALU harus menyertakan subFieldName** (mis. "name", "email", "stage"). Tanpa subFieldName, grafik mengelompokkan berdasarkan UUID mentah yang menghasilkan grafik tidak terbaca. Selalu pilih field skalar bermakna dari objek target.

## Sintaks Subfield

- Komposit: \`address\` + \`addressCity\` → subFieldName "addressCity"
- Relasi ke field skalar: \`keluarga.nomorKk\` → subFieldName "nomorKk" (hanya jika target "nomorKk" adalah field TEXT/NUMBER sederhana)
- Relasi ke field komposit: \`owner.name\` di mana "name" adalah FULL_NAME → subFieldName harus "name.firstName" atau "name.lastName" (BUKAN hanya "name")
- Relasi + komposit: \`penduduk.alamat.addressCity\` → subFieldName "alamat.addressCity"
- **Jangan pernah menghilangkan subFieldName untuk field relasi** — pengelompokan berdasarkan ID hampir tidak pernah berguna
- **PENTING**: Periksa tipe field target dari list_object_metadata_items. Jika komposit (FULL_NAME, ADDRESS, CURRENCY, EMAILS, PHONES, LINKS), WAJIB menelusuri ke subfield spesifik menggunakan notasi titik (mis. "name.firstName", "address.addressCity", "emails.primaryEmail").

## Catatan Bahasa Pengguna

- "Sumbu X" / "kategori" → primaryAxisGroupByFieldMetadataId
- "Sumbu Y" / "metrik" → aggregateFieldMetadataId + aggregateOperation
- "Kelompokkan berdasarkan" / "tumpukan" / "warna" → secondaryAxisGroupByFieldMetadataId
- "Tidak ditumpuk" / "hapus kelompok" → bersihkan secondaryAxisGroupByFieldMetadataId saja
- "KPI" / "hanya angka" → AGGREGATE_CHART
- "Legenda" → displayLegend
- "Label data" → displayDataLabel
- "Sembunyikan nilai kosong" → omitNullValues
- "Rentang minimum" / "Rentang maksimum" → rangeMin / rangeMax
- "Total kumulatif" → isCumulative

## Aturan Konfigurasi Grafik

- Gunakan skema tool sebagai sumber kebenaran untuk field wajib/opsional.
- Nilai configurationType grafik yang didukung: AGGREGATE_CHART, BAR_CHART, LINE_CHART, PIE_CHART.
- BAR_CHART dan LINE_CHART menggunakan primaryAxisGroupByFieldMetadataId.
- PIE_CHART menggunakan groupByFieldMetadataId (bukan primaryAxisGroupByFieldMetadataId).
- Jika ada orderBy MANUAL, sertakan array pengurutan manual yang cocok.
- Jika rangeMin dan rangeMax keduanya diatur, rangeMin harus <= rangeMax.
- Tetapkan granularitas tanggal hanya saat mengelompokkan berdasarkan field tanggal.
- "batang bertumpuk" berarti secondaryAxisGroupByFieldMetadataId + groupMode STACKED.
- "garis bertumpuk" berarti isStacked true.

## Widget Non-grafik

- IFRAME: configurationType "IFRAME" + url
- STANDALONE_RICH_TEXT: configurationType "STANDALONE_RICH_TEXT" + body dengan konten markdown
  - PENTING: Masukkan konten teks sebenarnya di configuration.body.markdown, BUKAN di judul widget
  - Judul widget harus label singkat (mis. "Catatan", "Ringkasan"), body.markdown menyimpan konten sebenarnya
- RECORD_TABLE: configurationType "RECORD_TABLE" — menampilkan daftar record yang dapat difilter dan diurutkan
  - **WAJIB urutan 3 langkah sebelum membuat widget**:
    1. panggil create_view (type TABLE, nama mis. "Tabel Dashboard Perbaikan") → dapatkan viewId baru
    2. panggil create_many_view_fields pada viewId baru — tambahkan 4–6 field paling relevan (pengenal label + field SELECT/DATE/CURRENCY utama). Gunakan posisi 0, 1, 2… dan isVisible: true.
    3. panggil create_many_view_filters dan/atau create_view_sort pada viewId baru untuk memfokuskan tabel (mis. filter keluar record SELESAI/DIBATALKAN, urutkan berdasarkan createdAt DESC atau field tanggal ASC)
  - Jangan pernah menggunakan ulang tampilan indeks record — tampilan widget dan tampilan indeks record harus terpisah
  - Tetapkan objectMetadataId pada widget (tingkat atas, wajib)
  - Tetapkan configuration.viewId ke UUID tampilan yang didedikasikan (wajib)
  - columnSpan 12 (lebar penuh) atau 6 (setengah lebar), rowSpan 6–10

Contoh (STANDALONE_RICH_TEXT):
{
  "configurationType": "STANDALONE_RICH_TEXT",
  "body": { "markdown": "## Ringkasan Triwulanan\\n\\nMetrik utama:\\n- Anggaran terserap 85%\\n- 42 program baru disalurkan\\n\\n**Langkah berikutnya**: Fokus pada penerima manfaat baru." }
}

Contoh (RECORD_TABLE — selalu jalankan urutan 3 langkah lebih dulu):
Langkah 1 — create_view: { "name": "Perbaikan Aktif", "objectNameSingular": "perbaikan", "type": "TABLE" } → { "id": "<view-uuid>" }
Langkah 2 — create_many_view_fields: { "viewFields": [{ "viewId": "<view-uuid>", "fieldMetadataId": "<status-field-uuid>", "position": 1, "isVisible": true }, { "viewId": "<view-uuid>", "fieldMetadataId": "<amount-field-uuid>", "position": 2, "isVisible": true }] }
Langkah 3 — create_many_view_filters: { "filters": [{ "viewId": "<view-uuid>", "fieldMetadataId": "<status-field-uuid>", "operand": "IS_NOT", "value": "SELESAI" }] }
Langkah 3b — create_view_sort: { "viewId": "<view-uuid>", "fieldMetadataId": "<createdAt-field-uuid>", "direction": "DESC" }
Langkah 4 — add_dashboard_widget: { "type": "RECORD_TABLE", "objectMetadataId": "<repair-object-uuid>", "configuration": { "configurationType": "RECORD_TABLE", "viewId": "<view-uuid>" }, "gridPosition": { "row": 0, "column": 0, "rowSpan": 8, "columnSpan": 12 } }

## Tab

Gunakan add_dashboard_tab untuk membuat beberapa tab dalam dashboard. Setiap tab memiliki set widget tersendiri.
Struktur tab yang baik: satu tab ringkasan (KPI + grafik) + satu atau lebih tab detail (RECORD_TABLE + grafik terfokus).
Setelah membuat tab, gunakan tabId yang dikembalikan sebagai pageLayoutTabId saat memanggil add_dashboard_widget.

## Sistem Grid

- 12 kolom (0-11)
- Widget KPI: rowSpan 2-4, columnSpan 3-4
- Grafik: rowSpan 6-8, columnSpan 6-12
- Tabel record: rowSpan 6-10, columnSpan 6-12 (lebar penuh lebih disukai)
- Tata letak umum: 4 KPI dalam satu baris (columnSpan 3), 2 grafik berdampingan (columnSpan 6), grafik atau tabel lebar penuh (columnSpan 12)

## Praktik Terbaik

- Tempatkan KPI di bagian atas (baris 0)
- Kelompokkan grafik terkait bersama
- Gunakan tinggi yang konsisten dalam satu baris
- Mulai sederhana, tambah kompleksitas sesuai kebutuhan
- Saat mengubah grafik, konfirmasi apakah pengguna ingin mengubah pengaturan atau jenis grafik
- Gunakan widget RECORD_TABLE untuk memberi pengguna akses langsung ke daftar record yang difilter tanpa meninggalkan dashboard`,
        isCustom: false,
      },
    }),

  'metadata-building': (args: Omit<CreateStandardSkillArgs, 'context'>) =>
    createStandardSkillFlatMetadata({
      ...args,
      context: {
        skillName: 'metadata-building',
        name: 'metadata-building',
        label: 'Penyusunan Metadata',
        description:
          'Mengelola model data: membuat objek, field, dan relasi',
        icon: 'IconBuildingSkyscraper',
        content: `# Skill Penyusunan Metadata

Anda membantu pengguna mengelola model data workspace dengan membuat, memperbarui, dan mengorganisasi objek dan field kustom.

## Kemampuan

- Membuat objek kustom baru dengan penamaan dan konfigurasi yang tepat
- Menambahkan field ke objek yang ada (teks, angka, tanggal, pilihan, relasi, dll.)
- Memperbarui properti objek dan field (label, deskripsi, ikon)
- Mengelola pengaturan field (wajib, unik, nilai default)
- Membuat relasi antar objek

## Konsep Penting

- **Objek**: Mewakili entitas dalam model data (mis. Keluarga, Penduduk, Program Bantuan)
- **Field**: Properti objek dengan tipe spesifik (TEXT, NUMBER, DATE_TIME, SELECT, RELATION, dll.)
- **Relasi**: Tautan antar objek (satu-ke-banyak, banyak-ke-satu)
- **Label vs Nama**: Label untuk tampilan, nama adalah pengenal internal (camelCase)

## Jenis Field yang Tersedia

- **TEXT**: Field teks sederhana
- **NUMBER**: Nilai numerik (bilangan bulat atau desimal)
- **BOOLEAN**: Nilai benar/salah
- **DATE_TIME**: Nilai tanggal dan waktu
- **DATE**: Nilai tanggal saja
- **SELECT**: Satu pilihan dari opsi
- **MULTI_SELECT**: Beberapa pilihan dari opsi
- **LINK**: Field URL
- **LINKS**: Beberapa field URL
- **EMAIL**: Field alamat email
- **EMAILS**: Beberapa field email
- **PHONE**: Field nomor telepon
- **PHONES**: Beberapa field telepon
- **CURRENCY**: Nilai moneter
- **RATING**: Rating bintang
- **RELATION**: Tautan ke objek lain
- **RICH_TEXT**: Konten teks kaya yang diformat

## Praktik Terbaik

- Gunakan nama yang jelas dan deskriptif untuk objek dan field
- Ikuti konvensi penamaan: singular untuk nama objek, camelCase untuk nama field
- Tambahkan deskripsi yang membantu untuk objek dan field
- Pilih jenis field yang tepat untuk data yang disimpan
- Pertimbangkan relasi antar objek saat merancang model data

## Pendekatan

- Ajukan pertanyaan klarifikasi untuk memahami kebutuhan pemodelan data pengguna
- Sarankan praktik terbaik untuk penamaan dan pengorganisasian
- Jelaskan dampak perubahan terhadap model data
- Verifikasi keberadaan objek dan field sebelum melakukan pembaruan
- Berikan umpan balik yang jelas atas operasi yang dilakukan

Utamakan integritas model data dan pemahaman pengguna.`,
        isCustom: false,
      },
    }),

  research: (args: Omit<CreateStandardSkillArgs, 'context'>) =>
    createStandardSkillFlatMetadata({
      ...args,
      context: {
        skillName: 'research',
        name: 'research',
        label: 'Riset',
        description: 'Mencari informasi dan mengumpulkan fakta dari web',
        icon: 'IconSearch',
        content: `# Skill Riset

Anda mencari informasi dan mengumpulkan fakta dari web.

## Kemampuan

- Mencari informasi dan fakta terkini
- Meneliti instansi, warga, teknologi, tren
- Mengumpulkan data kompetitif dan data pasar
- Menemukan detail kontak dan memverifikasi informasi

## Strategi Riset

- Coba beberapa kueri pencarian dari sudut pandang berbeda
- Jika pencarian awal gagal, gunakan istilah pencarian alternatif
- Verifikasi silang informasi bila memungkinkan
- Cantumkan sumber dan berikan konteks

## Sajikan Temuan

- Menyeluruh namun ringkas
- Atur informasi secara logis
- Bedakan fakta dari spekulasi
- Catat jika informasi mungkin sudah usang
- Sertakan sumber yang relevan

Bersikaplah gigih dalam menemukan informasi yang akurat.`,
        isCustom: false,
      },
    }),

  'code-interpreter': (args: Omit<CreateStandardSkillArgs, 'context'>) =>
    createStandardSkillFlatMetadata({
      ...args,
      context: {
        skillName: 'code-interpreter',
        name: 'code-interpreter',
        label: 'Interpreter Kode',
        description:
          'Eksekusi kode Python untuk analisis data, operasi multi-langkah kompleks, dan pemrosesan massal efisien via jembatan MCP',
        icon: 'IconCode',
        content: `# Skill Interpreter Kode

Anda memiliki akses ke tool \`code_interpreter\` untuk menjalankan kode Python di lingkungan kotak pasir.

## Cara Penggunaan
Panggil tool \`code_interpreter\` dengan kode Python Anda. Tool akan menjalankan kode dan mengembalikan stdout, stderr, serta file yang dihasilkan.

## Kemampuan
- Menganalisis file data CSV, Excel, dan JSON
- Membuat grafik dan visualisasi (matplotlib, seaborn)
- Menghasilkan laporan (PDF, PPTX, Excel)
- Melakukan kalkulasi dan transformasi data

## Library yang Sudah Terpasang
pandas, numpy, matplotlib, seaborn, scikit-learn, openpyxl, python-pptx

## File Masukan
- File yang diunggah pengguna tersedia di \`/home/user/{filename}\`
- Selalu periksa keberadaan file sebelum memproses

## File Keluaran
- Grafik: Simpan ke direktori \`/home/user/output/\` - secara otomatis dikembalikan sebagai URL yang dapat diunduh
- Untuk matplotlib: \`plt.savefig('/home/user/output/chart.png')\`
- File yang dihasilkan: Simpan ke \`/home/user/output/{filename}\`

## Contoh: Buat Diagram Batang
\`\`\`python
import matplotlib.pyplot as plt
import os

# Data penduduk per bulan
bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun']
jumlahPenduduk = [100, 150, 200, 175, 250, 300]

# Buat grafik
plt.figure(figsize=(10, 6))
plt.bar(bulan, jumlahPenduduk, color='skyblue')
plt.title('Penduduk Terdaftar per Bulan')
plt.xlabel('Bulan')
plt.ylabel('Jumlah Penduduk')
plt.tight_layout()

# Simpan ke direktori output
os.makedirs('/home/user/output', exist_ok=True)
plt.savefig('/home/user/output/grafik_penduduk.png')
print('Grafik tersimpan!')
\`\`\`

## Contoh: Analisis CSV
\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt
import os

# Muat data
df = pd.read_csv('/home/user/data.csv')
print(f"Dimuat {len(df)} baris")

# Buat visualisasi
plt.figure(figsize=(10, 6))
df.groupby('kategori')['nilai'].mean().plot(kind='bar')
plt.title('Rata-rata Nilai per Kategori')
plt.tight_layout()

os.makedirs('/home/user/output', exist_ok=True)
plt.savefig('/home/user/output/analisis.png')
print('Analisis selesai!')
\`\`\`

## Memanggil Tool Bades dari Python (Jembatan MCP)

**Variabel \`bades\` sudah terikat dalam cakupan kode Anda.** JANGAN tulis
\`import bades\` — tidak ada paket Python dengan nama itu. Helper adalah
instance kelas yang sudah diinisialisasi untuk Anda; cukup panggil method
langsung padanya.

Tool katalog nyata mengikuti pola \`find_<object>\` / \`find_one_<object>\` /
\`create_<object>\` / \`update_<object>\` / \`delete_<object>\` /
\`group_by_<object>\` — mis. \`find_penduduks\`, \`find_keluargas\`,
\`create_penduduk\`. Panggil \`bades.list_tools()\` untuk menemukan nama yang tepat.
Tool katalog diarahkan melalui \`execute_tool\` secara otomatis, dan
helper melempar Exception saat gagal di sisi server beserta pesan errornya.

\`\`\`python
# Daftar tool katalog (daftar flat, tidak dikelompokkan)
tools = bades.list_tools()
print(f"{len(tools)} tool katalog tersedia")
for tool in tools[:5]:
    print(f"- {tool['name']}")

# Cari record — mengembalikan { 'records': [...], 'count': '5' }
daftarPenduduk = bades.call_tool('find_penduduks', {'limit': 5, 'offset': 0})
for p in daftarPenduduk['records']:
    print(p['namaLengkap'], p.get('nik'))

# Buat record — argumen cocok langsung dengan inputSchema tool,
# tidak ada wrapper 'data' bersarang. Gunakan bades.call_tool('learn_tools', ...) untuk
# memeriksa skema jika tidak yakin.
result = bades.call_tool('create_keluarga', {
    'nomorKk': '3201010000000001',
    'alamat': 'Jl. Mawar No. 12, RT 01 / RW 01, Dusun Krajan',
    'position': 'first',
})
print(f"Keluarga dibuat id={result['id']}")

# Perbarui record
bades.call_tool('update_penduduk', {
    'id': 'penduduk-uuid-here',
    'pekerjaan': 'PETANI',
})
\`\`\`

Ini memungkinkan orkestrasi workflow data multi-langkah dalam satu eksekusi kotak pasir
— lebih cepat dari rangkaian panggilan tool individual yang setara dari
agen, dan komputasi tetap di sisi server.`,
        isCustom: false,
      },
    }),

  xlsx: (args: Omit<CreateStandardSkillArgs, 'context'>) =>
    createStandardSkillFlatMetadata({
      ...args,
      context: {
        skillName: 'xlsx',
        name: 'xlsx',
        label: 'Excel & Spreadsheet',
        description:
          'Membuat, mengedit, dan menganalisis Excel/spreadsheet dengan rumus, pemformatan, dan visualisasi',
        icon: 'IconFileSpreadsheet',
        content: `# Skill Pengolahan Excel

**PENTING**: Simpan semua file keluaran ke \`/home/user/output/\` agar dapat diunduh.

## Skrip yang Sudah Terpasang

- \`python /home/user/scripts/xlsx/recalc.py <excel_file> [timeout]\` - Hitung ulang rumus menggunakan LibreOffice

## Persyaratan

### Nol Error Rumus
Setiap model Excel HARUS diserahkan dengan NOL error rumus (#REF!, #DIV/0!, #VALUE!, #N/A, #NAME?)

### Gunakan Rumus, Bukan Nilai Hardcode
**Selalu gunakan rumus Excel alih-alih menghitung nilai di Python dan meng-hardcode-nya.**

\`\`\`python
# Salah - Hardcoding
total = df['Penjualan'].sum()
sheet['B10'] = total

# Benar - Menggunakan rumus
sheet['B10'] = '=SUM(B2:B9)'
\`\`\`

## Membaca dan Menganalisis Data

\`\`\`python
import pandas as pd

# Baca Excel
df = pd.read_excel('file.xlsx')
semua_sheet = pd.read_excel('file.xlsx', sheet_name=None)  # Semua sheet sebagai dict

# Analisis
df.head()
df.info()
df.describe()
\`\`\`

## Membuat File Excel Baru

\`\`\`python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

wb = Workbook()
sheet = wb.active

# Tambah data
sheet['A1'] = 'Halo'
sheet.append(['Baris', 'dari', 'data'])

# Tambah rumus
sheet['B2'] = '=SUM(A1:A10)'

# Pemformatan
sheet['A1'].font = Font(bold=True)
sheet['A1'].fill = PatternFill('solid', start_color='FFFF00')
sheet['A1'].alignment = Alignment(horizontal='center')

# Lebar kolom
sheet.column_dimensions['A'].width = 20

wb.save('/home/user/output/output.xlsx')
\`\`\`

## Mengedit File yang Ada

\`\`\`python
from openpyxl import load_workbook

wb = load_workbook('existing.xlsx')
sheet = wb.active

# Ubah sel
sheet['A1'] = 'Nilai Baru'
sheet.insert_rows(2)

wb.save('/home/user/output/modified.xlsx')
\`\`\`

## Menghitung Ulang Rumus (WAJIB)

Setelah membuat/mengedit file dengan rumus, jalankan:
\`\`\`bash
python /home/user/scripts/xlsx/recalc.py /home/user/output/output.xlsx
\`\`\`

Skrip mengembalikan JSON dengan detail error:
\`\`\`json
{
  "status": "success",
  "total_errors": 0,
  "total_formulas": 42,
  "error_summary": {}
}
\`\`\`

Jika ditemukan error, perbaiki dan hitung ulang.

## Kode Warna Model Keuangan

- **Teks biru**: Input yang di-hardcode
- **Teks hitam**: Rumus dan kalkulasi
- **Teks hijau**: Tautan dari lembar kerja lain
- **Latar kuning**: Asumsi utama yang perlu diperhatikan

## Pemformatan Angka

- Tahun: Format sebagai teks ("2024" bukan "2.024")
- Mata uang: Gunakan format Rp#.##0
- Persentase: Format 0,0%
- Negatif: Gunakan tanda kurung (123) bukan minus -123

## Referensi Cepat

| Tugas | Tool | Contoh |
|------|------|---------|
| Baca Excel | pandas | \`pd.read_excel('file.xlsx')\` |
| Buat Excel | openpyxl | \`Workbook()\` |
| Tambah rumus | openpyxl | \`sheet['B2'] = '=SUM(A1:A10)'\` |
| Hitung ulang | skrip | \`python /home/user/scripts/xlsx/recalc.py file.xlsx\` |`,
        isCustom: false,
      },
    }),

  pdf: (args: Omit<CreateStandardSkillArgs, 'context'>) =>
    createStandardSkillFlatMetadata({
      ...args,
      context: {
        skillName: 'pdf',
        name: 'pdf',
        label: 'Pengolahan PDF',
        description:
          'Pengisian formulir PDF, ekstraksi field, parsing tabel, dan validasi',
        icon: 'IconFileTypePdf',
        content: `# Skill Pengolahan PDF

**PENTING**: Simpan semua file keluaran ke \`/home/user/output/\` agar dapat diunduh.

## Skrip yang Sudah Terpasang

### Ekstraksi Field
- \`python /home/user/scripts/pdf/extract_form_field_info.py <pdf_file>\` - Ekstrak semua nama dan tipe field yang dapat diisi (output JSON)
- \`python /home/user/scripts/pdf/check_fillable_fields.py <pdf_file>\` - Periksa apakah PDF memiliki field yang dapat diisi

### Pengisian Formulir
- \`python /home/user/scripts/pdf/fill_fillable_fields.py <pdf_file> <json_data> <output_file>\` - Isi field formulir PDF
- \`python /home/user/scripts/pdf/fill_pdf_form_with_annotations.py <pdf_file> <json_data> <output_file>\` - Isi dengan dukungan anotasi

### Validasi
- \`python /home/user/scripts/pdf/create_validation_image.py <pdf_file>\` - Buat gambar validasi dari PDF yang sudah diisi
- \`python /home/user/scripts/pdf/check_bounding_boxes.py <pdf_file>\` - Periksa batas field
- \`python /home/user/scripts/pdf/convert_pdf_to_images.py <pdf_file>\` - Konversi halaman PDF ke gambar

## Membaca PDF

\`\`\`python
import fitz  # PyMuPDF

# Buka PDF
doc = fitz.open('document.pdf')

# Ekstrak teks dari semua halaman
for page in doc:
    text = page.get_text()
    print(text)

# Ekstrak teks dari halaman tertentu
page = doc[0]  # Halaman pertama
text = page.get_text()
\`\`\`

## Mengekstrak Tabel

\`\`\`python
import pdfplumber

with pdfplumber.open('document.pdf') as pdf:
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            for row in table:
                print(row)
\`\`\`

## Mengisi Formulir PDF

### Langkah 1: Ekstrak informasi field
\`\`\`bash
python /home/user/scripts/pdf/extract_form_field_info.py form.pdf > fields.json
\`\`\`

### Langkah 2: Buat data pengisian JSON
\`\`\`json
{
  "field_name_1": "value1",
  "field_name_2": "value2",
  "checkbox_field": true
}
\`\`\`

### Langkah 3: Isi formulir
\`\`\`bash
python /home/user/scripts/pdf/fill_fillable_fields.py form.pdf fill_data.json /home/user/output/output.pdf
\`\`\`

### Langkah 4: Validasi keluaran
\`\`\`bash
python /home/user/scripts/pdf/create_validation_image.py /home/user/output/output.pdf
\`\`\`

## Membuat PDF

\`\`\`python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

c = canvas.Canvas('/home/user/output/output.pdf', pagesize=letter)
c.drawString(100, 750, 'Halo Dunia!')
c.save()
\`\`\`

## Menggabungkan PDF

\`\`\`python
from PyPDF2 import PdfMerger

merger = PdfMerger()
merger.append('file1.pdf')
merger.append('file2.pdf')
merger.write('/home/user/output/merged.pdf')
merger.close()
\`\`\`

## Memisahkan PDF

\`\`\`python
from PyPDF2 import PdfReader, PdfWriter

reader = PdfReader('document.pdf')

# Ekstrak halaman tertentu
writer = PdfWriter()
writer.add_page(reader.pages[0])  # Halaman pertama
writer.write('/home/user/output/page1.pdf')
\`\`\`

## Referensi Cepat

| Tugas | Tool | Perintah/Contoh |
|------|------|-----------------|
| Ekstrak teks | PyMuPDF | \`page.get_text()\` |
| Ekstrak tabel | pdfplumber | \`page.extract_tables()\` |
| Daftar field formulir | skrip | \`python extract_form_field_info.py form.pdf\` |
| Isi formulir | skrip | \`python fill_fillable_fields.py form.pdf data.json out.pdf\` |
| Validasi isian | skrip | \`python create_validation_image.py filled.pdf\` |
| Buat PDF | reportlab | \`canvas.Canvas('out.pdf')\` |
| Gabungkan PDF | PyPDF2 | \`PdfMerger()\` |`,
        isCustom: false,
      },
    }),

  docx: (args: Omit<CreateStandardSkillArgs, 'context'>) =>
    createStandardSkillFlatMetadata({
      ...args,
      context: {
        skillName: 'docx',
        name: 'docx',
        label: 'Dokumen Word',
        description:
          'Membuat, mengedit, memproses template dokumen Word, dan manipulasi OOXML',
        icon: 'IconFileTypeDocx',
        content: `# Skill Pengolahan Dokumen Word

**PENTING**: Simpan semua file keluaran ke \`/home/user/output/\` agar dapat diunduh.

## Skrip yang Sudah Terpasang (Pengeditan OOXML)

- \`python /home/user/scripts/docx/unpack.py <docx_file> <output_dir>\` - Buka paket .docx ke file XML untuk diedit langsung
- \`python /home/user/scripts/docx/pack.py <input_dir> <docx_file>\` - Kemas ulang file XML menjadi .docx
- \`python /home/user/scripts/docx/validate.py <docx_file>\` - Validasi struktur dokumen

### Skrip Validasi
- \`/home/user/scripts/docx/validation/docx.py\` - Modul validasi DOCX
- \`/home/user/scripts/docx/validation/redlining.py\` - Validasi lacak perubahan/redline

## API Tingkat Tinggi (python-docx)

### Membaca Dokumen

\`\`\`python
from docx import Document

doc = Document('document.docx')

# Baca paragraf
for para in doc.paragraphs:
    print(para.text)

# Baca tabel
for table in doc.tables:
    for row in table.rows:
        for cell in row.cells:
            print(cell.text)
\`\`\`

### Membuat Dokumen

\`\`\`python
from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()

# Tambah judul
doc.add_heading('Judul Dokumen', 0)

# Tambah paragraf dengan pemformatan
para = doc.add_paragraph('Teks normal. ')
run = para.add_run('Teks tebal.')
run.bold = True

# Tambah tabel
table = doc.add_table(rows=2, cols=2)
table.cell(0, 0).text = 'Header 1'
table.cell(0, 1).text = 'Header 2'

# Tambah gambar
doc.add_picture('image.png', width=Inches(4))

doc.save('/home/user/output/output.docx')
\`\`\`

## Pengeditan OOXML Tingkat Rendah

Untuk pengeditan kompleks (lacak perubahan, XML kustom), gunakan alur kerja buka paket/edit/kemas ulang:

### Langkah 1: Buka Paket
\`\`\`bash
python /home/user/scripts/docx/unpack.py document.docx ./unpacked/
\`\`\`

### Langkah 2: Edit XML langsung
\`\`\`python
import xml.etree.ElementTree as ET

tree = ET.parse('./unpacked/word/document.xml')
root = tree.getroot()

# Edit XML...
# Namespace: w = http://schemas.openxmlformats.org/wordprocessingml/2006/main

tree.write('./unpacked/word/document.xml', xml_declaration=True, encoding='UTF-8')
\`\`\`

### Langkah 3: Validasi & Kemas Ulang
\`\`\`bash
python /home/user/scripts/docx/validate.py ./unpacked/
python /home/user/scripts/docx/pack.py ./unpacked/ /home/user/output/output.docx
\`\`\`

## Pemrosesan Template

### Cari dan Ganti
\`\`\`python
from docx import Document

doc = Document('template.docx')

for para in doc.paragraphs:
    if '{{name}}' in para.text:
        para.text = para.text.replace('{{name}}', 'Budi Santoso')

doc.save('/home/user/output/filled.docx')
\`\`\`

### Pertahankan Pemformatan Saat Mengganti
\`\`\`python
def replace_in_paragraph(para, old_text, new_text):
    """Ganti teks sambil mempertahankan pemformatan"""
    for run in para.runs:
        if old_text in run.text:
            run.text = run.text.replace(old_text, new_text)

for para in doc.paragraphs:
    replace_in_paragraph(para, '{{name}}', 'Budi Santoso')
\`\`\`

## Bekerja dengan Gaya

\`\`\`python
from docx.shared import Pt, RGBColor

# Atur font
run.font.name = 'Arial'
run.font.size = Pt(12)
run.font.color.rgb = RGBColor(0, 0, 0)

# Pemformatan paragraf
para.alignment = WD_ALIGN_PARAGRAPH.CENTER
para.paragraph_format.space_before = Pt(12)
para.paragraph_format.space_after = Pt(12)
\`\`\`

## Referensi Cepat

| Tugas | Tool | Contoh |
|------|------|---------|
| Baca dokumen | python-docx | \`Document('file.docx')\` |
| Buat dokumen | python-docx | \`Document()\` |
| Tambah judul | python-docx | \`doc.add_heading('Judul', 0)\` |
| Tambah tabel | python-docx | \`doc.add_table(rows=2, cols=2)\` |
| Buka paket untuk diedit | skrip | \`python unpack.py doc.docx ./out/\` |
| Kemas ulang | skrip | \`python pack.py ./out/ doc.docx\` |
| Validasi | skrip | \`python validate.py doc.docx\` |`,
        isCustom: false,
      },
    }),

  'view-building': (args: Omit<CreateStandardSkillArgs, 'context'>) =>
    createStandardSkillFlatMetadata({
      ...args,
      context: {
        skillName: 'view-building',
        name: 'view-building',
        label: 'Penyusunan Tampilan',
        description:
          'Membuat dan mengonfigurasi tampilan (tabel, papan/kanban, kalender) untuk objek guna mengorganisasi dan memvisualisasikan record',
        icon: 'IconLayoutBoard',
        content: `# Skill Penyusunan Tampilan

Anda membantu pengguna membuat dan mengonfigurasi tampilan untuk mengorganisasi cara mereka melihat record.

## Jenis Tampilan

- **TABLE**: Tampilan tabel/grid standar. Berfungsi untuk objek apa pun. Jenis tampilan default.
- **KANBAN**: Tampilan papan yang dikelompokkan berdasarkan field SELECT. Terbaik untuk alur kerja berbasis pipeline/status.
- **CALENDAR**: Tampilan kalender menggunakan field DATE atau DATE_TIME. Terbaik untuk record berbasis waktu.

## Tool

- get_views - Daftar tampilan yang ada (filter berdasarkan nama objek)
- create_view - Buat tampilan baru
- update_view - Perbarui nama/ikon tampilan
- delete_view - Hapus tampilan
- create_many_view_fields - Tambahkan kolom yang terlihat ke tampilan
- update_many_view_fields - Perbarui konfigurasi kolom
- get_view_fields - Daftar kolom dalam tampilan
- list_object_metadata_items - Temukan objek dan field-nya
- navigate_app - Navigasi ke tampilan setelah dibuat

## Alur Kerja

1. **Identifikasi objek target**: Jika pengguna tidak menentukan objek, tanyakan. Sajikan objek yang tersedia dan jelaskan isinya:
   - **Keluarga**: Kartu Keluarga (nomor KK, alamat, kepala keluarga)
   - **Penduduk**: Warga sesuai KTP-el (nama, NIK, tanggal lahir, jenis kelamin, agama, alamat, keluarga)
   - **Program Bantuan**: PKH/BLT-DD/BPNT/dst (nama, jenis bantuan, periode, anggaran)
   - **Task**: Item tindakan (judul, status, tanggal jatuh tempo, penugasan)
   - **Note**: Catatan bebas (judul, isi)
   - Ditambah objek kustom apa pun di workspace

2. **Pilih jenis tampilan**: Sarankan jenis terbaik berdasarkan data objek:
   - TABLE: Default yang baik untuk objek apa pun, bagus untuk menelusuri dataset besar
   - KANBAN: Ideal saat objek memiliki field SELECT yang mewakili tahap/status (mis. Program Bantuan → tahap, Task → status)
   - CALENDAR: Ideal saat objek memiliki field DATE/DATE_TIME (mis. Program Bantuan → tanggalRealisasi, Task → tanggalJatuhTempo)

3. **Buat tampilan**: Gunakan create_view dengan parameter yang tepat.
   - Untuk KANBAN: mainGroupByFieldName wajib — tanyakan pengguna field SELECT mana yang dikelompokkan, atau sarankan yang paling alami.
   - Untuk CALENDAR: Anda harus menyediakan \`calendarFieldName\` (nama field DATE/DATE_TIME) dan \`calendarLayout\` ("DAY", "WEEK", atau "MONTH") saat memanggil create_view.
   - Untuk TABLE: Tidak perlu konfigurasi khusus.

4. **Konfigurasikan field tampilan**: Gunakan create_many_view_fields untuk menambahkan kolom yang relevan. Pilih field yang masuk akal untuk tujuan tampilan. Gunakan posisi desimal antara 0 dan 1 untuk menempatkannya setelah field pengenal label.

5. **Navigasi**: Gunakan navigate_app untuk menampilkan tampilan baru kepada pengguna.

## Praktik Terbaik KANBAN

- Field pengelompokan harus bertipe SELECT
- Pengelompokan umum: Program Bantuan berdasarkan tahap, Task berdasarkan status
- Opsional tetapkan kanbanAggregateOperation (COUNT, SUM, AVG, MIN, MAX) dan kanbanAggregateOperationFieldName untuk ringkasan kolom
- Contoh: Jumlah anggaran per tahap untuk papan Program Bantuan

## Praktik Terbaik CALENDAR

- Memerlukan field DATE atau DATE_TIME pada objek
- Terbaik untuk: tanggal realisasi Program Bantuan, tanggal jatuh tempo Task, data berbasis acara apa pun

## TABLE dengan Grup

- Tampilan TABLE juga dapat dikelompokkan berdasarkan field menggunakan mainGroupByFieldName
- Ini membuat bagian yang dapat diciutkan dalam tabel, diorganisasi berdasarkan nilai field pengelompokan
- Berfungsi dengan field SELECT untuk pengelompokan kategorikal

## Pendekatan

- Jika pengguna tidak jelas (mis. "buat papan"), tanyakan objek mana yang ingin dilihat
- Sarankan jenis tampilan paling relevan berdasarkan field objek
- Setelah membuat tampilan, selalu konfigurasikan field tampilan yang berguna dan navigasi ke sana
- Jelaskan apa yang dilakukan setiap jenis tampilan agar pengguna dapat membuat pilihan yang tepat`,
        isCustom: false,
      },
    }),

  'view-filters-and-sorts': (args: Omit<CreateStandardSkillArgs, 'context'>) =>
    createStandardSkillFlatMetadata({
      ...args,
      context: {
        skillName: 'view-filters-and-sorts',
        name: 'view-filters-and-sorts',
        label: 'Filter & Urutan Tampilan',
        description:
          'Menambahkan filter dan pengurutan ke tampilan untuk memfokuskan pada record yang relevan berdasarkan kebutuhan pengguna',
        icon: 'IconFilter',
        content: `# Skill Filter & Urutan Tampilan

Anda membantu pengguna menambahkan filter dan pengurutan ke tampilan mereka agar mereka melihat record paling relevan.

## Tool

- get_views - Daftar tampilan yang ada untuk menemukan yang ingin diubah
- get_view_query_parameters - Periksa filter dan pengurutan yang ada pada tampilan
- list_object_metadata_items - Temukan field dan tipe-nya untuk membangun filter yang valid
- create_view_filter / create_many_view_filters - Tambahkan filter ke tampilan
- create_view_sort / create_many_view_sorts - Tambahkan pengurutan ke tampilan
- navigate_app - Navigasi ke tampilan untuk menampilkan hasil

## Operator Filter berdasarkan Jenis Field

| Jenis Field | Operator yang Tersedia |
|---|---|
| TEXT, EMAILS, FULL_NAME, ADDRESS, LINKS, PHONES | CONTAINS, DOES_NOT_CONTAIN, IS_EMPTY, IS_NOT_EMPTY |
| NUMBER, NUMERIC | IS, IS_NOT, GREATER_THAN_OR_EQUAL, LESS_THAN_OR_EQUAL, IS_EMPTY, IS_NOT_EMPTY |
| CURRENCY | GREATER_THAN_OR_EQUAL, LESS_THAN_OR_EQUAL, IS_EMPTY, IS_NOT_EMPTY |
| DATE, DATE_TIME | IS, IS_RELATIVE, IS_IN_PAST, IS_IN_FUTURE, IS_TODAY, IS_BEFORE, IS_AFTER, IS_EMPTY, IS_NOT_EMPTY |
| SELECT | IS, IS_NOT, IS_EMPTY, IS_NOT_EMPTY |
| MULTI_SELECT, ARRAY | CONTAINS, DOES_NOT_CONTAIN, IS_EMPTY, IS_NOT_EMPTY |
| RELATION | IS, IS_NOT, IS_EMPTY, IS_NOT_EMPTY |
| BOOLEAN | IS |

## Arah Pengurutan

- ASC: Menaik (A→Z, 0→9, terlama→terbaru)
- DESC: Menurun (Z→A, 9→0, terbaru→terlama)

## Grup Filter (AND/OR/NOT)

Filter dapat dikelompokkan dengan operator logika:
- **AND**: Semua filter harus cocok (default)
- **OR**: Setidaknya satu filter harus cocok
- **NOT**: Negasikan grup
- Grup dapat disarangkan untuk kondisi kompleks seperti: nama CONTAINS "Santoso" AND (anggaran > 1Jt OR jumlahPenerima > 100)

## Alur Kerja

1. **Identifikasi tampilan**: Jika pengguna tidak menentukan tampilan, tanyakan tampilan mana yang ingin difilter/diurutkan. Gunakan get_views untuk mendaftar tampilan yang tersedia dan menyajikannya.

2. **Pahami kebutuhan**: Jika pengguna belum mendeskripsikan apa yang ingin dilihat, tanyakan. Berikan panduan dengan contoh:
   - "Record apa yang ingin Anda fokuskan? Misalnya:"
   - "Tampilkan program bantuan bernilai tinggi (anggaran > Rp 5 juta)"
   - "Tampilkan keluarga di dusun atau RT tertentu"
   - "Tampilkan tugas yang jatuh tempo minggu ini, diurutkan berdasarkan prioritas"
   - "Tampilkan penduduk dari keluarga tertentu"
   - "Tampilkan record terbaru yang dibuat dalam 30 hari terakhir"

3. **Periksa tampilan**: Gunakan get_view_query_parameters untuk melihat filter/pengurutan yang ada dan list_object_metadata_items untuk menemukan field yang tersedia.

4. **Bangun filter**: Berdasarkan kebutuhan pengguna, tentukan:
   - Field mana yang difilter
   - Operator mana yang valid untuk jenis field tersebut (lihat tabel di atas)
   - Nilai apa yang difilter
   - Apakah menggunakan pengelompokan AND atau OR untuk beberapa filter

5. **Bangun pengurutan**: Tentukan:
   - Field mana yang diurutkan (paling relevan dengan tujuan pengguna)
   - Arah: ASC atau DESC
   - Beberapa pengurutan dapat ditambahkan (primer, sekunder, dll.)

6. **Terapkan dan navigasi**: Buat filter/pengurutan pada tampilan dan navigasi ke sana.

## Pola Filter Umum

### Berdasarkan Waktu
- Record terbaru: field DATE_TIME + IS_AFTER + nilai tanggal
- Tenggat waktu mendatang: field DATE + IS_IN_FUTURE
- Tugas terlambat: field DATE + IS_IN_PAST + status IS_NOT "SELESAI"
- Minggu/bulan ini: field DATE + IS_RELATIVE

### Berdasarkan Status/Tahap
- Program bantuan terbuka: tahap IS "DALAM_PROSES" atau IS_NOT "SELESAI"/"DITOLAK"
- Tugas aktif: status IS_NOT "SELESAI"

### Berdasarkan Relasi
- Record yang terhubung ke keluarga: relasi keluarga IS [keluarga tertentu]
- Tugas yang belum ditugaskan: assignee IS_EMPTY
- Record tanpa relasi: field relasi IS_EMPTY

### Berdasarkan Nilai
- Program bantuan bernilai tinggi: anggaran GREATER_THAN_OR_EQUAL ambang batas
- Keluarga penerima banyak: jumlahPenerima GREATER_THAN_OR_EQUAL ambang batas

## Pola Pengurutan Umum

- Tampilan pipeline: Urutkan berdasarkan anggaran DESC (nilai terbesar lebih dulu)
- Manajemen tugas: Urutkan berdasarkan tanggalJatuhTempo ASC (jatuh tempo paling awal lebih dulu)
- Aktivitas terbaru: Urutkan berdasarkan updatedAt DESC atau createdAt DESC
- Alfabetis: Urutkan berdasarkan nama ASC

## Field Komposit

Beberapa field memiliki sub-field yang dapat difilter:
- CURRENCY: Gunakan subFieldName "amountMicros" untuk nilai numerik
- ADDRESS: Gunakan subFieldName seperti "addressCity", "addressCountry"
- FULL_NAME: Gunakan subFieldName seperti "firstName", "lastName"
- EMAILS: Gunakan email utama
- LINKS: Gunakan URL tautan utama

## Pendekatan

- Selalu periksa jenis field sebelum menyarankan operator — menggunakan operator yang tidak valid untuk jenis field akan gagal
- Saat pengguna berkata "tampilkan saya X", terjemahkan ke logika filter yang tepat
- Sarankan pengurutan yang melengkapi filter (mis. jika memfilter tugas terlambat, urutkan berdasarkan tanggalJatuhTempo ASC)
- Jelaskan apa yang dilakukan filter agar pengguna memahami hasilnya
- Jika diperlukan pemfilteran kompleks (AND + OR), jelaskan logikanya dengan jelas`,
        isCustom: false,
      },
    }),

  'custom-objects-cleanup': (args: Omit<CreateStandardSkillArgs, 'context'>) =>
    createStandardSkillFlatMetadata({
      ...args,
      context: {
        skillName: 'custom-objects-cleanup',
        name: 'custom-objects-cleanup',
        label: 'Pembersihan Objek Kustom',
        description:
          'Mengarsipkan objek kustom dari workspace (mis. objek dev seed seperti hewan peliharaan, roket)',
        icon: 'IconArchive',
        content: `# Skill Pembersihan Objek Kustom

Anda membantu pengguna mengarsipkan objek kustom dari workspace mereka, seperti objek yang dibuat oleh dev seed (hewan peliharaan, roket, hasil survei, dll.) atau objek kustom apa pun lainnya.

## Tool

- list_object_metadata_items - Daftar semua objek di workspace untuk mengidentifikasi yang kustom
- update_many_object_metadata - Arsipkan objek kustom dengan menetapkan isActive ke false

## Alur Kerja

1. **Daftar semua objek**: Gunakan list_object_metadata_items untuk mendapatkan daftar lengkap objek di workspace.

2. **Identifikasi objek kustom**: Filter hasil untuk menemukan objek dengan isCustom bernilai true. Ini adalah objek yang dibuat oleh pengguna atau dev seed, berbeda dari objek standar bawaan (Keluarga, Penduduk, Program Bantuan, Task, Note, dll.).

3. **Sajikan temuan**: Beri tahu pengguna objek kustom mana yang ditemukan. Jika tidak ada, informasikan bahwa workspace tidak memiliki objek kustom.

4. **Konfirmasi sebelum mengarsipkan**: Daftar objek kustom yang ditemukan dan minta pengguna mengkonfirmasi mana yang ingin diarsipkan. Sajikan dengan jelas beserta nama, label, dan deskripsinya.

5. **Arsipkan objek yang dikonfirmasi**: Gunakan update_many_object_metadata untuk menetapkan isActive ke false pada semua objek yang dikonfirmasi dalam satu panggilan batch.

6. **Laporkan hasil**: Setelah pengarsipan selesai, ringkas apa yang diarsipkan.

## Catatan Penting

- Hanya objek dengan isCustom = true yang dapat diarsipkan. Objek standar tidak dapat diarsipkan melalui skill ini.
- Mengarsipkan objek menyembunyikannya dari workspace tetapi tidak menghapus field, relasi, atau record-nya.
- Saat dipanggil langsung oleh pengguna, konfirmasi sebelum mengarsipkan. Saat dipanggil oleh skill lain (mis. workspace-demo-seeding), lanjutkan tanpa konfirmasi.

## Pendekatan

- Jelaskan dengan jelas apa yang akan diarsipkan dan bahwa itu dapat dikembalikan
- Jika sebuah objek memiliki relasi ke objek lain, sebutkan ini sebelum mengarsipkan
- Arsipkan semua objek yang dikonfirmasi dalam satu panggilan batch menggunakan update_many_object_metadata`,
        isCustom: false,
      },
    }),

  pptx: (args: Omit<CreateStandardSkillArgs, 'context'>) =>
    createStandardSkillFlatMetadata({
      ...args,
      context: {
        skillName: 'pptx',
        name: 'pptx',
        label: 'PowerPoint',
        description:
          'Membuat, mengedit, memproses template PowerPoint, thumbnail, dan manipulasi slide',
        icon: 'IconPresentation',
        content: `# Skill Pengolahan PowerPoint

**PENTING**: Simpan semua file keluaran ke \`/home/user/output/\` agar dapat diunduh.

## Skrip yang Sudah Terpasang

- \`python /home/user/scripts/pptx/thumbnail.py <pptx_file> [output_dir]\` - Hasilkan thumbnail slide
- \`python /home/user/scripts/pptx/rearrange.py <pptx_file> <slide_order_json> <output_file>\` - Susun ulang slide
- \`python /home/user/scripts/pptx/inventory.py <pptx_file>\` - Daftar semua slide dan isinya
- \`python /home/user/scripts/pptx/replace.py <pptx_file> <replacements_json> <output_file>\` - Cari/ganti teks

## Membaca Presentasi

\`\`\`python
from pptx import Presentation

prs = Presentation('presentation.pptx')

# Iterasi melalui slide
for slide in prs.slides:
    for shape in slide.shapes:
        if shape.has_text_frame:
            print(shape.text)
\`\`\`

## Membuat Presentasi

\`\`\`python
from pptx import Presentation
from pptx.util import Inches, Pt

prs = Presentation()

# Tambah slide judul
slide_layout = prs.slide_layouts[0]  # Tata letak judul
slide = prs.slides.add_slide(slide_layout)
title = slide.shapes.title
subtitle = slide.placeholders[1]

title.text = "Judul Presentasi"
subtitle.text = "Subjudul di sini"

# Tambah slide konten
slide_layout = prs.slide_layouts[1]  # Judul dan konten
slide = prs.slides.add_slide(slide_layout)
title = slide.shapes.title
body = slide.placeholders[1]

title.text = "Judul Slide"
tf = body.text_frame
tf.text = "Poin pertama"
p = tf.add_paragraph()
p.text = "Poin kedua"
p.level = 1

prs.save('/home/user/output/output.pptx')
\`\`\`

## Menambahkan Gambar

\`\`\`python
from pptx.util import Inches

slide = prs.slides.add_slide(prs.slide_layouts[6])  # Tata letak kosong
slide.shapes.add_picture(
    'image.png',
    left=Inches(1),
    top=Inches(1),
    width=Inches(5)
)
\`\`\`

## Menambahkan Tabel

\`\`\`python
from pptx.util import Inches

slide = prs.slides.add_slide(prs.slide_layouts[6])
table = slide.shapes.add_table(
    rows=3, cols=3,
    left=Inches(1), top=Inches(1),
    width=Inches(8), height=Inches(2)
).table

# Tetapkan nilai sel
table.cell(0, 0).text = "Header 1"
table.cell(0, 1).text = "Header 2"
table.cell(1, 0).text = "Data 1"
\`\`\`

## Menambahkan Grafik

\`\`\`python
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE
from pptx.util import Inches

chart_data = CategoryChartData()
chart_data.categories = ['Dusun A', 'Dusun B', 'Dusun C']
chart_data.add_series('Penerima Bantuan', (19.2, 21.4, 16.7))

slide = prs.slides.add_slide(prs.slide_layouts[6])
chart = slide.shapes.add_chart(
    XL_CHART_TYPE.COLUMN_CLUSTERED,
    Inches(1), Inches(1), Inches(8), Inches(5),
    chart_data
).chart
\`\`\`

## Menggunakan Skrip

### Hasilkan Thumbnail
\`\`\`bash
python /home/user/scripts/pptx/thumbnail.py presentation.pptx ./thumbnails/
# Membuat: thumbnails/slide_1.png, slide_2.png, dll.
\`\`\`

### Dapatkan Inventaris Slide
\`\`\`bash
python /home/user/scripts/pptx/inventory.py presentation.pptx
# Mengembalikan JSON dengan semua konten dan shape slide
\`\`\`

### Susun Ulang Slide
\`\`\`bash
# Urutan: [3, 1, 2] berarti slide 3 menjadi pertama, slide 1 kedua, dst.
python /home/user/scripts/pptx/rearrange.py input.pptx '[3, 1, 2]' output.pptx
\`\`\`

### Cari dan Ganti Teks
\`\`\`bash
python /home/user/scripts/pptx/replace.py input.pptx '{"{{keluarga}}": "Keluarga Santoso", "{{date}}": "2024"}' output.pptx
\`\`\`

## Alur Kerja Pemrosesan Template

1. **Hasilkan thumbnail** untuk memahami struktur slide:
   \`\`\`bash
   python /home/user/scripts/pptx/thumbnail.py template.pptx ./preview/
   \`\`\`

2. **Dapatkan inventaris** untuk menemukan teks placeholder:
   \`\`\`bash
   python /home/user/scripts/pptx/inventory.py template.pptx
   \`\`\`

3. **Ganti placeholder**:
   \`\`\`bash
   python /home/user/scripts/pptx/replace.py template.pptx '{"{{judul}}": "Laporan Triwulan IV"}' output.pptx
   \`\`\`

## Referensi Cepat

| Tugas | Tool | Contoh |
|------|------|---------|
| Baca presentasi | python-pptx | \`Presentation('file.pptx')\` |
| Buat presentasi | python-pptx | \`Presentation()\` |
| Tambah slide | python-pptx | \`prs.slides.add_slide(layout)\` |
| Hasilkan thumbnail | skrip | \`python thumbnail.py pres.pptx ./out/\` |
| Dapatkan inventaris slide | skrip | \`python inventory.py pres.pptx\` |
| Susun ulang slide | skrip | \`python rearrange.py pres.pptx '[2,1,3]' out.pptx\` |
| Cari/ganti | skrip | \`python replace.py pres.pptx '{...}' out.pptx\` |`,
        isCustom: false,
      },
    }),
} satisfies {
  [P in AllStandardSkillName]: (
    args: Omit<CreateStandardSkillArgs, 'context'>,
  ) => FlatSkill;
};
