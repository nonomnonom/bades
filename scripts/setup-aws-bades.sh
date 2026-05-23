#!/usr/bin/env bash
# setup-aws-bades.sh
# Idempotent setup script untuk first deploy Bades ke AWS App Runner.
#
# Yang dilakukan:
#   1. Verifikasi AWS CLI + kredensial.
#   2. Buat ECR repository `bades-staging` dan `bades` (skip kalau sudah ada).
#   3. Buat IAM policy `BadesDeployPolicy` + IAM user `bades-ci`.
#   4. Print AWS access key untuk dipindah ke GitHub Secrets.
#   5. (Opsional) Buat App Runner service `bades-staging` dan `bades`.
#
# Pemakaian:
#   AWS_REGION=ap-southeast-1 bash scripts/setup-aws-bades.sh
#
# Variabel opsional:
#   AWS_REGION              default: ap-southeast-1
#   CREATE_APPRUNNER        default: 0 (set 1 untuk auto-create service)
#   SKIP_ACCESS_KEY         default: 0 (set 1 untuk skip create-access-key)
#
# Script ini aman dijalankan ulang. Resource yang sudah ada tidak dibuat lagi.

set -euo pipefail

AWS_REGION="${AWS_REGION:-ap-southeast-1}"
CREATE_APPRUNNER="${CREATE_APPRUNNER:-0}"
SKIP_ACCESS_KEY="${SKIP_ACCESS_KEY:-0}"
POLICY_NAME="BadesDeployPolicy"
USER_NAME="bades-ci"
ECR_REPOS=("bades-staging" "bades")

bold()  { printf '\033[1m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
yellow(){ printf '\033[33m%s\033[0m\n' "$*"; }
red()   { printf '\033[31m%s\033[0m\n' "$*" >&2; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { red "Butuh '$1' di PATH"; exit 1; }
}

bold "==> Verifikasi AWS CLI dan kredensial"
require_cmd aws
require_cmd jq
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null) || {
  red "AWS CLI belum dikonfigurasi atau kredensial invalid."
  red "Jalankan: aws configure"
  exit 1
}
green "Account ID : $ACCOUNT_ID"
green "Region     : $AWS_REGION"
echo

bold "==> 1. ECR repositories"
for REPO in "${ECR_REPOS[@]}"; do
  if aws ecr describe-repositories \
        --repository-names "$REPO" \
        --region "$AWS_REGION" >/dev/null 2>&1; then
    yellow "ECR repo '$REPO' sudah ada, skip."
  else
    aws ecr create-repository \
      --repository-name "$REPO" \
      --region "$AWS_REGION" \
      --image-scanning-configuration scanOnPush=true \
      --encryption-configuration encryptionType=AES256 >/dev/null
    green "ECR repo '$REPO' dibuat."
  fi
done

ECR_URI_STAGING="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/bades-staging"
ECR_URI_PROD="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/bades"
echo

bold "==> 2. IAM policy '${POLICY_NAME}'"
POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/${POLICY_NAME}"
POLICY_DOC=$(cat <<JSON
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
        "arn:aws:ecr:${AWS_REGION}:${ACCOUNT_ID}:repository/bades-staging",
        "arn:aws:ecr:${AWS_REGION}:${ACCOUNT_ID}:repository/bades"
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
        "arn:aws:apprunner:${AWS_REGION}:${ACCOUNT_ID}:service/bades-staging/*",
        "arn:aws:apprunner:${AWS_REGION}:${ACCOUNT_ID}:service/bades/*"
      ]
    }
  ]
}
JSON
)

if aws iam get-policy --policy-arn "$POLICY_ARN" >/dev/null 2>&1; then
  yellow "IAM policy '${POLICY_NAME}' sudah ada, skip create."
else
  aws iam create-policy \
    --policy-name "${POLICY_NAME}" \
    --policy-document "$POLICY_DOC" >/dev/null
  green "IAM policy '${POLICY_NAME}' dibuat."
fi
echo

bold "==> 3. IAM user '${USER_NAME}'"
if aws iam get-user --user-name "$USER_NAME" >/dev/null 2>&1; then
  yellow "IAM user '${USER_NAME}' sudah ada, skip create."
else
  aws iam create-user --user-name "$USER_NAME" >/dev/null
  green "IAM user '${USER_NAME}' dibuat."
fi

aws iam attach-user-policy \
  --user-name "$USER_NAME" \
  --policy-arn "$POLICY_ARN" >/dev/null
green "Policy '${POLICY_NAME}' attached ke user '${USER_NAME}'."
echo

if [ "$SKIP_ACCESS_KEY" != "1" ]; then
  bold "==> 4. Buat access key"
  EXISTING_KEYS=$(aws iam list-access-keys --user-name "$USER_NAME" \
    --query 'AccessKeyMetadata[].AccessKeyId' --output text)
  if [ -n "$EXISTING_KEYS" ]; then
    yellow "User '${USER_NAME}' sudah punya access key:"
    yellow "  $EXISTING_KEYS"
    yellow "Skip pembuatan key baru. Set SKIP_ACCESS_KEY=0 dan hapus key lama"
    yellow "kalau ingin generate baru."
  else
    KEY_JSON=$(aws iam create-access-key --user-name "$USER_NAME")
    AKID=$(echo "$KEY_JSON" | jq -r '.AccessKey.AccessKeyId')
    SECRET=$(echo "$KEY_JSON" | jq -r '.AccessKey.SecretAccessKey')
    green "Access key dibuat:"
    echo
    echo "  AWS_ACCESS_KEY_ID     = $AKID"
    echo "  AWS_SECRET_ACCESS_KEY = $SECRET"
    echo
    yellow "Simpan kedua nilai itu sekarang. Secret tidak bisa ditampilkan lagi."
  fi
  echo
fi

if [ "$CREATE_APPRUNNER" = "1" ]; then
  bold "==> 5. App Runner services"
  for STAGE in staging production; do
    case "$STAGE" in
      staging)    SVC_NAME="bades-staging"; ECR_URI="$ECR_URI_STAGING" ;;
      production) SVC_NAME="bades";         ECR_URI="$ECR_URI_PROD" ;;
    esac

    EXISTING=$(aws apprunner list-services \
      --region "$AWS_REGION" \
      --query "ServiceSummaryList[?ServiceName=='$SVC_NAME'].ServiceArn" \
      --output text)
    if [ -n "$EXISTING" ] && [ "$EXISTING" != "None" ]; then
      yellow "App Runner service '$SVC_NAME' sudah ada: $EXISTING"
      continue
    fi

    SOURCE_CONFIG=$(cat <<JSON
{
  "ImageRepository": {
    "ImageIdentifier": "${ECR_URI}:placeholder",
    "ImageRepositoryType": "ECR",
    "ImageConfiguration": { "Port": "3000" }
  },
  "AutoDeploymentsEnabled": false
}
JSON
)
    HEALTH_CONFIG='{"Protocol":"HTTP","Path":"/healthz","Interval":10,"Timeout":5,"HealthyThreshold":1,"UnhealthyThreshold":5}'
    INSTANCE_CONFIG='{"Cpu":"1 vCPU","Memory":"2 GB"}'

    aws apprunner create-service \
      --service-name "$SVC_NAME" \
      --region "$AWS_REGION" \
      --source-configuration "$SOURCE_CONFIG" \
      --instance-configuration "$INSTANCE_CONFIG" \
      --health-check-configuration "$HEALTH_CONFIG" >/dev/null || {
        red "Gagal membuat App Runner '$SVC_NAME'. Pastikan IAM role default"
        red "App Runner sudah ada (AWSServiceRoleForAppRunner)."
      }
    green "App Runner service '$SVC_NAME' dibuat (status awal akan FAILED"
    green "  sampai image pertama dipush dari GitHub Actions)."
  done
  echo
fi

bold "==> Selesai"
echo "GitHub Secrets yang perlu di-set:"
echo
cat <<INFO
  AWS_REGION                          = ${AWS_REGION}
  AWS_ECR_STAGING_REPOSITORY_URI      = ${ECR_URI_STAGING}
  AWS_ECR_PRODUCTION_REPOSITORY_URI   = ${ECR_URI_PROD}
  AWS_APPRUNNER_STAGING_SERVICE_ARN   = (cek di Console App Runner)
  AWS_APPRUNNER_PRODUCTION_SERVICE_ARN= (cek di Console App Runner)
  AWS_ACCESS_KEY_ID                   = (dari step 4 di atas)
  AWS_SECRET_ACCESS_KEY               = (dari step 4 di atas)
INFO
echo
echo "Lanjut ke .github/DEPLOY.md Step 2 untuk mengisi GitHub Secrets."
