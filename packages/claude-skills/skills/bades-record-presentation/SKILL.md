---
name: bades-record-presentation
description: "Ambil dan sajikan data record Bades.id sebagai ringkasan atau tabel yang mudah dibaca, dengan memanfaatkan Bades MCP server untuk menemukan field, mengambil data yang relevan, memformat tanggal dan nilai, membuat tautan record, serta menghindari output API mentah."
---

# Penyajian Record Bades

## Ringkasan

Ambil data record Bades yang dibutuhkan untuk menjawab pertanyaan pengguna, lalu sajikan sebagai jawaban yang berguna — bukan output API mentah. Terjemahkan field teknis, timestamp, ID, dan struktur bersarang menjadi ringkasan yang membantu pengguna memindai, membandingkan, dan mengambil tindakan.

## Alur Pengambilan Data

Pakai Bades MCP server yang terhubung jika tersedia.

- `get_tool_catalog` → `learn_tools` → `execute_tool`
- Temukan objek, field, filter, dan opsi sort yang relevan lewat tool — jangan menebak nama API persis.
- Ambil hanya field yang dibutuhkan untuk jawaban, plus field untuk ordering atau disambiguasi.
- Untuk permintaan "terbaru", "terakhir", atau "recent", sertakan field timestamp yang dipakai untuk sorting.
- Kalau pengguna minta daftar luas, terapkan batas wajar dan sebutkan berapa record yang ditampilkan.
- Kalau konteks penting hilang dan tidak bisa ditemukan dari tool, ajukan satu pertanyaan klarifikasi singkat.
- Kalau tidak ada Bades MCP tool yang tersedia, sampaikan bahwa tidak ada Bades MCP server yang bisa dipanggil di thread saat ini, lalu minta pengguna menghubungkan atau membuka workspace yang dimaksud.

## Bentuk Respons

Mulai dengan jawaban atau jumlah, lalu tampilkan record dalam bentuk paling ringkas:

- Satu record → blok berlabel.
- 2 sampai 10 record yang bisa dibandingkan → tabel Markdown.
- Set yang lebih besar → tampilkan baris paling relevan dulu, sebutkan total, dan tawarkan filter atau halaman berikutnya hanya bila perlu.
- Record bersarang → ringkas nilai penting di dalamnya, jangan dump JSON.
- Kalau membandingkan record lintas workspace, lebih baik satu tabel gabungan dengan kolom Workspace bila itu memudahkan baca. Pisahkan jadi beberapa bagian hanya kalau tiap workspace butuh kolom berbeda.

Pakai bahasa Indonesia untuk label dan narasi. Pertahankan nama, nilai record, email, URL, dan kata khas yang diberikan pengguna apa adanya.

## Tautan Record

Tautkan record kembali ke konteks Bades aslinya kalau origin workspace dan identitas record diketahui.

- Bangun tautan record dengan path show-page Bades: `/object/:objectNameSingular/:objectRecordId`.
- Untuk tautan absolut, gabungkan origin workspace dengan path itu, misalnya `https://contoh.bades.id/object/penduduk/record-id`.
- Pakai `recordReferences` dari respons MCP bila tersedia, untuk dapat `objectNameSingular`, `recordId`, dan `displayName`.
- Kalau `recordReferences` tidak ada, pakai `id` record dan nama objek dari tool yang mengembalikannya.
- Lebih baik tautkan nama tampilan record di tabel/ringkasan daripada menambahkan kolom ID mentah.
- Saat menampilkan record dari beberapa workspace, buat tautan dengan origin workspace masing-masing.
- Kalau origin workspace tidak diketahui, jangan mengarang hostname. Tambahkan kolom Record ringkas berisi nama objek + ID record, atau sampaikan bahwa tautan langsung butuh URL workspace.

## Tanggal dan Waktu

Jangan pernah menampilkan timestamp ISO/RFC3339 sebagai tampilan tanggal utama.

- Parse format teknis umum seperti `2026-05-05T09:43:18.123Z`, `2026-05-05T09:43:18+07:00`, Unix detik, dan Unix milidetik.
- Konversi instant dengan `Z` atau offset eksplisit ke zona waktu pengguna bila diketahui. Kalau zona waktu tidak diketahui, pertahankan zona sumber atau tanya hanya kalau itu mengubah makna.
- Pertahankan nilai date-only sebagai tanggal. Jangan menggeser nilai date-only lintas zona waktu.
- Tampilkan tanggal absolut. Pakai kata relatif seperti "hari ini", "kemarin", atau "minggu lalu" hanya sebagai pelengkap bila membantu.
- Sertakan tahun kecuali benar-benar redundan dalam tabel kecil tahun yang sama.
- Tampilkan detik dan milidetik hanya kalau memang relevan untuk debugging, audit log, atau urutan event yang berdekatan.

Contoh, dengan zona waktu pengguna Asia/Jakarta (UTC+7):

- Timestamp: `2026-05-05T09:43:18.123Z` → 5 Mei 2026, 16.43
- Nilai date-only: `2026-05-05` → 5 Mei 2026

Kalau timestamp mentah relevan, taruh setelah nilai yang mudah dibaca:

- Dibuat: 5 Mei 2026, 16.43 (mentah: `2026-05-05T09:43:18.123Z`)

## Label Field

Ubah nama field mentah jadi label untuk pengguna:

- `createdAt` → Dibuat
- `updatedAt` → Terakhir diperbarui
- `deletedAt` → Dihapus
- `createdBy` → Dibuat oleh
- `workspaceMemberId` → Anggota workspace
- `name` → Nama
- `keluarga` → Keluarga
- `penduduk` → Penduduk
- `programBantuan` → Program bantuan

Lebih baik pakai label yang tampil di Bades dari metadata bila tersedia. Kalau tidak, pecah camelCase, snake_case, dan kebab-case jadi kata-kata biasa berbahasa Indonesia.

## Format Nilai

Format nilai berdasarkan maknanya:

- **Kosong atau null**: Belum diisi, atau hilangkan kalau field memang tidak relevan.
- **Boolean**: Ya / Tidak.
- **Uang**: sertakan mata uang dan grouping, misalnya Rp 12.450.000 atau IDR 12.450.000 sesuai mata uang record.
- **Persentase**: pakai `%`, bulatkan secukupnya supaya tetap bermakna.
- **URL dan email**: jadikan tautan Markdown yang bisa diklik kalau berguna.
- **ID dan UUID**: sembunyikan secara default kecuali pengguna minta identifier, deduplikasi, debugging, atau referensi persis.
- **Array**: tampilkan jumlah dan nama paling penting, jangan serialisasi array penuh.

## Pengurutan Record

Saat pengguna minta "terbaru", "recent", atau "record terakhir":

- Sebutkan field tanggal mana yang dipakai kalau tidak jelas, misalnya *diurutkan berdasarkan Terakhir diperbarui*.
- Lebih baik pakai `updatedAt` untuk "aktivitas terbaru" dan `createdAt` untuk "record terbaru" kecuali pilihan kata pengguna atau semantik objek mengarah ke tanggal lain.
- Tampilkan kolom tanggal yang dipakai dalam format yang mudah dibaca.
- Kalau beberapa record punya tanggal sama, pertahankan urutan sekunder deterministik seperti nama atau ID.

## Penataan Tabel

Buat tabel mudah dipindai sebelum membuatnya cantik secara visual.

- Pakai penanda alignment Markdown dengan sengaja: kolom teks rata kiri (`:---`), kolom uang/jumlah rata kanan (`---:`), kolom status pendek di tengah hanya kalau itu memang membantu baca (`:---:`).
- Pertahankan nama record di sisi kiri yang konsisten. Kalau baris punya favicon, pakai kolom Ikon sempit khusus diikuti kolom nama-record yang ditautkan.
- Kalau tabel ringkas dan gambar diketahui konsisten kecil, boleh menaruh `![alt](url) [Nama](record-url)` dalam satu sel. Jangan menambahkan emoji atau simbol ekstra sebelum nama.
- Letakkan field format tetap seperti Dibuat, Diperbarui, Jumlah, Sumber di sebelah kanan field lebar variabel seperti Nama, Keluarga, Penduduk, Domain.
- Pakai format tanggal konsisten dalam satu tabel supaya baris rapi, misalnya *5 Mei 2026, 16.43* atau *5 Mei, 16.43*.
- Lebih baik pakai tautan alami daripada kolom tautan ekstra: tautkan nama record ke Bades, tautkan domain atau email hanya kalau tujuan eksternal itu berguna.
- Hindari kolom ID mentah di tabel user-facing biasa. ID itu panjang, dominan secara visual, dan merusak alignment kecuali pengguna minta.

## Pola Markdown

### Tabel ringkas

Pakai tabel ringkas untuk record yang sebanding:

```markdown
Saya menemukan 5 program bantuan terbaru, diurutkan berdasarkan tanggal terakhir diperbarui.

| Nama | Tahap | Jumlah | Terakhir diperbarui |
| :--- | :--- | ---: | :--- |
| [Bantuan Lansia Desa Sukamaju](https://contoh.bades.id/object/programBantuan/record-id-1) | Verifikasi | Rp 12.450.000 | 5 Mei 2026, 16.43 |
| [BLT Petani RW 03](https://contoh.bades.id/object/programBantuan/record-id-2) | Pengajuan | Rp 8.000.000 | 4 Mei 2026, 13.10 |
```

### Blok berlabel

Pakai blok berlabel untuk satu record penting:

```markdown
**[Bantuan Lansia Desa Sukamaju](https://contoh.bades.id/object/programBantuan/record-id-1)**

- Tahap: Verifikasi
- Jumlah: Rp 12.450.000
- Tindak lanjut: Belum diisi
- Terakhir diperbarui: 5 Mei 2026, 16.43
```

## Pengecualian Data Mentah

Tampilkan JSON mentah, timestamp mentah, ID internal, atau objek bersarang utuh hanya saat pengguna minta debugging, ekspor, payload API persis, inspeksi schema, atau perintah yang reproducible. Bahkan saat itu, taruh ringkasan yang mudah dibaca sebelum blok mentah.

Contoh:

> Bantuan Lansia Desa Sukamaju — tahap Verifikasi, Rp 12.450.000, terakhir diperbarui 5 Mei 2026, 16.43. Payload lengkap di bawah:
>
> ```json
> {
>   "id": "record-id-1",
>   "name": "Bantuan Lansia Desa Sukamaju",
>   "stage": "VERIFIKASI",
>   "amountMicros": "12450000000",
>   "currencyCode": "IDR",
>   "updatedAt": "2026-05-05T09:43:18.123Z"
> }
> ```
