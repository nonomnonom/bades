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

## Deploy ke AWS App Runner

Panduan lengkap ada di [`.github/DEPLOY.md`](./.github/DEPLOY.md).
Ringkas, hanya 3 langkah untuk first deploy:

1. **Setup AWS** — jalankan sekali dari mesin operator yang sudah
   `aws configure`:
   ```bash
   AWS_REGION=ap-southeast-1 bash scripts/setup-aws-bades.sh
   ```
   Script ini membuat ECR repo `bades-staging` + `bades`, IAM policy
   `BadesDeployPolicy`, IAM user `bades-ci`, dan mencetak access key.
2. **Isi GitHub Secrets** — di Settings → Environments (`staging` dan
   `production`), isi 7 secret: `AWS_ACCESS_KEY_ID`,
   `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`,
   `AWS_ECR_STAGING_REPOSITORY_URI`,
   `AWS_ECR_PRODUCTION_REPOSITORY_URI`,
   `AWS_APPRUNNER_STAGING_SERVICE_ARN`,
   `AWS_APPRUNNER_PRODUCTION_SERVICE_ARN`. Untuk env var App Runner,
   pakai [`packages/server/.env.staging.example`](./packages/server/.env.staging.example)
   dan [`packages/server/.env.production.example`](./packages/server/.env.production.example)
   sebagai checklist.
3. **Push** — `git push origin staging` untuk deploy staging,
   `git tag v1.0.0 && git push origin v1.0.0` untuk produksi.

