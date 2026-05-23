#!/usr/bin/env bash
# setup-aws-bades.sh
# Idempotent setup script untuk first deploy Bades ke AWS ECS Fargate
# di region Jakarta (ap-southeast-3).
#
# Topology yang dibuat:
#   - VPC bades-vpc (10.20.0.0/16)
#     - 2 public subnets (10.20.1.0/24, 10.20.2.0/24) di AZ a + b → ALB
#     - 2 private subnets (10.20.11.0/24, 10.20.12.0/24) di AZ a + b → ECS tasks
#     - 1 Internet Gateway, 1 NAT Gateway (opsional, default OFF agar hemat)
#   - Security groups: bades-alb-sg (80/443 dunia) dan bades-ecs-sg (3000 dari ALB SG)
#   - ECR repository: bades
#   - IAM roles: ecsTaskExecutionRole, ecsTaskRole (custom inline)
#   - IAM user: bades-ci + access key (output di akhir)
#   - ALB: bades-alb + listener 80 + 2 target group (staging, production)
#   - ECS Cluster: bades-cluster + 2 services (staging desired=1, production desired=2)
#
# Pemakaian:
#   bash scripts/setup-aws-bades.sh
#
# Variabel opsional:
#   AWS_REGION           default: ap-southeast-3
#   CREATE_NAT_GATEWAY   default: 0 (jika 1, pakai private subnet + NAT untuk ECS)
#   SKIP_ACCESS_KEY      default: 0
#   SKIP_ECS_SERVICES    default: 0 (jika 1, lewati create ECS services)
#
# Script ini idempotent. Jalankan ulang aman.

set -euo pipefail

# Hindari Git Bash / MSYS mengkonversi argumen yang dimulai dengan '/'
# menjadi path Windows (mis. '/healthz' → 'C:/Program Files/Git/healthz').
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL='*'

AWS_REGION="${AWS_REGION:-ap-southeast-3}"
CREATE_NAT_GATEWAY="${CREATE_NAT_GATEWAY:-0}"
SKIP_ACCESS_KEY="${SKIP_ACCESS_KEY:-0}"
SKIP_ECS_SERVICES="${SKIP_ECS_SERVICES:-0}"

VPC_NAME="bades-vpc"
VPC_CIDR="10.20.0.0/16"
SUBNET_PUBLIC_A_CIDR="10.20.1.0/24"
SUBNET_PUBLIC_B_CIDR="10.20.2.0/24"
SUBNET_PRIVATE_A_CIDR="10.20.11.0/24"
SUBNET_PRIVATE_B_CIDR="10.20.12.0/24"
AZ_A="${AWS_REGION}a"
AZ_B="${AWS_REGION}b"

CLUSTER_NAME="bades-cluster"
ALB_NAME="bades-alb"
TG_STAGING_NAME="bades-staging-tg"
TG_PRODUCTION_NAME="bades-production-tg"
SERVICE_STAGING="bades-staging-service"
SERVICE_PRODUCTION="bades-production-service"
ECR_REPO="bades"

EXECUTION_ROLE="ecsTaskExecutionRole"
TASK_ROLE="ecsTaskRole"
TASK_ROLE_POLICY="BadesTaskRolePolicy"
CI_USER="bades-ci"
CI_POLICY="BadesDeployPolicy"

bold()   { printf '\033[1m%s\033[0m\n' "$*" >&2; }
green()  { printf '\033[32m%s\033[0m\n' "$*" >&2; }
yellow() { printf '\033[33m%s\033[0m\n' "$*" >&2; }
red()    { printf '\033[31m%s\033[0m\n' "$*" >&2; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { red "Butuh '$1' di PATH"; exit 1; }
}

bold "==> 0. Verifikasi AWS CLI & kredensial"
require_cmd aws
require_cmd jq
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null) || {
  red "AWS CLI belum dikonfigurasi. Jalankan: aws configure"
  exit 1
}
green "Account ID : $ACCOUNT_ID"
green "Region     : $AWS_REGION"
echo

# ─────────────────────────────────────────────────────────────────────────────
# 1. VPC + subnets + IGW + route tables
# ─────────────────────────────────────────────────────────────────────────────
bold "==> 1. VPC $VPC_NAME"
VPC_ID=$(aws ec2 describe-vpcs --region "$AWS_REGION" \
  --filters "Name=tag:Name,Values=$VPC_NAME" \
  --query 'Vpcs[0].VpcId' --output text)
if [ "$VPC_ID" = "None" ] || [ -z "$VPC_ID" ]; then
  VPC_ID=$(aws ec2 create-vpc --region "$AWS_REGION" \
    --cidr-block "$VPC_CIDR" \
    --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=$VPC_NAME}]" \
    --query 'Vpc.VpcId' --output text)
  aws ec2 modify-vpc-attribute --region "$AWS_REGION" \
    --vpc-id "$VPC_ID" --enable-dns-hostnames >/dev/null
  green "VPC dibuat : $VPC_ID"
else
  yellow "VPC sudah ada : $VPC_ID"
fi

ensure_subnet() {
  local name="$1" az="$2" cidr="$3" public="$4"
  local sid
  sid=$(aws ec2 describe-subnets --region "$AWS_REGION" \
    --filters "Name=tag:Name,Values=$name" "Name=vpc-id,Values=$VPC_ID" \
    --query 'Subnets[0].SubnetId' --output text)
  if [ "$sid" = "None" ] || [ -z "$sid" ]; then
    sid=$(aws ec2 create-subnet --region "$AWS_REGION" \
      --vpc-id "$VPC_ID" --cidr-block "$cidr" --availability-zone "$az" \
      --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$name}]" \
      --query 'Subnet.SubnetId' --output text)
    green "Subnet dibuat : $name = $sid"
  else
    yellow "Subnet sudah ada : $name = $sid"
  fi
  if [ "$public" = "1" ]; then
    aws ec2 modify-subnet-attribute --region "$AWS_REGION" \
      --subnet-id "$sid" --map-public-ip-on-launch >/dev/null || true
  fi
  echo "$sid"
}

SUBNET_PUB_A=$(ensure_subnet "bades-public-a" "$AZ_A" "$SUBNET_PUBLIC_A_CIDR" 1)
SUBNET_PUB_B=$(ensure_subnet "bades-public-b" "$AZ_B" "$SUBNET_PUBLIC_B_CIDR" 1)
SUBNET_PRV_A=$(ensure_subnet "bades-private-a" "$AZ_A" "$SUBNET_PRIVATE_A_CIDR" 0)
SUBNET_PRV_B=$(ensure_subnet "bades-private-b" "$AZ_B" "$SUBNET_PRIVATE_B_CIDR" 0)

# Internet Gateway
IGW_ID=$(aws ec2 describe-internet-gateways --region "$AWS_REGION" \
  --filters "Name=attachment.vpc-id,Values=$VPC_ID" \
  --query 'InternetGateways[0].InternetGatewayId' --output text)
if [ "$IGW_ID" = "None" ] || [ -z "$IGW_ID" ]; then
  IGW_ID=$(aws ec2 create-internet-gateway --region "$AWS_REGION" \
    --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=bades-igw}]" \
    --query 'InternetGateway.InternetGatewayId' --output text)
  aws ec2 attach-internet-gateway --region "$AWS_REGION" \
    --internet-gateway-id "$IGW_ID" --vpc-id "$VPC_ID" >/dev/null
  green "IGW dibuat : $IGW_ID"
else
  yellow "IGW sudah ada : $IGW_ID"
fi

# Public route table
RT_PUBLIC=$(aws ec2 describe-route-tables --region "$AWS_REGION" \
  --filters "Name=vpc-id,Values=$VPC_ID" "Name=tag:Name,Values=bades-rt-public" \
  --query 'RouteTables[0].RouteTableId' --output text)
if [ "$RT_PUBLIC" = "None" ] || [ -z "$RT_PUBLIC" ]; then
  RT_PUBLIC=$(aws ec2 create-route-table --region "$AWS_REGION" \
    --vpc-id "$VPC_ID" \
    --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=bades-rt-public}]" \
    --query 'RouteTable.RouteTableId' --output text)
  aws ec2 create-route --region "$AWS_REGION" \
    --route-table-id "$RT_PUBLIC" \
    --destination-cidr-block "0.0.0.0/0" \
    --gateway-id "$IGW_ID" >/dev/null
  aws ec2 associate-route-table --region "$AWS_REGION" \
    --route-table-id "$RT_PUBLIC" --subnet-id "$SUBNET_PUB_A" >/dev/null
  aws ec2 associate-route-table --region "$AWS_REGION" \
    --route-table-id "$RT_PUBLIC" --subnet-id "$SUBNET_PUB_B" >/dev/null
  green "Public route table dibuat : $RT_PUBLIC"
else
  yellow "Public route table sudah ada : $RT_PUBLIC"
fi

# NAT Gateway (opsional). Tanpa NAT, ECS tasks akan ditempatkan di public subnet
# dengan assign-public-ip ENABLED agar bisa pull image dari ECR.
NAT_ID=""
if [ "$CREATE_NAT_GATEWAY" = "1" ]; then
  NAT_ID=$(aws ec2 describe-nat-gateways --region "$AWS_REGION" \
    --filter "Name=vpc-id,Values=$VPC_ID" "Name=state,Values=available,pending" \
    --query 'NatGateways[0].NatGatewayId' --output text)
  if [ "$NAT_ID" = "None" ] || [ -z "$NAT_ID" ]; then
    EIP_ALLOC=$(aws ec2 allocate-address --region "$AWS_REGION" --domain vpc \
      --query 'AllocationId' --output text)
    NAT_ID=$(aws ec2 create-nat-gateway --region "$AWS_REGION" \
      --subnet-id "$SUBNET_PUB_A" --allocation-id "$EIP_ALLOC" \
      --tag-specifications "ResourceType=natgateway,Tags=[{Key=Name,Value=bades-nat}]" \
      --query 'NatGateway.NatGatewayId' --output text)
    green "NAT Gateway dibuat : $NAT_ID (tunggu state available sebelum lanjut)"
    aws ec2 wait nat-gateway-available --region "$AWS_REGION" --nat-gateway-ids "$NAT_ID"
  else
    yellow "NAT Gateway sudah ada : $NAT_ID"
  fi

  RT_PRIVATE=$(aws ec2 describe-route-tables --region "$AWS_REGION" \
    --filters "Name=vpc-id,Values=$VPC_ID" "Name=tag:Name,Values=bades-rt-private" \
    --query 'RouteTables[0].RouteTableId' --output text)
  if [ "$RT_PRIVATE" = "None" ] || [ -z "$RT_PRIVATE" ]; then
    RT_PRIVATE=$(aws ec2 create-route-table --region "$AWS_REGION" \
      --vpc-id "$VPC_ID" \
      --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=bades-rt-private}]" \
      --query 'RouteTable.RouteTableId' --output text)
    aws ec2 create-route --region "$AWS_REGION" \
      --route-table-id "$RT_PRIVATE" \
      --destination-cidr-block "0.0.0.0/0" \
      --nat-gateway-id "$NAT_ID" >/dev/null
    aws ec2 associate-route-table --region "$AWS_REGION" \
      --route-table-id "$RT_PRIVATE" --subnet-id "$SUBNET_PRV_A" >/dev/null
    aws ec2 associate-route-table --region "$AWS_REGION" \
      --route-table-id "$RT_PRIVATE" --subnet-id "$SUBNET_PRV_B" >/dev/null
    green "Private route table + NAT route dibuat : $RT_PRIVATE"
  else
    yellow "Private route table sudah ada : $RT_PRIVATE"
  fi
  ECS_SUBNETS="$SUBNET_PRV_A,$SUBNET_PRV_B"
  ECS_ASSIGN_PUBLIC_IP="DISABLED"
else
  yellow "CREATE_NAT_GATEWAY=0 → ECS tasks akan ditempatkan di public subnet"
  yellow "dengan assignPublicIp=ENABLED (hemat NAT, tetap valid untuk awal)."
  ECS_SUBNETS="$SUBNET_PUB_A,$SUBNET_PUB_B"
  ECS_ASSIGN_PUBLIC_IP="ENABLED"
fi
echo

# ─────────────────────────────────────────────────────────────────────────────
# 2. Security groups
# ─────────────────────────────────────────────────────────────────────────────
bold "==> 2. Security groups"
ensure_sg() {
  local name="$1" desc="$2"
  local sg
  sg=$(aws ec2 describe-security-groups --region "$AWS_REGION" \
    --filters "Name=group-name,Values=$name" "Name=vpc-id,Values=$VPC_ID" \
    --query 'SecurityGroups[0].GroupId' --output text)
  if [ "$sg" = "None" ] || [ -z "$sg" ]; then
    sg=$(aws ec2 create-security-group --region "$AWS_REGION" \
      --group-name "$name" --description "$desc" --vpc-id "$VPC_ID" \
      --query 'GroupId' --output text)
    green "SG dibuat : $name = $sg"
  else
    yellow "SG sudah ada : $name = $sg"
  fi
  echo "$sg"
}

ALB_SG=$(ensure_sg "bades-alb-sg" "Bades ALB ingress")
ECS_SG=$(ensure_sg "bades-ecs-sg" "Bades ECS tasks ingress dari ALB")

# ALB SG: izinkan 80 dan 443 dari mana saja
aws ec2 authorize-security-group-ingress --region "$AWS_REGION" \
  --group-id "$ALB_SG" --protocol tcp --port 80 --cidr 0.0.0.0/0 2>/dev/null || true
aws ec2 authorize-security-group-ingress --region "$AWS_REGION" \
  --group-id "$ALB_SG" --protocol tcp --port 443 --cidr 0.0.0.0/0 2>/dev/null || true

# ECS SG: izinkan 3000 hanya dari ALB SG
aws ec2 authorize-security-group-ingress --region "$AWS_REGION" \
  --group-id "$ECS_SG" --protocol tcp --port 3000 \
  --source-group "$ALB_SG" 2>/dev/null || true

echo

# ─────────────────────────────────────────────────────────────────────────────
# 3. ECR repository
# ─────────────────────────────────────────────────────────────────────────────
bold "==> 3. ECR repository '$ECR_REPO'"
if aws ecr describe-repositories --region "$AWS_REGION" \
    --repository-names "$ECR_REPO" >/dev/null 2>&1; then
  yellow "ECR repo '$ECR_REPO' sudah ada."
else
  aws ecr create-repository --region "$AWS_REGION" \
    --repository-name "$ECR_REPO" \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256 >/dev/null
  green "ECR repo '$ECR_REPO' dibuat."
fi
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"
echo

# ─────────────────────────────────────────────────────────────────────────────
# 4. IAM roles & user
# ─────────────────────────────────────────────────────────────────────────────
bold "==> 4. IAM roles"

ECS_TRUST=$(cat <<'JSON'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "ecs-tasks.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
JSON
)

ensure_role() {
  local name="$1" trust="$2"
  if aws iam get-role --role-name "$name" >/dev/null 2>&1; then
    yellow "IAM role '$name' sudah ada."
  else
    aws iam create-role --role-name "$name" \
      --assume-role-policy-document "$trust" >/dev/null
    green "IAM role '$name' dibuat."
  fi
}

ensure_role "$EXECUTION_ROLE" "$ECS_TRUST"
aws iam attach-role-policy --role-name "$EXECUTION_ROLE" \
  --policy-arn "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy" \
  >/dev/null 2>&1 || true
# Tambahkan akses Secrets Manager untuk execution role (resolve secret saat task start)
aws iam attach-role-policy --role-name "$EXECUTION_ROLE" \
  --policy-arn "arn:aws:iam::aws:policy/SecretsManagerReadWrite" \
  >/dev/null 2>&1 || true

ensure_role "$TASK_ROLE" "$ECS_TRUST"

TASK_ROLE_POLICY_DOC=$(cat <<JSON
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "arn:aws:secretsmanager:${AWS_REGION}:${ACCOUNT_ID}:secret:bades/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::bades-*",
        "arn:aws:s3:::bades-*/*"
      ]
    }
  ]
}
JSON
)
aws iam put-role-policy --role-name "$TASK_ROLE" \
  --policy-name "$TASK_ROLE_POLICY" \
  --policy-document "$TASK_ROLE_POLICY_DOC" >/dev/null
green "Inline policy '$TASK_ROLE_POLICY' attached ke '$TASK_ROLE'."

EXECUTION_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${EXECUTION_ROLE}"
TASK_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${TASK_ROLE}"

bold "==> 5. IAM user '$CI_USER' untuk GitHub Actions"
CI_POLICY_DOC=$(cat <<JSON
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
      "Resource": "arn:aws:ecr:${AWS_REGION}:${ACCOUNT_ID}:repository/${ECR_REPO}"
    },
    {
      "Sid": "EcsDeploy",
      "Effect": "Allow",
      "Action": [
        "ecs:DescribeServices",
        "ecs:DescribeTasks",
        "ecs:DescribeTaskDefinition",
        "ecs:ListTasks",
        "ecs:RegisterTaskDefinition",
        "ecs:UpdateService",
        "ecs:RunTask"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IamPassRole",
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": [
        "${EXECUTION_ROLE_ARN}",
        "${TASK_ROLE_ARN}"
      ]
    },
    {
      "Sid": "ElbDescribe",
      "Effect": "Allow",
      "Action": [
        "elasticloadbalancing:DescribeTargetGroups",
        "elasticloadbalancing:DescribeTargetHealth"
      ],
      "Resource": "*"
    }
  ]
}
JSON
)

CI_POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/${CI_POLICY}"
if aws iam get-policy --policy-arn "$CI_POLICY_ARN" >/dev/null 2>&1; then
  yellow "Policy '$CI_POLICY' sudah ada — refresh sebagai default version."
  aws iam create-policy-version --policy-arn "$CI_POLICY_ARN" \
    --policy-document "$CI_POLICY_DOC" --set-as-default >/dev/null 2>&1 || true
else
  aws iam create-policy --policy-name "$CI_POLICY" \
    --policy-document "$CI_POLICY_DOC" >/dev/null
  green "Policy '$CI_POLICY' dibuat."
fi

if aws iam get-user --user-name "$CI_USER" >/dev/null 2>&1; then
  yellow "IAM user '$CI_USER' sudah ada."
else
  aws iam create-user --user-name "$CI_USER" >/dev/null
  green "IAM user '$CI_USER' dibuat."
fi
aws iam attach-user-policy --user-name "$CI_USER" \
  --policy-arn "$CI_POLICY_ARN" >/dev/null

CI_ACCESS_KEY_ID=""
CI_SECRET=""
if [ "$SKIP_ACCESS_KEY" != "1" ]; then
  EXISTING_KEYS=$(aws iam list-access-keys --user-name "$CI_USER" \
    --query 'AccessKeyMetadata[].AccessKeyId' --output text)
  if [ -n "$EXISTING_KEYS" ]; then
    yellow "User '$CI_USER' sudah punya access key: $EXISTING_KEYS"
    yellow "Skip create key baru. Hapus key lama lalu jalankan ulang jika ingin rotate."
  else
    KEY_JSON=$(aws iam create-access-key --user-name "$CI_USER")
    CI_ACCESS_KEY_ID=$(echo "$KEY_JSON" | jq -r '.AccessKey.AccessKeyId')
    CI_SECRET=$(echo "$KEY_JSON" | jq -r '.AccessKey.SecretAccessKey')
    green "Access key dibuat."
  fi
fi
echo

# ─────────────────────────────────────────────────────────────────────────────
# 6. ALB + target groups + listener
# ─────────────────────────────────────────────────────────────────────────────
bold "==> 6. Application Load Balancer"
ALB_ARN=$(aws elbv2 describe-load-balancers --region "$AWS_REGION" \
  --names "$ALB_NAME" --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text 2>/dev/null || echo "")
if [ -z "$ALB_ARN" ] || [ "$ALB_ARN" = "None" ]; then
  ALB_ARN=$(aws elbv2 create-load-balancer --region "$AWS_REGION" \
    --name "$ALB_NAME" --type application --scheme internet-facing \
    --security-groups "$ALB_SG" \
    --subnets "$SUBNET_PUB_A" "$SUBNET_PUB_B" \
    --tags "Key=Name,Value=$ALB_NAME" \
    --query 'LoadBalancers[0].LoadBalancerArn' --output text)
  green "ALB dibuat : $ALB_ARN"
else
  yellow "ALB sudah ada : $ALB_ARN"
fi

ALB_DNS=$(aws elbv2 describe-load-balancers --region "$AWS_REGION" \
  --load-balancer-arns "$ALB_ARN" \
  --query 'LoadBalancers[0].DNSName' --output text)
green "ALB DNS : $ALB_DNS"

ensure_target_group() {
  local name="$1"
  local arn
  arn=$(aws elbv2 describe-target-groups --region "$AWS_REGION" \
    --names "$name" --query 'TargetGroups[0].TargetGroupArn' \
    --output text 2>/dev/null || echo "")
  if [ -z "$arn" ] || [ "$arn" = "None" ]; then
    arn=$(aws elbv2 create-target-group --region "$AWS_REGION" \
      --name "$name" --protocol HTTP --port 3000 \
      --vpc-id "$VPC_ID" --target-type ip \
      --health-check-protocol HTTP --health-check-path "/healthz" \
      --health-check-interval-seconds 15 --health-check-timeout-seconds 5 \
      --healthy-threshold-count 2 --unhealthy-threshold-count 3 \
      --query 'TargetGroups[0].TargetGroupArn' --output text)
    green "Target group dibuat : $name = $arn"
  else
    yellow "Target group sudah ada : $name = $arn"
  fi
  echo "$arn"
}

TG_STAGING_ARN=$(ensure_target_group "$TG_STAGING_NAME")
TG_PRODUCTION_ARN=$(ensure_target_group "$TG_PRODUCTION_NAME")

# Listener 80: default ke production TG, rule untuk staging host header
LISTENER_ARN=$(aws elbv2 describe-listeners --region "$AWS_REGION" \
  --load-balancer-arn "$ALB_ARN" \
  --query 'Listeners[?Port==`80`].ListenerArn | [0]' --output text)
if [ -z "$LISTENER_ARN" ] || [ "$LISTENER_ARN" = "None" ]; then
  LISTENER_ARN=$(aws elbv2 create-listener --region "$AWS_REGION" \
    --load-balancer-arn "$ALB_ARN" --protocol HTTP --port 80 \
    --default-actions "Type=forward,TargetGroupArn=$TG_PRODUCTION_ARN" \
    --query 'Listeners[0].ListenerArn' --output text)
  green "Listener 80 dibuat : $LISTENER_ARN"
else
  yellow "Listener 80 sudah ada : $LISTENER_ARN"
fi

# Rule staging.bades.id → staging TG
STAGING_RULE=$(aws elbv2 describe-rules --region "$AWS_REGION" \
  --listener-arn "$LISTENER_ARN" \
  --query "Rules[?Conditions[?Field=='host-header' && contains(Values, 'staging.bades.id')]].RuleArn | [0]" \
  --output text)
if [ -z "$STAGING_RULE" ] || [ "$STAGING_RULE" = "None" ]; then
  aws elbv2 create-rule --region "$AWS_REGION" \
    --listener-arn "$LISTENER_ARN" --priority 10 \
    --conditions "Field=host-header,Values=staging.bades.id" \
    --actions "Type=forward,TargetGroupArn=$TG_STAGING_ARN" >/dev/null
  green "Rule staging.bades.id → $TG_STAGING_NAME dibuat."
else
  yellow "Rule staging.bades.id sudah ada."
fi
echo

# ─────────────────────────────────────────────────────────────────────────────
# 7. ECS cluster
# ─────────────────────────────────────────────────────────────────────────────
bold "==> 7. ECS cluster '$CLUSTER_NAME'"
CLUSTER_STATUS=$(aws ecs describe-clusters --region "$AWS_REGION" \
  --clusters "$CLUSTER_NAME" \
  --query 'clusters[0].status' --output text 2>/dev/null || echo "")
if [ "$CLUSTER_STATUS" != "ACTIVE" ]; then
  aws ecs create-cluster --region "$AWS_REGION" \
    --cluster-name "$CLUSTER_NAME" \
    --settings name=containerInsights,value=enabled >/dev/null
  green "Cluster dibuat : $CLUSTER_NAME"
else
  yellow "Cluster sudah aktif : $CLUSTER_NAME"
fi

# CloudWatch log groups
for LG in "/ecs/bades-staging" "/ecs/bades-production"; do
  aws logs create-log-group --region "$AWS_REGION" --log-group-name "$LG" \
    2>/dev/null || true
  aws logs put-retention-policy --region "$AWS_REGION" \
    --log-group-name "$LG" --retention-in-days 30 2>/dev/null || true
done
echo

# ─────────────────────────────────────────────────────────────────────────────
# 8. Task definition templates → scripts/aws/
# ─────────────────────────────────────────────────────────────────────────────
bold "==> 8. Tulis task definition template ke scripts/aws/"
TPL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/aws"
mkdir -p "$TPL_DIR"

write_task_def() {
  local env="$1" cpu="$2" memory="$3" file="$4"
  cat > "$file" <<JSON
{
  "family": "bades-${env}-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "${cpu}",
  "memory": "${memory}",
  "executionRoleArn": "${EXECUTION_ROLE_ARN}",
  "taskRoleArn": "${TASK_ROLE_ARN}",
  "containerDefinitions": [
    {
      "name": "bades",
      "image": "${ECR_URI}:placeholder",
      "essential": true,
      "portMappings": [
        { "containerPort": 3000, "protocol": "tcp" }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "wget -qO- http://127.0.0.1:3000/healthz || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      },
      "environment": [
        { "name": "NODE_ENV", "value": "production" },
        { "name": "NODE_PORT", "value": "3000" },
        { "name": "IS_BILLING_ENABLED", "value": "false" }
      ],
      "secrets": [
        { "name": "APP_SECRET", "valueFrom": "arn:aws:secretsmanager:${AWS_REGION}:${ACCOUNT_ID}:secret:bades/${env}/APP_SECRET" },
        { "name": "PG_DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:${AWS_REGION}:${ACCOUNT_ID}:secret:bades/${env}/PG_DATABASE_URL" },
        { "name": "REDIS_URL", "valueFrom": "arn:aws:secretsmanager:${AWS_REGION}:${ACCOUNT_ID}:secret:bades/${env}/REDIS_URL" },
        { "name": "OPENROUTER_API_KEY", "valueFrom": "arn:aws:secretsmanager:${AWS_REGION}:${ACCOUNT_ID}:secret:bades/${env}/OPENROUTER_API_KEY" }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/bades-${env}",
          "awslogs-region": "${AWS_REGION}",
          "awslogs-stream-prefix": "bades"
        }
      }
    }
  ]
}
JSON
  green "Template ditulis : $file"
}

write_task_def "staging"    "512"  "1024" "$TPL_DIR/bades-staging-task.json"
write_task_def "production" "1024" "2048" "$TPL_DIR/bades-production-task.json"
echo

# ─────────────────────────────────────────────────────────────────────────────
# 9. Register task definitions awal (placeholder) + ECS services
# ─────────────────────────────────────────────────────────────────────────────
if [ "$SKIP_ECS_SERVICES" != "1" ]; then
  bold "==> 9. Register task definitions awal + ECS services"

  for ENV_NAME in staging production; do
    TDF="$TPL_DIR/bades-${ENV_NAME}-task.json"
    # Konversi path ke format yang dipahami AWS CLI di Windows + Unix
    if command -v cygpath >/dev/null 2>&1; then
      TDF_URI="file://$(cygpath -w "$TDF" | sed 's|\\\\|/|g')"
    else
      TDF_URI="file://${TDF}"
    fi
    TD_ARN=$(aws ecs register-task-definition --region "$AWS_REGION" \
      --cli-input-json "$TDF_URI" \
      --query 'taskDefinition.taskDefinitionArn' --output text)
    green "Task def '$ENV_NAME' registered : $TD_ARN"

    if [ "$ENV_NAME" = "staging" ]; then
      SVC="$SERVICE_STAGING"; TG="$TG_STAGING_ARN"; DESIRED=1
    else
      SVC="$SERVICE_PRODUCTION"; TG="$TG_PRODUCTION_ARN"; DESIRED=2
    fi

    EXISTING=$(aws ecs describe-services --region "$AWS_REGION" \
      --cluster "$CLUSTER_NAME" --services "$SVC" \
      --query 'services[0].status' --output text 2>/dev/null || echo "")
    if [ "$EXISTING" = "ACTIVE" ]; then
      yellow "ECS service '$SVC' sudah aktif — skip create."
    else
      aws ecs create-service --region "$AWS_REGION" \
        --cluster "$CLUSTER_NAME" --service-name "$SVC" \
        --task-definition "$TD_ARN" --desired-count "$DESIRED" \
        --launch-type FARGATE \
        --network-configuration "awsvpcConfiguration={subnets=[$ECS_SUBNETS],securityGroups=[$ECS_SG],assignPublicIp=$ECS_ASSIGN_PUBLIC_IP}" \
        --load-balancers "targetGroupArn=$TG,containerName=bades,containerPort=3000" \
        --health-check-grace-period-seconds 120 \
        --deployment-configuration "minimumHealthyPercent=100,maximumPercent=200" \
        >/dev/null
      green "ECS service '$SVC' dibuat (desired=$DESIRED)."
      yellow "  → service akan FAILED sampai image pertama dipush via GitHub Actions."
    fi
  done
  echo
fi

# ─────────────────────────────────────────────────────────────────────────────
# Output: GitHub Secrets yang perlu di-set
# ─────────────────────────────────────────────────────────────────────────────
bold "==> Selesai. GitHub Secrets yang perlu di-set:"
echo
cat <<INFO
  AWS_REGION                          = ${AWS_REGION}
  AWS_ECR_REPOSITORY_URI              = ${ECR_URI}
  AWS_ECS_CLUSTER_NAME                = ${CLUSTER_NAME}
  AWS_ECS_STAGING_SERVICE_NAME        = ${SERVICE_STAGING}
  AWS_ECS_PRODUCTION_SERVICE_NAME     = ${SERVICE_PRODUCTION}
  AWS_ECS_STAGING_TASK_DEFINITION     = bades-staging-task
  AWS_ECS_PRODUCTION_TASK_DEFINITION  = bades-production-task
  AWS_ALB_DNS                         = ${ALB_DNS}
INFO

if [ -n "$CI_ACCESS_KEY_ID" ]; then
  echo
  echo "  AWS_ACCESS_KEY_ID                   = ${CI_ACCESS_KEY_ID}"
  echo "  AWS_SECRET_ACCESS_KEY               = ${CI_SECRET}"
  echo
  yellow "Simpan kedua nilai itu sekarang. Secret tidak bisa ditampilkan lagi."
else
  echo
  yellow "Access key tidak baru dibuat (sudah ada / SKIP_ACCESS_KEY=1)."
fi

echo
bold "Langkah berikut:"
echo "  1. Set GitHub Secrets di repo (Settings → Environments → staging/production)."
echo "  2. Buat AWS Secrets Manager entries di prefix 'bades/staging/...' dan 'bades/production/...'."
echo "     Lihat .github/DEPLOY.md Step 4 untuk daftar lengkap secret yang dibutuhkan."
echo "  3. Request ACM certificate untuk *.bades.id dan attach ke listener 443 (manual)."
echo "  4. Trigger deploy: git push origin staging."
