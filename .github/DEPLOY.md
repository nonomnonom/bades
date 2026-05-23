# Deploy Bades — AWS App Runner Setup Guide

## Prerequisites

- AWS Account (region Singapore: `ap-southeast-1` atau sesuai kebutuhan)
- GitHub repository dengan GitHub Actions enabled
- Domain yang dikelola di Cloudflare (sudah siap)

---

## Step 1: Buat ECR Repositories

ECR repositories untuk staging dan production. Jalankan sekali via AWS CLI:

```bash
# Buat ECR repository untuk staging
aws ecr create-repository \
  --repository-name bades-staging \
  --region ap-southeast-1 \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256

# Buat ECR repository untuk production
aws ecr create-repository \
  --repository-name bades \
  --region ap-southeast-1 \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256

# Catat output URI masing-masing:
#   123456789.dkr.ecr.ap-southeast-1.amazonaws.com/bades-staging
#   123456789.dkr.ecr.ap-southeast-1.amazonaws.com/bades
```

---

## Step 2: Buat App Runner Services

Buka AWS Console → App Runner → Create Service.

### Konfigurasi untuk STAGING

1. **Container image**: pilih ECR, masukkan URI ECR staging
2. **Deployment trigger**: Manual (karena kita trigger via GitHub Actions)
3. **Service name**: `bades-staging`
4. **VPC & networking**: sesuai kebutuhan (minimal public)
5. **Port**: `2020`
6. **Environment variables** (minimal):
   ```
   APP_VERSION=staging
   NODE_ENV=production
   APP_SECRET=<generate random string>
   SERVER_URL=https://staging.bades.id   # sesuaikan
   PG_DATABASE_URL=postgres://user:pass@host:5432/db
   REDIS_URL=redis://host:6379
   STORAGE_TYPE=local
   IS_BILLING_ENABLED=true
   ```
7. **Auto-scaling**: default (scale to 0 aktif)
8. **Health check**: path `/healthz`, port `2020`, protocol `HTTP`

### Konfigurasi untuk PRODUCTION

Sama dengan staging, bedanya:
- Service name: `bades`
- Gunakan ECR URI production
- Domain production: `app.bades.id` atau sesuai

**Catat Service ARN** masing-masing:
```
arn:aws:apprunner:ap-southeast-1:123456789:service/bades-staging/...
arn:aws:apprunner:ap-southeast-1:123456789:service/bades/...
```

---

## Step 3: Konfigurasi GitHub Secrets

Masuk ke GitHub repo → Settings → Secrets and variables → Actions.

### Secrets yang diperlukan

| Secret Name | Description | Contoh |
|-------------|-------------|--------|
| `AWS_ACCESS_KEY_ID` | IAM user dengan akses ECR + App Runner | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Password untuk IAM user di atas | `...` |
| `AWS_REGION` | Region AWS yang dipakai | `ap-southeast-1` |
| `AWS_ECR_STAGING_REPOSITORY_URI` | URI ECR staging lengkap | `123456789.dkr.ecr.ap-southeast-1.amazonaws.com/bades-staging` |
| `AWS_ECR_PRODUCTION_REPOSITORY_URI` | URI ECR production | `123456789.dkr.ecr.ap-southeast-1.amazonaws.com/bades` |
| `AWS_APPRUNNER_STAGING_SERVICE_ARN` | ARN App Runner staging | `arn:aws:apprunner:...` |
| `AWS_APPRUNNER_PRODUCTION_SERVICE_ARN` | ARN App Runner production | `arn:aws:apprunner:...` |

### IAM Policy untuk GitHub Actions user

Buat IAM user dengan policy minimal:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage"
      ],
      "Resource": [
        "arn:aws:ecr:ap-southeast-1:123456789:repository/bades-staging",
        "arn:aws:ecr:ap-southeast-1:123456789:repository/bades"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "apprunner:DescribeService",
        "apprunner:UpdateService",
        "apprunner:ListServices"
      ],
      "Resource": [
        "arn:aws:apprunner:ap-southeast-1:123456789:service/bades-staging/*",
        "arn:aws:apprunner:ap-southeast-1:123456789:service/bades/*"
      ]
    }
  ]
}
```

---

## Step 4: Setup Domain & SSL (Cloudflare + App Runner)

App Runner otomatis menyediakan SSL via Certificate Manager untuk subdomain default `*.awsapprunner.com`. Untuk custom domain:

1. Di App Runner → votre service → Custom domains → Add domain
2. Tambah CNAME di Cloudflare yang diarahkan ke App Runner URL
3. Tunggu propagasi (biasanya beberapa menit)

---

## Step 5: Verifikasi Workflow

Setelah semua di atas selesai, test dengan push ke branch `staging`:

```bash
git checkout -b staging
git push origin staging
```

Workflow akan trigger otomatis:
1. Build Docker image (all-in-one: ~5-10 menit pertama kali, cached setelahnya)
2. Push ke ECR
3. Update App Runner staging

Cek di GitHub Actions tab untuk progress.

---

## Estimasi Biaya Bulanan (App Runner)

| Komponen | Biaya |
|----------|-------|
| App Runner instance (1 vCPU, 2 GB RAM) | ~$5-15/bulan (pay-per-second) |
| ECR storage (2 repos, ~5 GB/image, 10 image) | ~$1-3/bulan |
| Route 53 hosted zone | ~$0.50/bulan |
| CloudWatch logs (opsional) | ~$0-5/bulan |
| **Total estimasi** | **~$10-25/bulan** |

App Runner scale-to-zero berarti kalau tidak ada traffic, biaya bisa jauh lebih kecil.

---

## Troubleshooting

### Image pull gagal
```bash
# Cek apakah IAM user punya akses ECR yang benar
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.ap-southeast-1.amazonaws.com
```

### App Runner deployment gagal
- Cek CloudWatch Logs di App Runner → Service → Logs
- Pastikan environment variables benar (PG_DATABASE_URL, APP_SECRET, dll)
- Pastikan database dan Redis bisa dijangkau dari VPC App Runner

### Want to use a different database?
Ganti environment variable di App Runner service:
- `PG_DATABASE_URL` → point ke RDS PostgreSQL
- `REDIS_URL` → point ke ElastiCache atau broker lain

---

## Arsitektur Akhir

```
GitHub Actions (build + push)
        │
        ▼
    ECR (bades-staging / bades)
        │
        ▼
  AWS App Runner (image target: bades-aws)
   - NestJS API + worker + frontend statis
   - DB & Redis di luar container (RDS / ElastiCache / managed)
        │
        ├── Custom Domain (Cloudflare CNAME)
        │
        └── HTTPS
              │
           Users (perangkat desa)
```

---

## Trigger Deployment

| Trigger | Target | Catatan |
|---------|--------|---------|
| Push branch `staging` | Staging | Auto build + push + update App Runner staging |
| Push branch `main` | (saat ini juga staging) | `main` masih ikut deploy-staging — kalau dirasa terlalu agresif, hilangkan `main` dari `on.push.branches` |
| Push tag `v*.*.*` | Production | `git tag v1.0.0 && git push origin v1.0.0` |
| `workflow_dispatch` | Pilih `staging`/`production` | Actions tab → "Deploy to AWS App Runner" → Run workflow |

Tag image yang dipush ke ECR:
- Staging: `staging-<sha>`
- Production (dari tag): `v1.2.3` (apa adanya dari nama tag git)
- Production (manual dispatch): `manual-<sha12>`

---

## Cara Rollback

App Runner menyimpan riwayat deployment per service. Rollback dilakukan dengan
mengarahkan service ke image-tag versi sebelumnya yang masih ada di ECR.

```bash
# 1. Daftar tag image yang tersedia di ECR
aws ecr describe-images \
  --repository-name bades \
  --region ap-southeast-1 \
  --query 'sort_by(imageDetails,&imagePushedAt)[*].imageTags' \
  --output table

# 2. Update service ke tag versi sebelumnya
aws apprunner update-service \
  --service-arn "$AWS_APPRUNNER_PRODUCTION_SERVICE_ARN" \
  --image-uri "$ECR_URI:v1.1.0" \
  --region ap-southeast-1

# 3. Tunggu sampai stabil
aws apprunner wait service-updated \
  --service-arn "$AWS_APPRUNNER_PRODUCTION_SERVICE_ARN" \
  --region ap-southeast-1
```

Alternatif: lewat Console → App Runner → service → Deployments → pilih revisi
sebelumnya lalu "Redeploy".

---

## Monitoring

- **CloudWatch Logs**: setiap service App Runner otomatis mengirim log ke
  `application` dan `service` log group. Buka dari Console App Runner →
  service → Logs.
- **App Runner metrics**: Console App Runner → service → Metrics
  (request count, latency p50/p99, 4xx/5xx, active instances).
- **Health check**: `/healthz` di port `2020`. Bila gagal terus, App Runner
  akan tandai deployment `FAILED`.
- **Cost & usage**: AWS Billing → Cost Explorer, filter service `App Runner`
  dan `EC2 Container Registry`.

---

## Rekomendasi Branding Pipeline GitHub (admin UI)

Konfigurasi berikut dilakukan manual oleh admin repo GitHub karena memerlukan
hak akses Settings dan tidak boleh di-otomasikan tanpa review:

- **Branch protection `main`**: require pull request review, require status
  checks `ci-server`, `ci-front`, `ci-ui`, `ci-shared`, `ci-emails`,
  `lint`. Pastikan checks tersebut sudah stabil HIJAU minimal beberapa
  PR terakhir sebelum dijadikan required.
- **Environment `staging` dan `production`** di Settings → Environments,
  isi GitHub secrets sesuai tabel di Step 3. `production` boleh diberi
  required reviewer agar tag deploy minta approval manual.
- **Secret scanning + push protection**: aktifkan di Settings → Code security.
- **GITHUB_TOKEN default permissions**: set ke `read` di organisasi/repo.
  Workflow ini sudah deklarasi `permissions:` minimal di level workflow.

---

## Status Audit (2026-05-23)

Hasil audit terakhir oleh operator-github-bades:

- Semua action third-party sudah pinned ke 40-char commit SHA hasil dari
  GitHub API. Sebelumnya beberapa SHA tertulis bersifat fabricated (422 saat
  divalidasi), termasuk `softprops/action-gh-release` yang sekarang dipin ke
  `7b4da11513bf3f43f9999e90eabced41ab8bb048` (v2.2.0).
- `DOCKER_TARGET` dikoreksi dari `bades-app-dev` (tidak ada di Dockerfile) ke
  `bades-aws`.
- Logika `IMAGE_TAG` produksi dipisah ke step `Compute image tag` agar tidak
  menghasilkan tag invalid `refs/tags/v1.2.3`.
- Endpoint healthcheck adalah `/healthz`, bukan `/health`.
- `aws apprunner wait service-active` diganti ke `service-updated`
  (waiter resmi App Runner CLI). Query `Service.Service.Url` dikoreksi ke
  `Service.ServiceUrl`.

Pipeline siap dijalankan setelah admin GitHub melengkapi:
1. Secrets di environment `staging` dan `production`
2. ECR repos + IAM user + policy sesuai Step 1–3
3. App Runner services dengan healthcheck `/healthz`
