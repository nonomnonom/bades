---
name: Tambah fitur / perilaku baru
about: Deskripsikan perubahan produk yang diinginkan
title: 'Contoh: Tambah filter data penduduk berdasarkan wilayah di halaman Demografi'
labels: ''
assignees: ''

---

## Lingkup & Konteks

**Contoh:**
```
Kami sedang mengerjakan peningkatan halaman Demografi.
Tiket ini berfokus pada penambahan filter berdasarkan wilayah (Dusun/RW/RT)
di tabel daftar penduduk.
```

## Perilaku saat ini

Deskripsi jelas dan ringkas tentang perilaku yang ada saat ini.
Sertakan juga **tangkapan layar** dari aplikasi yang sedang berjalan.

**Contoh:**
```
Di halaman Demografi, tabel penduduk menampilkan seluruh data tanpa opsi filter
berdasarkan wilayah.
[tangkapan layar]
```

## Perilaku yang diharapkan

Deskripsi jelas dan ringkas tentang perilaku yang diinginkan.
Sertakan **tautan atau tangkapan layar desain (Figma)** jika tersedia.

**Contoh:**
```
Pengguna harus dapat memfilter daftar penduduk berdasarkan Dusun, RW, atau RT
melalui dropdown filter di atas tabel.
[tangkapan layar desain]
```

## Masukan teknis

**Contoh:**
```
- Tambahkan komponen FilterWilayah di atas tabel PendudukTable
- Hubungkan filter ke query GraphQL yang sudah ada dengan parameter wilayahId
- ...
```
