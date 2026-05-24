<p align="center">
  <img src="./packages/front/public/bd.svg" width="100px" alt="Logo Bades.id" />
</p>

<h2 align="center">Sistem Informasi Desa untuk Indonesia</h2>

<p align="center">
  <a href="https://bades.id">Situs Web</a>
  |
  <a href="https://bades.id/kontak">Hubungi Kami</a>
</p>

<br />

# Tentang Bades.id

Bades.id adalah Sistem Informasi Desa (SID) yang dirancang untuk pekerjaan
sehari-hari perangkat desa di Indonesia. Bades.id membantu balai desa mengelola
data warga, layanan surat, keuangan desa, program bantuan sosial, serta aset
dan kelembagaan desa dalam satu sistem yang mudah digunakan.

Bades.id disediakan sebagai **layanan terkelola**. Tim balai desa cukup memakai
produknya untuk tugas administrasi, tanpa perlu mengurus server, pemasangan,
atau pemeliharaan teknis.

<br />

# Mulai Menggunakan

Cara tercepat untuk memulai adalah mendaftar di [bades.id](https://bades.id).
Workspace desa Anda siap dalam hitungan menit, selalu diperbarui, dan tidak ada
infrastruktur yang perlu Anda kelola sendiri.

<br />

# Yang Anda Dapatkan

Bades.id menyatukan tugas administrasi desa ke dalam beberapa domain utama:

- **Demografi & Wilayah** - data Penduduk, Keluarga/KK, Rumah Tangga, dan
  pembagian wilayah RT/RW/Dusun.
- **Pemerintahan Desa** - jabatan, periode jabatan, dan lembaga desa.
- **Pelayanan Surat** - jenis surat, permohonan layanan warga, serta surat
  masuk dan surat keluar.
- **Keuangan Desa** - APBDes, bidang anggaran, kegiatan, realisasi, dan sumber
  dana.
- **Program Sosial & Bantuan** - program bantuan, penerima bantuan, dan
  posyandu.
- **Aset & Ekonomi Desa** - aset desa, bidang tanah, UMKM, dan kegiatan desa.

Setiap desa mendapat dashboard, peran pengguna, dan alur kerja yang dapat
disesuaikan dengan kebutuhan administrasinya.

<br />

---

# Catatan Internal

Bagian ini ditujukan untuk tim pengembang internal Bades dan bukan untuk
audiens umum. Repositori ini adalah repo privat tim Bades; bukan distribusi
open-source atau proyek komunitas. Kontribusi dari luar tim tidak dibuka.

## Stack Teknologi

- TypeScript
- Nx (monorepo)
- NestJS, BullMQ, PostgreSQL, Redis
- React, Jotai, Linaria

## Deploy via Docker

Stack runtime Bades: `packages/docker/`. Berisi `docker-compose.yml`
(server + worker + Postgres + Redis), `docker-compose.dev.yml` (Postgres
+ Redis only untuk dev lokal), `Makefile`, dan `bades/Dockerfile`.

### Lokal — build & run image produksi

```bash
# Bangun image
make -C packages/docker prod-build

# Run stack lengkap (server + worker + db + redis)
cd packages/docker
cp .env.example .env  # isi APP_SECRET, ENCRYPTION_KEY, dll
docker compose up -d

# Cek health
curl http://localhost:3000/healthz
```

### Lokal — hanya Postgres + Redis (development against source)

```bash
docker compose -f packages/docker/docker-compose.dev.yml up -d
# lalu jalankan server + front dari source seperti biasa:
yarn start
```

### Production deploy

Pakai image yang sama (build dari Dockerfile target `bades`) ke host
Docker apapun. Setup untuk single-server production akan ditambahkan
saat infrastruktur final dipilih.

Panduan operasional internal: [`.github/DEPLOY.md`](./.github/DEPLOY.md).

