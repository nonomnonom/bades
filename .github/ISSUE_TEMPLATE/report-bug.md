---
name: Laporkan bug
about: Laporkan bug atau regresi fungsional
title: 'Contoh: Di halaman Penduduk, tombol simpan tidak merespons setelah mengisi NIK'
labels: ['type: bug']
assignees: ''

---

## Deskripsi Bug

Deskripsi jelas dan ringkas tentang perilaku yang terjadi saat ini.
Sertakan juga **tangkapan layar** dari aplikasi.

**Contoh:**
```
Di halaman tambah penduduk baru, setelah mengisi NIK dan klik tombol Simpan,
tidak ada respons — tombol tidak bereaksi dan data tidak tersimpan.
[tangkapan layar]
```

## Perilaku yang diharapkan

Deskripsi jelas dan ringkas tentang perilaku yang seharusnya terjadi.

**Contoh:**
```
Setelah klik Simpan, data penduduk baru tersimpan dan halaman kembali ke daftar penduduk.
```

## Masukan teknis

**Contoh:**
```
- Kemungkinan validasi NIK memblokir submit tanpa menampilkan pesan error
- Cek handler onSubmit di formulir PendudukBaru
```
