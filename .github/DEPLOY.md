# Deploy Bades — Panduan AWS App Runner

Target panduan ini: dari clone repo sampai first deploy berjalan, hanya
butuh **3 hal**: isi GitHub Secrets, jalankan script setup AWS, lalu push.
Tidak ada langkah tersembunyi.

> Catatan repositori: ini adalah repo privat tim Bades, bukan distribusi
> open-source. Panduan deploy di file ini ditujukan untuk operator internal
> tim Bades yang menyiapkan environment AWS milik tim sendiri.

---

## Ringkasan Arsitektur

```
GitHub Actions (build image)
        |
        v
   ECR (bades-staging / bades)
        |
        v
   AWS App Runner (target Dockerfile: bades-aws)
        |
        +-- PostgreSQL (RDS atau managed) di luar container
        +-- Redis (ElastiCache atau managed) di luar container
        +-- HTTPS via custom domain (CNAME di Cloudflare)
```

- Port container: **3000** (`NODE_PORT` default).
- Healthcheck: `GET /healthz` di port `3000`.
- Image target Docker: `bades-aws` (server + frontend statis dalam satu image).
- Database & Redis **tidak** ikut di dalam image, harus disiapkan terpisah.

---

## Step 1: Siapkan AWS (sekali saja)

Pilih salah satu jalur:

### Jalur otomatis (rekomendasi)

Jalankan script setup yang sudah disiapkan di repo:

```bash
bash scripts/setup-aws-bades.sh
```

Script ini akan:

1. Verifikasi `aws` CLI dan kredensial aktif.
2. Membuat ECR repository `bades-staging` dan `bades` (idempotent).
3. Membuat IAM policy `BadesDeployPolicy` dan IAM user `bades-ci`.
4. Mencetak `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` untuk dipindah
   ke GitHub Secrets.
5. (Opsional) Membuat App Runner service `bades-staging` dan `bades`.

Setelah selesai, lewati ke Step 2.

### Jalur manual

Ikuti subbagian 1A–1D di bawah jika Anda ingin kontrol penuh atau script
gagal di satu bagian.

#### 1A. Buat ECR repository

```bash
export AWS_REGION=ap-southeast-1

aws ecr create-repository \
  --repository-name bades-staging \
  --region "$AWS_REGION" \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256

aws ecr create-repository \
  --repository-name bades \
  --region "$AWS_REGION" \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256
```

Catat output `repositoryUri` (formatnya
`<account>.dkr.ecr.<region>.amazonaws.com/<repo>`).

#### 1B. Buat IAM policy + user untuk CI

Simpan JSON berikut ke file `bades-deploy-policy.json` (ganti
`<ACCOUNT_ID>` dan region jika perlu):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EcrAuth",
      "Effect": "Allow",
      "Action": ["ecr:GetAuthorizationToken"],
      "Resource": "*"
    },
    {
      "Sid": "EcrPushPull",
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage",
        "ecr:DescribeImages"
      ],
      "Resource": [
        "arn:aws:ecr:ap-southeast-1:<ACCOUNT_ID>:repository/bades-staging",
        "arn:aws:ecr:ap-southeast-1:<ACCOUNT_ID>:repository/bades"
      ]
    },
    {
      "Sid": "AppRunnerDeploy",
      "Effect": "Allow",
      "Action": [
        "apprunner:DescribeService",
        "apprunner:UpdateService",
        "apprunner:ListServices",
        "apprunner:StartDeployment"
      ],
      "Resource": [
        "arn:aws:apprunner:ap-southeast-1:<ACCOUNT_ID>:service/bades-staging/*",
        "arn:aws:apprunner:ap-southeast-1:<ACCOUNT_ID>:service/bades/*"
      ]
    }
  ]
}
```

Lalu:

```bash
aws iam create-policy \
  --policy-name BadesDeployPolicy \
  --policy-document file://bades-deploy-policy.json

aws iam create-user --user-name bades-ci

aws iam attach-user-policy \
  --user-name bades-ci \
  --policy-arn "arn:aws:iam::<ACCOUNT_ID>:policy/BadesDeployPolicy"

aws iam create-access-key --user-name bades-ci
```

Output `create-access-key` berisi `AccessKeyId` dan `SecretAccessKey` yang
akan dipakai sebagai GitHub Secrets di Step 2.

#### 1C. Buat App Runner service

Untuk staging:

```bash
aws apprunner create-service \
  --service-name bades-staging \
  --region "$AWS_REGION" \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "<ACCOUNT_ID>.dkr.ecr.ap-southeast-1.amazonaws.com/bades-staging:placeholder",
      "ImageRepositoryType": "ECR",
      "ImageConfiguration": {
        "Port": "3000"
      }
    },
    "AutoDeploymentsEnabled": false
  }' \
  --instance-configuration '{"Cpu":"1 vCPU","Memory":"2 GB"}' \
  --health-check-configuration '{
    "Protocol":"HTTP",
    "Path":"/healthz",
    "Interval":10,
    "Timeout":5,
    "HealthyThreshold":1,
    "UnhealthyThreshold":5
  }'
```

Ulangi dengan `--service-name bades` dan repository `bades` untuk production.

Catat **Service ARN** dari output (`arn:aws:apprunner:...:service/.../...`).

> Service pertama akan menolak karena image `:placeholder` belum ada.
> Itu wajar — biarkan service tetap dibuat, push image pertama lewat
> GitHub Actions (Step 3) akan mengisi tag yang valid.

#### 1D. Isi environment variables di App Runner

Buka AWS Console → App Runner → service → Configuration → Edit.

Pakai daftar env var minimum dari
`packages/server/.env.production.example` (atau `.env.staging.example`)
sebagai checklist. Variabel **wajib** untuk first boot:

| Variable | Catatan |
|----------|---------|
| `APP_SECRET` | random string panjang, generate dengan `openssl rand -hex 32` |
| `PG_DATABASE_URL` | URL PostgreSQL (RDS) |
| `REDIS_URL` | URL Redis (ElastiCache) |
| `SERVER_URL` | URL publik service, misal `https://app.bades.id` |
| `FRONTEND_URL` | sama dengan `SERVER_URL` (single image) |
| `NODE_ENV` | `production` |
| `STORAGE_TYPE` | `s3` (produksi) atau `local` (smoke test saja) |

---

## Step 2: Isi GitHub Secrets

Buka GitHub repo → Settings → Environments → buat environment `staging`
dan `production`. Isi secrets berikut **di kedua environment** (atau di
level repository jika tim Anda kecil):

| Secret | Wajib | Contoh |
|--------|-------|--------|
| `AWS_ACCESS_KEY_ID` | ya | `AKIA...` (dari Step 1B) |
| `AWS_SECRET_ACCESS_KEY` | ya | `...` (dari Step 1B) |
| `AWS_REGION` | ya | `ap-southeast-1` |
| `AWS_ECR_STAGING_REPOSITORY_URI` | ya (staging env) | `<acct>.dkr.ecr.ap-southeast-1.amazonaws.com/bades-staging` |
| `AWS_ECR_PRODUCTION_REPOSITORY_URI` | ya (production env) | `<acct>.dkr.ecr.ap-southeast-1.amazonaws.com/bades` |
| `AWS_APPRUNNER_STAGING_SERVICE_ARN` | ya (staging env) | `arn:aws:apprunner:ap-southeast-1:<acct>:service/bades-staging/<id>` |
| `AWS_APPRUNNER_PRODUCTION_SERVICE_ARN` | ya (production env) | `arn:aws:apprunner:ap-southeast-1:<acct>:service/bades/<id>` |

Untuk environment `production`, disarankan aktifkan
**Required reviewers** agar tag deploy butuh approval manual.

---

## Step 3: Trigger Deploy

| Trigger | Target | Cara |
|---------|--------|------|
| Push branch `staging` | Staging | `git push origin staging` |
| Push branch `main` | Staging (sementara, lihat catatan di `deploy.yaml`) | merge PR ke `main` |
| Push tag `v*.*.*` | Production | `git tag v1.0.0 && git push origin v1.0.0` |
| `workflow_dispatch` manual | Pilih staging/production | Actions tab → Deploy to AWS App Runner → Run workflow |

Tag image di ECR:
- Staging: `staging-<sha>`
- Production dari tag git: `v1.2.3` (apa adanya)
- Production via dispatch manual: `manual-<sha12>`

---

## Verifikasi First Deploy

Setelah workflow selesai (~5–10 menit build pertama, lebih cepat setelah
cache GHA terbentuk), pastikan hal berikut:

1. **GitHub Actions hijau** — semua step di job `deploy-staging` atau
   `deploy-production` lolos tanpa error.
2. **Image baru di ECR**:
   ```bash
   aws ecr describe-images \
     --repository-name bades-staging \
     --region ap-southeast-1 \
     --query 'sort_by(imageDetails,&imagePushedAt)[-1].imageTags' \
     --output text
   ```
   Harus muncul tag `staging-<sha>` yang baru.
3. **App Runner status `RUNNING`**:
   ```bash
   aws apprunner describe-service \
     --service-arn "$AWS_APPRUNNER_STAGING_SERVICE_ARN" \
     --region ap-southeast-1 \
     --query 'Service.Status'
   ```
4. **Healthcheck OK**:
   ```bash
   SERVICE_URL=$(aws apprunner describe-service \
     --service-arn "$AWS_APPRUNNER_STAGING_SERVICE_ARN" \
     --region ap-southeast-1 \
     --query 'Service.ServiceUrl' --output text)
   curl -i "https://$SERVICE_URL/healthz"
   # Expected: HTTP/1.1 200 OK
   ```
5. **Frontend reachable**: buka `https://$SERVICE_URL` di browser, layar
   login Bades muncul.
6. **CloudWatch logs** menunjukkan pesan startup Nest `Application is
   running on...` tanpa stack trace fatal.

Kalau salah satu gagal, langsung lompat ke **Troubleshooting** di bawah.

---

## Rollback

App Runner menyimpan riwayat deployment per service. Rollback dilakukan
dengan mengarahkan service ke image tag versi sebelumnya yang masih ada
di ECR.

```bash
# 1. Daftar tag image yang tersedia di ECR (urut waktu push)
aws ecr describe-images \
  --repository-name bades \
  --region ap-southeast-1 \
  --query 'sort_by(imageDetails,&imagePushedAt)[*].{tag:imageTags,pushed:imagePushedAt}' \
  --output table

# 2. Tentukan tag target rollback, misalnya v1.1.0
ROLLBACK_TAG=v1.1.0
ECR_URI=$(aws ecr describe-repositories \
  --repository-names bades --region ap-southeast-1 \
  --query 'repositories[0].repositoryUri' --output text)

# 3. Update service ke tag tersebut
aws apprunner update-service \
  --service-arn "$AWS_APPRUNNER_PRODUCTION_SERVICE_ARN" \
  --region ap-southeast-1 \
  --source-configuration "{
    \"ImageRepository\": {
      \"ImageIdentifier\": \"$ECR_URI:$ROLLBACK_TAG\",
      \"ImageRepositoryType\": \"ECR\",
      \"ImageConfiguration\": {\"Port\": \"3000\"}
    }
  }"

# 4. Tunggu sampai stabil
aws apprunner wait service-updated \
  --service-arn "$AWS_APPRUNNER_PRODUCTION_SERVICE_ARN" \
  --region ap-southeast-1

# 5. Cek versi aktif sekarang
aws apprunner describe-service \
  --service-arn "$AWS_APPRUNNER_PRODUCTION_SERVICE_ARN" \
  --region ap-southeast-1 \
  --query 'Service.SourceConfiguration.ImageRepository.ImageIdentifier' \
  --output text
```

Alternatif via Console: App Runner → service → Deployments → pilih revisi
lama → **Redeploy**.

---

## Domain & SSL (Cloudflare + App Runner)

1. App Runner → service → **Custom domains** → Add domain
   `app.bades.id` (atau subdomain pilihan).
2. Tambah CNAME di Cloudflare ke App Runner URL yang ditunjukkan.
3. Tunggu validasi (beberapa menit). SSL otomatis disediakan App Runner.

> Saat memakai Cloudflare proxy (ikon orange), gunakan mode SSL
> **Full (strict)** agar handshake ke App Runner valid.

---

## Estimasi Biaya Bulanan

| Komponen | Estimasi |
|----------|----------|
| App Runner instance 1 vCPU / 2 GB RAM (scale-to-zero aktif) | ~$5–15 |
| ECR storage 2 repo, ~5 GB/image, 10 image | ~$1–3 |
| Route 53 hosted zone (opsional) | ~$0.50 |
| CloudWatch logs (opsional, jika retention diperpanjang) | ~$0–5 |
| **Total** | **~$10–25/bulan** |

Belum termasuk RDS PostgreSQL dan ElastiCache Redis (tergantung pilihan
instance).

---

## Troubleshooting

### Image pull gagal di App Runner
```bash
aws ecr get-login-password --region ap-southeast-1 \
  | docker login --username AWS \
    --password-stdin <ACCOUNT_ID>.dkr.ecr.ap-southeast-1.amazonaws.com
```
Lalu verifikasi IAM user `bades-ci` punya policy `BadesDeployPolicy`.

### App Runner deployment `FAILED`
- Buka CloudWatch Logs di App Runner → Service → Logs.
- Cek env var `PG_DATABASE_URL`, `APP_SECRET`, `REDIS_URL`.
- Pastikan DB dan Redis reachable dari subnet App Runner.
- Healthcheck `/healthz` harus respond 200 — kalau ada migration error
  pada boot, healthcheck akan timeout dan deployment dianggap gagal.

### Migrasi DB tidak jalan
Entrypoint container menjalankan `database:init:prod` saat schema `core`
belum ada, lalu `command:prod upgrade` setiap boot. Untuk skip:
set env `DISABLE_DB_MIGRATIONS=true` (hanya untuk debugging).

### Workflow stuck di `wait service-updated`
App Runner kadang butuh 5–10 menit untuk transisi `OPERATION_IN_PROGRESS`
→ `RUNNING`. Default timeout AWS CLI cukup. Kalau benar-benar gagal,
service akan turun ke status `CREATE_FAILED` atau `UPDATE_FAILED`.

---

## Branch Protection & Environments (Admin GitHub)

Dilakukan manual oleh admin repo karena memerlukan akses Settings:

- **Branch protection `main`**: require PR review, require status checks
  `ci-server`, `ci-front`, `ci-ui`, `ci-shared`, `ci-emails`, `lint`.
- **Environment `production`**: aktifkan Required reviewers.
- **Secret scanning + push protection**: aktifkan di Settings → Code
  security.
- **`GITHUB_TOKEN` default permissions**: set ke `read`. Workflow ini
  sudah deklarasi `permissions:` minimal di level workflow/job.

---

## Status Audit Terakhir (2026-05-23)

- Action third-party pinned ke commit SHA 40 karakter (cek via API GitHub).
- `DOCKER_TARGET` adalah `bades-aws` (cocok dengan stage final Dockerfile).
- Image tag produksi dibangun via step `Compute image tag` agar tidak
  menghasilkan `refs/tags/v1.2.3` sebagai tag image.
- Healthcheck endpoint: `/healthz` (controller `health.controller.ts`).
- Port container: `3000` (`NODE_PORT` default `config-variables.ts`).
- Waiter App Runner CLI: `service-updated`. Query URL: `Service.ServiceUrl`.

Pipeline siap setelah admin GitHub melengkapi secrets (Step 2), AWS
resources (Step 1), dan App Runner env vars (Step 1D).
