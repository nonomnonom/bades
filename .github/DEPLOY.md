# Deploy Bades — Panduan AWS ECS Fargate Jakarta

Target panduan ini: dari clone repo sampai first deploy berjalan di
**AWS ECS Fargate region Jakarta (`ap-southeast-3`)** dengan VPC, ALB,
ECS cluster, dan auto-scaling siap produksi.

> Catatan repositori: ini adalah repo privat tim Bades. Panduan deploy di file
> ini ditujukan untuk operator internal yang menyiapkan environment AWS milik
> tim Bades sendiri.

---

## Ringkasan Arsitektur

```
GitHub Actions (build image)
        │
        ▼
   ECR (bades) — region ap-southeast-3
        │
        ▼
   ECS Fargate Cluster (bades-cluster)
        ├── bades-staging-service     (desired 1, 0.5 vCPU / 1 GB)
        └── bades-production-service  (desired 2, 1 vCPU / 2 GB, multi-AZ)
                ▲
                │ target group HTTP /healthz
                │
        Application Load Balancer (bades-alb)
                ├── host staging.bades.id  → bades-staging-tg
                └── host app.bades.id      → bades-production-tg (default)
                ▲
                │
        Cloudflare DNS (CNAME → ALB DNS)
        ACM Certificate *.bades.id (listener 443)

   External:
     ─ RDS PostgreSQL (di luar container)
     ─ ElastiCache Redis (di luar container)
     ─ AWS Secrets Manager prefix `bades/staging/...` dan `bades/production/...`
```

- Region produksi: **ap-southeast-3 (Jakarta)**.
- Port container: **3000** (`NODE_PORT` default).
- Healthcheck: `GET /healthz` di port `3000`.
- Image target Docker: `bades-aws`.
- Database, Redis, dan secret sensitif **tidak** masuk image.

---

## Step 1 — Setup AWS (sekali saja)

Pastikan Anda sudah `aws configure` dengan kredensial admin akun
`256269125062` (atau akun produksi Anda) untuk region `ap-southeast-3`.

```bash
AWS_REGION=ap-southeast-3 bash scripts/setup-aws-bades.sh
```

Script ini idempotent (aman diulang) dan akan:

1. Membuat VPC `bades-vpc` (10.20.0.0/16) dengan 2 public subnet (untuk ALB)
   dan 2 private subnet (untuk ECS, opsional) di 2 AZ.
2. Internet Gateway + route table public.
3. (Opsional, default OFF) NAT Gateway. Default: ECS tasks ditempatkan di
   public subnet dengan `assignPublicIp=ENABLED` agar bisa pull image dari
   ECR tanpa biaya NAT. Set `CREATE_NAT_GATEWAY=1` jika ingin private subnet.
4. Security groups: `bades-alb-sg` (80/443 dari dunia) dan `bades-ecs-sg`
   (3000 hanya dari `bades-alb-sg`).
5. ECR repository `bades`.
6. IAM roles `ecsTaskExecutionRole` (managed
   `AmazonECSTaskExecutionRolePolicy` + Secrets Manager read) dan
   `ecsTaskRole` (custom inline: CloudWatch logs, Secrets Manager prefix
   `bades/*`, S3 bucket `bades-*`).
7. IAM user `bades-ci` dengan policy `BadesDeployPolicy` (ECR push, ECS
   update + register task def, ELB describe, IAM pass-role ke 2 role di atas).
8. ALB `bades-alb` + 2 target group (`bades-staging-tg`,
   `bades-production-tg`) + listener 80 (default ke production TG, rule
   host header `staging.bades.id` ke staging TG).
9. ECS cluster `bades-cluster` (Container Insights ON) + CloudWatch log
   group `/ecs/bades-staging` dan `/ecs/bades-production` (retensi 30 hari).
10. Template task definition di `scripts/aws/bades-staging-task.json` dan
    `scripts/aws/bades-production-task.json` (image awal `:placeholder`,
    akan di-render ulang oleh GitHub Actions).
11. Register task definition awal, lalu buat 2 ECS service
    (`bades-staging-service` desired=1, `bades-production-service`
    desired=2) — keduanya akan FAILED sampai image pertama dipush.

Setelah script selesai, salin daftar ARN/URI yang dicetak. Anda juga akan
mendapat `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` untuk user
`bades-ci` jika ini pertama kalinya dijalankan.

---

## Step 2 — ACM Certificate untuk `*.bades.id`

ECS ini menyajikan trafik via ALB. SSL ditangani oleh ALB listener 443
dengan certificate dari ACM. Karena domain `bades.id` dikelola di
Cloudflare (bukan Route 53), validasi ACM perlu dilakukan via DNS manual.

1. Buka AWS Console → Certificate Manager → region **ap-southeast-3** →
   **Request certificate**.
2. Pilih **Request a public certificate**.
3. Domain: `*.bades.id` (atau tambahkan juga `bades.id` jika perlu).
4. Validation method: **DNS validation**.
5. Setelah request dibuat, ACM akan menampilkan 1 CNAME record per domain.
   Salin nama + value-nya.
6. Di Cloudflare dashboard `bades.id`, tambahkan record CNAME persis sama
   (matikan proxy / awan abu-abu untuk record validasi ini).
7. Tunggu status certificate berubah ke **Issued** (biasanya 5–30 menit).
8. Catat certificate ARN: `arn:aws:acm:ap-southeast-3:<acct>:certificate/<id>`.

Setelah issued, tambahkan listener 443 ke ALB:

```bash
aws elbv2 create-listener \
  --region ap-southeast-3 \
  --load-balancer-arn "$(aws elbv2 describe-load-balancers \
     --region ap-southeast-3 --names bades-alb \
     --query 'LoadBalancers[0].LoadBalancerArn' --output text)" \
  --protocol HTTPS --port 443 \
  --certificates CertificateArn=<ACM_CERT_ARN> \
  --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06 \
  --default-actions "Type=forward,TargetGroupArn=$(aws elbv2 describe-target-groups \
     --region ap-southeast-3 --names bades-production-tg \
     --query 'TargetGroups[0].TargetGroupArn' --output text)"
```

Lalu tambahkan rule host header `staging.bades.id` di listener 443 dengan
cara yang sama seperti listener 80 (sudah disiapkan script setup).

> Opsional: redirect listener 80 → 443 dengan
> `aws elbv2 modify-listener --default-actions Type=redirect,RedirectConfig=...`.

---

## Step 3 — GitHub Secrets

Buka GitHub repo → **Settings → Environments** → buat environment
`staging` dan `production`. Isi secrets berikut. Secrets yang sama (misal
`AWS_REGION`, `AWS_ECR_REPOSITORY_URI`) boleh ditaruh di level repository
agar tidak duplikat.

| Secret | Scope | Contoh |
|--------|-------|--------|
| `AWS_ACCESS_KEY_ID` | repo | `AKIA...` (dari Step 1, user `bades-ci`) |
| `AWS_SECRET_ACCESS_KEY` | repo | `...` (dari Step 1) |
| `AWS_REGION` | repo | `ap-southeast-3` |
| `AWS_ECR_REPOSITORY_URI` | repo | `256269125062.dkr.ecr.ap-southeast-3.amazonaws.com/bades` |
| `AWS_ECS_CLUSTER_NAME` | repo | `bades-cluster` |
| `AWS_ECS_STAGING_SERVICE_NAME` | staging | `bades-staging-service` |
| `AWS_ECS_PRODUCTION_SERVICE_NAME` | production | `bades-production-service` |
| `AWS_ECS_STAGING_TASK_DEFINITION` | staging | `bades-staging-task` |
| `AWS_ECS_PRODUCTION_TASK_DEFINITION` | production | `bades-production-task` |
| `AWS_ALB_DNS` | repo | output `bades-alb` (script Step 1 mencetaknya) |

Untuk environment `production`, aktifkan **Required reviewers** agar tag
deploy butuh approval manual.

> Catatan: nama service, cluster, task definition family, file path, dan
> region sudah hard-coded di `.github/workflows/deploy.yaml`. Secrets di
> tabel di atas dipakai oleh script setup, healthcheck, dan dokumentasi —
> beberapa di antaranya akan menjadi relevan saat Anda mengkonfigurasi
> environment baru atau memodifikasi workflow.

---

## Step 4 — AWS Secrets Manager

Task definition mereferensikan env var sensitif via Secrets Manager pada
prefix `bades/<environment>/<KEY>`. Buat semua secret berikut sebelum
deploy pertama:

```bash
REGION=ap-southeast-3
for ENV in staging production; do
  for KEY in APP_SECRET PG_DATABASE_URL REDIS_URL \
             MIDTRANS_SERVER_KEY MIDTRANS_CLIENT_KEY OPENROUTER_API_KEY; do
    aws secretsmanager create-secret \
      --region "$REGION" \
      --name "bades/${ENV}/${KEY}" \
      --secret-string "REPLACE_ME"
  done
done
```

Lalu isi nilainya satu per satu lewat console atau `aws secretsmanager
put-secret-value`. Contoh:

```bash
aws secretsmanager put-secret-value \
  --region ap-southeast-3 \
  --secret-id bades/production/APP_SECRET \
  --secret-string "$(openssl rand -hex 32)"
```

Pakai `packages/server/.env.production.example` dan
`packages/server/.env.staging.example` sebagai checklist nilai yang
perlu diisi. Variable non-sensitif (yang bisa ditaruh di task definition
plaintext) seperti `NODE_ENV`, `SERVER_URL`, `FRONTEND_URL`,
`STORAGE_S3_NAME` ditambahkan langsung di file template task definition
(`scripts/aws/bades-*-task.json`) — edit file itu sebelum commit, atau
register task definition baru manual lalu update service.

> Jika butuh secret tambahan (Sentry DSN, SMTP credential, dll), tambahkan
> entry baru di Secrets Manager dan tambahkan blok `secrets` baru di
> task definition.

---

## Step 5 — DNS Cloudflare → ALB

Di Cloudflare dashboard `bades.id`, tambahkan CNAME:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `app` | `<ALB_DNS>` (mis. `bades-alb-12345.ap-southeast-3.elb.amazonaws.com`) | Proxied (orange) |
| CNAME | `staging` | `<ALB_DNS>` | Proxied (orange) |

Untuk mode proxy Cloudflare, atur SSL/TLS mode ke **Full (strict)** agar
handshake ke ALB tetap valid (ALB sudah punya cert dari ACM).

---

## Step 6 — Trigger First Deploy

| Trigger | Target | Cara |
|---------|--------|------|
| Push branch `staging` | Staging | `git push origin staging` |
| Push tag `v*.*.*` | Production | `git tag v1.0.0 && git push origin v1.0.0` |
| `workflow_dispatch` manual | Staging atau production | Actions → Deploy to AWS ECS Fargate → Run workflow |

Tag image di ECR:
- Staging: `staging-<sha>`
- Production dari tag git: `v1.2.3`
- Production via dispatch manual: `manual-<sha12>`

Workflow akan:

1. Checkout repo (pinned SHA actions/checkout v4.3.1).
2. Configure AWS credentials (pinned aws-actions/configure-aws-credentials v4.2.1).
3. ECR login (pinned aws-actions/amazon-ecr-login v2.0.1).
4. Setup Buildx + build image dari `packages/docker/bades/Dockerfile`
   target `bades-aws`, push ke ECR dengan tag sesuai trigger.
5. Render task definition (pinned amazon-ecs-render-task-definition v1.7.4)
   — meng-update field `image` di file template `scripts/aws/bades-*-task.json`.
6. Deploy ke ECS (pinned amazon-ecs-deploy-task-definition v2.3.0) —
   register revision baru, update service, tunggu `services-stable`
   (max 15 menit staging, 20 menit production).
7. Healthcheck via ALB DNS dengan Host header.
8. Untuk push tag, buat GitHub Release dengan generate notes otomatis.

### Verifikasi First Deploy

1. **GitHub Actions hijau** — semua step lolos tanpa error.
2. **Image di ECR**:
   ```bash
   aws ecr describe-images \
     --repository-name bades \
     --region ap-southeast-3 \
     --query 'sort_by(imageDetails,&imagePushedAt)[-1].imageTags' \
     --output text
   ```
3. **ECS service stable**:
   ```bash
   aws ecs describe-services \
     --cluster bades-cluster --services bades-staging-service \
     --region ap-southeast-3 \
     --query 'services[0].{desired:desiredCount,running:runningCount,status:status,deploy:deployments[0].rolloutState}'
   ```
   `runningCount == desiredCount` dan `rolloutState == COMPLETED`.
4. **Target health**:
   ```bash
   aws elbv2 describe-target-health \
     --target-group-arn "$(aws elbv2 describe-target-groups \
        --region ap-southeast-3 --names bades-staging-tg \
        --query 'TargetGroups[0].TargetGroupArn' --output text)" \
     --region ap-southeast-3 \
     --query 'TargetHealthDescriptions[].TargetHealth.State'
   ```
   Semua target harus `healthy`.
5. **Healthcheck publik**:
   ```bash
   curl -i https://staging.bades.id/healthz
   # Expected: HTTP/2 200
   ```
6. **CloudWatch logs**: buka log group `/ecs/bades-staging` di console,
   verifikasi pesan startup Nest `Application is running on...`.

---

## Step 7 — Database Migration (One-off ECS Task)

Migration utama jalan otomatis saat container boot (entrypoint Docker
menjalankan `command:prod upgrade`). Untuk migration manual / smoke test
dari CI:

```bash
TASK_DEF_ARN=$(aws ecs describe-task-definition \
  --task-definition bades-production-task \
  --region ap-southeast-3 \
  --query 'taskDefinition.taskDefinitionArn' --output text)

SUBNETS=$(aws ec2 describe-subnets --region ap-southeast-3 \
  --filters "Name=tag:Name,Values=bades-public-a,bades-public-b" \
  --query 'Subnets[].SubnetId' --output text | tr '\t' ',')

SG=$(aws ec2 describe-security-groups --region ap-southeast-3 \
  --filters "Name=group-name,Values=bades-ecs-sg" \
  --query 'SecurityGroups[0].GroupId' --output text)

aws ecs run-task \
  --region ap-southeast-3 \
  --cluster bades-cluster \
  --launch-type FARGATE \
  --task-definition "$TASK_DEF_ARN" \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNETS],securityGroups=[$SG],assignPublicIp=ENABLED}" \
  --overrides '{
    "containerOverrides": [{
      "name": "bades",
      "command": ["sh","-c","cd /app/packages/server && yarn command:prod upgrade"]
    }]
  }'
```

---

## Step 8 — Rollback

ECS menyimpan riwayat task definition revision. Rollback = update service
ke revision sebelumnya.

```bash
# 1. List revision yang tersedia
aws ecs list-task-definitions \
  --family-prefix bades-production-task \
  --region ap-southeast-3 \
  --sort DESC

# 2. Update service ke revision lama (mis. :42)
aws ecs update-service \
  --cluster bades-cluster \
  --service bades-production-service \
  --task-definition bades-production-task:42 \
  --region ap-southeast-3

# 3. Tunggu stable
aws ecs wait services-stable \
  --cluster bades-cluster \
  --services bades-production-service \
  --region ap-southeast-3
```

Verifikasi versi aktif:
```bash
aws ecs describe-services \
  --cluster bades-cluster --services bades-production-service \
  --region ap-southeast-3 \
  --query 'services[0].taskDefinition' --output text
```

---

## Step 9 — Monitoring

- **CloudWatch Logs**: `/ecs/bades-staging` dan `/ecs/bades-production`
  (retensi 30 hari). Filter via Logs Insights:
  ```
  fields @timestamp, @message
  | filter @message like /error/i
  | sort @timestamp desc
  | limit 100
  ```
- **Container Insights**: ECS Cluster `bades-cluster` → tab **Metrics**.
  Cek `CPUUtilization`, `MemoryUtilization`, `RunningTaskCount`.
- **ALB metrics**: CloudWatch namespace `AWS/ApplicationELB` → ALB
  `bades-alb`. Cek `HTTPCode_Target_5XX_Count`, `TargetResponseTime`,
  `UnHealthyHostCount`.
- **Sentry**: aplikasi sudah punya `SENTRY_DSN` (lihat env example).
  Aktif setelah `SENTRY_DSN` diisi via Secrets Manager.

---

## Auto-scaling (Opsional, Belum Otomatis)

Untuk menambah application auto-scaling pada production service:

```bash
aws application-autoscaling register-scalable-target \
  --region ap-southeast-3 \
  --service-namespace ecs \
  --resource-id service/bades-cluster/bades-production-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 --max-capacity 6

aws application-autoscaling put-scaling-policy \
  --region ap-southeast-3 \
  --service-namespace ecs \
  --resource-id service/bades-cluster/bades-production-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name cpu-target-tracking \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 60.0,
    "PredefinedMetricSpecification": {"PredefinedMetricType": "ECSServiceAverageCPUUtilization"},
    "ScaleInCooldown": 60,
    "ScaleOutCooldown": 60
  }'
```

---

## Branch Protection & Environments (Admin GitHub)

Dilakukan manual oleh admin repo karena memerlukan akses Settings:

- **Branch protection `main`**: require PR review, required status checks
  `ci-server`, `ci-front`, `ci-ui`, `ci-shared`, `ci-emails`, `lint`.
- **Environment `production`**: aktifkan Required reviewers.
- **Secret scanning + push protection**: aktifkan di Settings → Code security.
- **`GITHUB_TOKEN` default permissions**: set ke `read`. Workflow ini
  sudah deklarasi `permissions:` minimal di level workflow & job.

---

## Troubleshooting

### Task gagal start: `CannotPullContainerError`
- Cek ECS tasks ditempatkan di subnet dengan route ke internet (public
  subnet + `assignPublicIp=ENABLED`, atau private subnet + NAT Gateway).
- Cek IAM execution role punya `AmazonECSTaskExecutionRolePolicy`.

### Task gagal start: `ResourceInitializationError` saat resolve secret
- Cek path Secrets Manager: `arn:aws:secretsmanager:ap-southeast-3:<acct>:secret:bades/<env>/<KEY>-XXXXXX` (suffix random oleh AWS).
- Task definition di repo memakai path tanpa suffix. ECS akan resolve
  prefix match. Pastikan secret memang ada di prefix `bades/<env>/`.
- Execution role butuh `secretsmanager:GetSecretValue` untuk prefix itu —
  sudah di-attach script setup (`SecretsManagerReadWrite` managed policy).

### Target group `unhealthy`
- Container masih boot? Healthcheck grace period 120 detik. Boot Nest +
  migration biasanya 30–90 detik pertama.
- Healthcheck path harus `/healthz` di port 3000.
- Cek CloudWatch log `/ecs/bades-<env>` untuk stack trace saat boot.

### Deploy stuck di `wait-for-service-stability`
- Default timeout workflow: 15 menit staging, 20 menit production.
- ECS akan rollback otomatis jika `minimumHealthyPercent=100` tidak
  tercapai. Cek `aws ecs describe-services` → `deployments[0].failedTasks`.

---

## Status Audit Terakhir (2026-05-24)

- Region produksi: **ap-southeast-3 (Jakarta)** ✅.
- App Runner Singapore: **dropped** (tidak tersedia di Jakarta).
- ECS Fargate cluster + ALB host-based routing.
- Semua third-party action di workflow pinned ke commit SHA 40 karakter.
- Task definition template di `scripts/aws/bades-*-task.json` di-render
  ulang via `amazon-ecs-render-task-definition` saat deploy.
- Secrets sensitif (DB URL, APP_SECRET, Midtrans, OpenRouter) via AWS
  Secrets Manager prefix `bades/<env>/<KEY>`.
- Healthcheck endpoint `/healthz` di port 3000 (`health.controller.ts`).
