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
8. **Health check**: path `/health` atau port `2020`

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

## Deployment Triggers

| Trigger | Target | Contoh |
|---------|--------|--------|
| Push ke `staging` branch | Staging | `git push origin staging` |
| Push tag `v*.*.*` | Production | `git tag v1.0.0 && git push origin v1.0.0` |
| Manual via GitHub Actions UI | Staging atau Production | Actions → "Deploy to AWS App Runner" → Run workflow |

---

## Estimasi Biaya Bulanan (App Runner all-in-one)

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

## Arsitektur到最后

```
GitHub Actions (build + push)
        │
        ▼
    ECR (bades-staging / bades)
        │
        ▼
  AWS App Runner
  (all-in-one container:
   NestJS + worker +
   PostgreSQL + Redis)
        │
        ├── Custom Domain
        │     (Cloudflare)
        │
        └── HTTPS
              │
           Users (perangkat desa)
```
