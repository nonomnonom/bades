# TODO Rebrand Bades

> Master checklist untuk rebrand Twenty menjadi **bades.id / Balaidesa** dengan
> bahasa Indonesia native, branding Bades penuh, dan seed SID yang mengganti
> total sample/data bawaan Twenty.

## 1. Baseline dan Audit Awal

- [ ] Buat branch kerja khusus rebrand Bades
- [ ] Catat commit baseline sebelum rebrand massal
- [ ] Inventaris semua package yang user-facing
- [ ] Inventaris semua package yang hanya internal
- [ ] Petakan semua entrypoint aplikasi utama
- [ ] Petakan semua title browser yang masih warisan Twenty
- [ ] Petakan semua favicon dan app icon yang aktif
- [ ] Petakan semua email template yang aktif
- [ ] Petakan semua manifest dan metadata SEO
- [ ] Petakan semua halaman onboarding
- [ ] Petakan semua sample workspace bootstrap
- [ ] Petakan semua source seed utama

## 2. Script Audit Branding

- [ ] Buat script scan string `Twenty`
- [ ] Buat script scan string `twenty`
- [ ] Buat script scan string `TWENTY`
- [ ] Buat script scan asset path yang mengandung `twenty`
- [ ] Buat script scan nama file yang mengandung `twenty`
- [ ] Buat script scan metadata title yang mengandung `Twenty`
- [ ] Buat script scan description SEO yang mengandung `Twenty`
- [ ] Buat script scan subject email yang mengandung `Twenty`
- [ ] Buat script scan placeholder yang mengandung istilah CRM generic
- [ ] Buat output laporan audit per package
- [ ] Simpan hasil audit awal ke file laporan
- [ ] Tandai false positive yang tidak user-facing

## 3. Script Audit Bahasa

- [ ] Buat script scan string English di UI utama
- [ ] Buat script scan label tombol English
- [ ] Buat script scan toast English
- [ ] Buat script scan modal English
- [ ] Buat script scan empty state English
- [ ] Buat script scan onboarding English
- [ ] Buat script scan helper text English
- [ ] Buat script scan menu/sidebar English
- [ ] Buat script scan table column label English
- [ ] Buat script scan enum label English
- [ ] Buat script scan seeded record English
- [ ] Buat laporan prioritas translate user-facing

## 4. Identity dan Logo Bades

- [ ] Jadikan `bd.svg` sebagai source of truth logo
- [ ] Tentukan versi full logo Bades
- [ ] Tentukan versi mark/icon Bades
- [ ] Buat turunan favicon dari `bd.svg`
- [ ] Buat turunan app icon dari `bd.svg`
- [ ] Ganti logo header aplikasi utama
- [ ] Ganti logo login/register
- [ ] Ganti logo email template
- [ ] Ganti logo website marketing
- [ ] Ganti logo dokumentasi
- [ ] Ganti logo social preview bila ada
- [ ] Verifikasi semua ukuran logo tidak pecah

## 5. Naming dan Metadata Publik

- [ ] Ganti nama produk di browser title
- [ ] Ganti nama produk di manifest
- [ ] Ganti nama produk di meta description
- [ ] Ganti nama produk di Open Graph tags
- [ ] Ganti nama produk di Twitter card tags
- [ ] Ganti nama produk di landing page
- [ ] Ganti nama produk di halaman auth
- [ ] Ganti nama produk di halaman settings
- [ ] Ganti nama produk di halaman error
- [ ] Ganti nama produk di halaman empty workspace
- [ ] Ganti nama produk di footer user-facing
- [ ] Ganti nama produk di legal copy bila ada

## 6. Terminologi CRM ke Terminologi Desa

- [ ] Definisikan padanan `company`
- [ ] Definisikan padanan `people`
- [ ] Definisikan padanan `opportunity`
- [ ] Definisikan padanan `pipeline`
- [ ] Definisikan padanan `deal`
- [ ] Definisikan padanan `task`
- [ ] Definisikan padanan `workspace`
- [ ] Definisikan padanan `contact`
- [ ] Definisikan padanan `account`
- [ ] Definisikan padanan `note`
- [ ] Definisikan padanan `activity`
- [ ] Definisikan padanan `view` bila perlu dilokalkan

## 7. Bahasa Indonesia Native

- [ ] Tetapkan style guide bahasa Indonesia Bades
- [ ] Pilih nada bahasa formal-ringan untuk operator desa
- [ ] Pastikan semua CTA utama berbahasa Indonesia
- [ ] Pastikan semua menu berbahasa Indonesia
- [ ] Pastikan semua label form berbahasa Indonesia
- [ ] Pastikan semua placeholder berbahasa Indonesia
- [ ] Pastikan semua validation error berbahasa Indonesia
- [ ] Pastikan semua success toast berbahasa Indonesia
- [ ] Pastikan semua destructive warning berbahasa Indonesia
- [ ] Pastikan semua system empty state berbahasa Indonesia
- [ ] Pastikan semua onboarding tips berbahasa Indonesia
- [ ] Pastikan tidak ada English keras yang lolos

## 8. Localization Default Indonesia

- [ ] Set locale default ke `id-ID`
- [ ] Set currency default ke `IDR`
- [ ] Set phone country code default ke `+62`
- [ ] Set format tanggal default ke `DD/MM/YYYY`
- [ ] Set format angka ribuan Indonesia
- [ ] Set format desimal Indonesia bila relevan
- [ ] Set default timezone Indonesia yang dipilih
- [ ] Set default country ke Indonesia
- [ ] Set default language ke Bahasa Indonesia
- [ ] Set default example address ke format Indonesia
- [ ] Set default example phone ke format Indonesia
- [ ] Set default example names ke format Indonesia

## 9. Seed Strategy Umum

- [ ] Temukan seluruh entrypoint seed existing
- [ ] Temukan seluruh file sample data existing
- [ ] Temukan seluruh bootstrap object bawaan Twenty
- [ ] Hapus ketergantungan seed pada object CRM generik
- [ ] Pastikan seed baru tidak mewarisi demo pipeline
- [ ] Pastikan seed baru tidak mewarisi demo contacts
- [ ] Pastikan seed baru tidak mewarisi demo companies
- [ ] Pastikan seed baru tidak mewarisi demo opportunities
- [ ] Tentukan urutan seed object Bades
- [ ] Tentukan urutan seed relasi antardomain
- [ ] Tentukan strategi idempotent seed baru
- [ ] Tentukan strategi reset data seed baru

## 10. Seed Demografi dan Wilayah

- [ ] Buat object seed `Penduduk`
- [ ] Buat object seed `Keluarga`
- [ ] Buat object seed `Rumah Tangga`
- [ ] Buat object seed `Wilayah`
- [ ] Seed struktur Desa
- [ ] Seed struktur Dusun
- [ ] Seed struktur RW
- [ ] Seed struktur RT
- [ ] Seed contoh keluarga Indonesia
- [ ] Seed contoh rumah tangga ekonomi
- [ ] Seed contoh penduduk lintas usia
- [ ] Seed relasi penduduk ke keluarga dan wilayah

## 11. Seed Pemerintahan Desa

- [ ] Buat object seed `Jabatan`
- [ ] Buat object seed `Periode Jabatan`
- [ ] Buat object seed `Lembaga Desa`
- [ ] Seed jabatan Kepala Desa
- [ ] Seed jabatan Sekretaris Desa
- [ ] Seed jabatan Kaur
- [ ] Seed jabatan Kasi
- [ ] Seed jabatan Kepala Dusun
- [ ] Seed jabatan Ketua RW
- [ ] Seed jabatan Ketua RT
- [ ] Seed struktur lembaga desa contoh
- [ ] Seed relasi perangkat desa ke jabatan

## 12. Seed Pelayanan Surat

- [ ] Buat object seed `Jenis Surat`
- [ ] Buat object seed `Permohonan Layanan`
- [ ] Buat object seed `Surat Keluar`
- [ ] Buat object seed `Surat Masuk`
- [ ] Seed jenis surat domisili
- [ ] Seed jenis surat SKTM
- [ ] Seed jenis surat pengantar nikah
- [ ] Seed nomor surat contoh format desa
- [ ] Seed alur permohonan layanan contoh
- [ ] Seed surat keluar yang sudah diterbitkan
- [ ] Seed surat masuk dari instansi luar
- [ ] Seed relasi surat dengan penduduk

## 13. Seed Keuangan Desa

- [ ] Buat object seed `APBDes`
- [ ] Buat object seed `Bidang Anggaran`
- [ ] Buat object seed `Kegiatan Anggaran`
- [ ] Buat object seed `Realisasi`
- [ ] Buat object seed `Sumber Dana`
- [ ] Seed tahun anggaran aktif
- [ ] Seed bidang pemerintahan
- [ ] Seed bidang pembangunan
- [ ] Seed bidang pembinaan
- [ ] Seed bidang pemberdayaan
- [ ] Seed bidang tak terduga
- [ ] Seed nominal contoh dalam IDR

## 14. Seed Program Sosial dan Bantuan

- [ ] Buat object seed `Program Bantuan`
- [ ] Buat object seed `Penerima Bantuan`
- [ ] Buat object seed `Posyandu`
- [ ] Seed program BLT-DD
- [ ] Seed program PKH
- [ ] Seed program BPNT
- [ ] Seed program bantuan stunting
- [ ] Seed data penerima per periode
- [ ] Seed nominal bantuan contoh
- [ ] Seed status penyaluran contoh
- [ ] Seed jadwal posyandu contoh
- [ ] Seed relasi warga ke program bantuan

## 15. Seed Aset dan Ekonomi

- [ ] Buat object seed `Aset Desa`
- [ ] Buat object seed `Bidang Tanah`
- [ ] Buat object seed `UMKM`
- [ ] Buat object seed `Kegiatan Desa`
- [ ] Seed inventaris kendaraan desa
- [ ] Seed inventaris bangunan desa
- [ ] Seed inventaris tanah desa
- [ ] Seed data persil/C-desa contoh
- [ ] Seed UMKM lokal contoh
- [ ] Seed musyawarah desa contoh
- [ ] Seed gotong royong contoh
- [ ] Seed pelatihan desa contoh

## 16. Field Model Penduduk

- [ ] Tambahkan field nama lengkap
- [ ] Tambahkan field NIK unik
- [ ] Tambahkan field nomor KK
- [ ] Tambahkan field tempat lahir
- [ ] Tambahkan field tanggal lahir
- [ ] Tambahkan field jenis kelamin
- [ ] Tambahkan field agama
- [ ] Tambahkan field status perkawinan
- [ ] Tambahkan field pendidikan terakhir
- [ ] Tambahkan field pekerjaan
- [ ] Tambahkan field golongan darah
- [ ] Tambahkan field kewarganegaraan

## 17. Field Lanjutan Penduduk

- [ ] Tambahkan field alamat komposit
- [ ] Tambahkan field relasi RT
- [ ] Tambahkan field relasi RW
- [ ] Tambahkan field relasi Dusun
- [ ] Tambahkan field status hubungan keluarga
- [ ] Tambahkan field tipe warga
- [ ] Tambahkan field status hidup
- [ ] Tambahkan field NIK ayah
- [ ] Tambahkan field NIK ibu
- [ ] Tambahkan field foto
- [ ] Tambahkan field tanggal sinkron Dukcapil
- [ ] Tambahkan constraint validasi panjang NIK

## 18. Relasi Antardomain

- [ ] Validasi relasi Wilayah ke dirinya sendiri
- [ ] Validasi relasi Keluarga ke Wilayah
- [ ] Validasi relasi Penduduk ke Keluarga
- [ ] Validasi relasi Penduduk ke Wilayah
- [ ] Validasi relasi Permohonan ke Penduduk
- [ ] Validasi relasi Permohonan ke Jenis Surat
- [ ] Validasi relasi Surat Keluar ke Permohonan
- [ ] Validasi relasi Periode Jabatan ke Penduduk
- [ ] Validasi relasi Penerima Bantuan ke Penduduk
- [ ] Validasi relasi Penerima Bantuan ke Program
- [ ] Validasi relasi Peserta Kegiatan ke Penduduk
- [ ] Uji semua junction penting

## 19. Permission dan Privasi

- [ ] Definisikan role Operator Desa
- [ ] Definisikan role Perangkat Desa
- [ ] Definisikan role Kepala Desa
- [ ] Definisikan role Admin Sistem Desa
- [ ] Batasi visibilitas NIK penuh
- [ ] Tampilkan masking NIK untuk role terbatas
- [ ] Audit field sensitif lain selain NIK
- [ ] Pastikan audit log create/update aktif
- [ ] Pastikan export sensitif dibatasi role
- [ ] Pastikan pencarian NIK patuh policy
- [ ] Pastikan seed role memakai istilah Indonesia
- [ ] Tulis catatan kepatuhan UU PDP

## 20. Frontend Copy Utama

- [ ] Ganti copy halaman login
- [ ] Ganti copy halaman daftar
- [ ] Ganti copy reset password
- [ ] Ganti copy invite user
- [ ] Ganti copy dashboard awal
- [ ] Ganti copy menu utama
- [ ] Ganti copy sidebar settings
- [ ] Ganti copy object management
- [ ] Ganti copy relation builder
- [ ] Ganti copy empty inbox bila ada
- [ ] Ganti copy command menu
- [ ] Ganti copy search global

## 21. Frontend Object Labels

- [ ] Ganti label object default yang masih CRM
- [ ] Ganti singular label object default
- [ ] Ganti plural label object default
- [ ] Ganti record page title default
- [ ] Ganti section title related records
- [ ] Ganti label breadcrumbs
- [ ] Ganti label activity panels
- [ ] Ganti label note composer
- [ ] Ganti label attachment area
- [ ] Ganti label timeline bila perlu
- [ ] Ganti label favorite/pinned terms
- [ ] Ganti label archived/deleted terms bila perlu

## 22. Frontend Form dan Validasi

- [ ] Terjemahkan semua error required
- [ ] Terjemahkan semua error invalid format
- [ ] Terjemahkan semua error unique constraint
- [ ] Terjemahkan semua error delete confirmation
- [ ] Terjemahkan semua warning unsaved changes
- [ ] Terjemahkan semua loading state
- [ ] Terjemahkan semua success message
- [ ] Terjemahkan semua helper date field
- [ ] Terjemahkan semua helper currency field
- [ ] Terjemahkan semua helper phone field
- [ ] Terjemahkan semua helper relation field
- [ ] Terjemahkan semua placeholder search field

## 23. Settings dan Workspace Defaults

- [ ] Ubah workspace welcome copy
- [ ] Ubah default workspace branding
- [ ] Ubah default organization naming
- [ ] Ubah settings profile copy
- [ ] Ubah settings anggota copy
- [ ] Ubah settings domain copy
- [ ] Ubah settings pengalaman copy
- [ ] Ubah settings permission copy
- [ ] Ubah settings role copy
- [ ] Ubah settings object copy
- [ ] Ubah settings import/export copy
- [ ] Ubah settings release/update copy yang terlihat user

## 24. Email dan Notifikasi

- [ ] Rebrand template email undangan
- [ ] Rebrand template reset password
- [ ] Rebrand template notifikasi sistem
- [ ] Rebrand footer email
- [ ] Rebrand sender name
- [ ] Rebrand subject email
- [ ] Terjemahkan isi email ke Bahasa Indonesia
- [ ] Ganti logo email ke Bades
- [ ] Ganti CTA email ke Bahasa Indonesia
- [ ] Ganti disclaimer email ke konteks Bades
- [ ] Audit semua template MJML/React Email
- [ ] Uji render template email

## 25. Website Marketing

- [ ] Ganti hero copy website
- [ ] Ganti proposition website ke SID
- [ ] Ganti CTA website
- [ ] Ganti daftar fitur website ke konteks desa
- [ ] Ganti screenshot/visual yang masih Twenty
- [ ] Ganti metadata SEO website
- [ ] Ganti FAQ website
- [ ] Ganti footer website
- [ ] Ganti halaman pricing bila ada
- [ ] Ganti halaman docs CTA
- [ ] Ganti halaman about/contact bila ada
- [ ] Uji semua link publik website

## 26. Dokumentasi

- [ ] Buat dokumen terminologi Bades
- [ ] Update README root sesuai Bades
- [ ] Update docs getting started
- [ ] Update docs self-hosting brand references
- [ ] Update docs user guide screenshots jika perlu
- [ ] Update docs extend/apps branding
- [ ] Update docs contribute commands naming bila relevan
- [ ] Update docs email/calendar wording
- [ ] Update docs AI wording bila user-facing
- [ ] Update docs custom object examples ke SID
- [ ] Update docs seed examples ke Indonesia
- [ ] Audit docs multilingual yang masih sangat publik

## 27. Search, Replace, dan Cleanup

- [ ] Jalankan audit branding gelombang pertama
- [ ] Jalankan audit bahasa gelombang pertama
- [ ] Tandai string yang aman diubah otomatis
- [ ] Tandai string yang harus diubah manual
- [ ] Lakukan replace terkontrol per package
- [ ] Review diff hasil replace massal
- [ ] Kembalikan false positive yang tidak boleh diubah
- [ ] Jalankan audit branding gelombang kedua
- [ ] Jalankan audit bahasa gelombang kedua
- [ ] Jalankan audit seed gelombang kedua
- [ ] Buat daftar sisa brand lama
- [ ] Tutup semua sisa kritikal user-facing

## 28. Backend Bootstrap dan Defaults

- [ ] Temukan bootstrap workspace default
- [ ] Ubah default workspace name contoh
- [ ] Ubah default sample member profiles
- [ ] Ubah default sample object layout
- [ ] Ubah default dashboard sample
- [ ] Ubah default menu sample
- [ ] Ubah default app intro sample
- [ ] Ubah default custom object examples
- [ ] Ubah default relation examples
- [ ] Ubah default field examples
- [ ] Ubah default record examples
- [ ] Uji bootstrap workspace dari nol

## 29. Testing Rebrand

- [ ] Tulis checklist QA branding
- [ ] Tulis checklist QA bahasa
- [ ] Tulis checklist QA seed
- [ ] Uji login dan onboarding
- [ ] Uji pembuatan workspace baru
- [ ] Uji object seed muncul benar
- [ ] Uji relation seed muncul benar
- [ ] Uji role dan permission dasar
- [ ] Uji template email utama
- [ ] Uji search tidak menampilkan istilah lama
- [ ] Uji title/metadata browser
- [ ] Uji icon/logo semua surface

## 30. QA Bahasa Native Indonesia

- [ ] Review seluruh menu utama oleh penutur Indonesia
- [ ] Review seluruh form utama oleh penutur Indonesia
- [ ] Review seluruh modal utama oleh penutur Indonesia
- [ ] Review seluruh email oleh penutur Indonesia
- [ ] Review seluruh onboarding oleh penutur Indonesia
- [ ] Review seluruh seed names oleh penutur Indonesia
- [ ] Review seluruh jabatan dan wilayah contoh
- [ ] Review seluruh istilah keuangan desa
- [ ] Review seluruh istilah surat menyurat
- [ ] Review seluruh istilah bantuan sosial
- [ ] Review seluruh istilah aset desa
- [ ] Final pass hapus English keras

## 31. QA Data dan Seed SID

- [ ] Validasi object fondasi terbuat semua
- [ ] Validasi field Penduduk lengkap
- [ ] Validasi field Keluarga lengkap
- [ ] Validasi field Wilayah lengkap
- [ ] Validasi object pelayanan surat lengkap
- [ ] Validasi object keuangan desa lengkap
- [ ] Validasi object bantuan lengkap
- [ ] Validasi object aset dan ekonomi lengkap
- [ ] Validasi relasi antarobject konsisten
- [ ] Validasi seeded records tidak dummy ala CRM
- [ ] Validasi sample names benar-benar Indonesia
- [ ] Validasi reset seed tetap bersih

## 32. Packaging dan Release

- [ ] Update changelog internal rebrand
- [ ] Tulis release notes Bades alpha
- [ ] Dokumentasikan breaking changes dari seed lama
- [ ] Dokumentasikan cara migrasi dari seed Twenty
- [ ] Siapkan screenshot produk baru
- [ ] Siapkan demo workspace desa
- [ ] Siapkan daftar known issue rebrand
- [ ] Siapkan checklist smoke test release
- [ ] Tag release internal bila siap
- [ ] Arsipkan laporan audit branding akhir
- [ ] Arsipkan laporan audit bahasa akhir
- [ ] Arsipkan laporan audit seed akhir

## 33. Final Gate

- [ ] Tidak ada logo Twenty tersisa di surface user-facing
- [ ] Tidak ada nama Twenty tersisa di surface user-facing
- [ ] Tidak ada istilah CRM generic yang mengganggu user desa
- [ ] Tidak ada seed CRM lama yang masih aktif
- [ ] Semua default locale sudah Indonesia
- [ ] Semua sample nama dan wilayah sudah Indonesia
- [ ] Semua email utama sudah Bades
- [ ] Semua dokumen utama sudah Bades
- [ ] Semua audit script berjalan tanpa temuan kritikal
- [ ] Workspace baru terasa seperti produk balai desa Indonesia
