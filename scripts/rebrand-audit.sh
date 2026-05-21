#!/bin/bash

# Rebrand Audit Script - Find remaining Twenty/twenty references
# Usage: bash scripts/rebrand-audit.sh [package]
#   package: optional - filter by package (front, server, emails, website, docs)

set -e

PACKAGE="${1:-}"
REPORT_FILE="rebrand-audit-report.txt"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Bades Rebrand Audit"
echo "==================="
echo "Scanning for remaining 'Twenty' / 'twenty' references..."
echo ""

# Initialize report
echo "Bades Rebrand Audit - $(date)" > "$REPORT_FILE"
echo "========================================" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Count findings
TOTAL_COUNT=0

# Patterns that are OK (internal identifiers, not user-facing)
# These patterns are allowed because they refer to internal code/technical names
OK_PATTERNS=(
  "twentySDK"
  "twentyConfig"
  "TwentyConfig"
  "twenty-standard"
  "TwentyStandard"
  "twenty_STANDARD"
  "TWENTY_STANDARD"
  "twentyObject"
  "TwentyObject"
  "workspace-manager"
  "twenty-docker"
  "TwentyDocker"
  "TwentyORM"
  "twenty-orm"
  "twenty_config"
  "_twenty"
  "twentyCLIAccessToken"
)

# Files to always skip
SKIP_FILES=(
  "node_modules"
  ".git"
  "dist"
  "build"
  ".next"
  ".turbo"
  "coverage"
  "__pycache__"
  ".png"
  ".jpg"
  ".jpeg"
  ".gif"
  ".ico"
  ".svg"  # Halftone tool needs original
  ".woff"
  ".woff2"
  ".ttf"
  ".eot"
)

# Packages to scan
PACKAGES=("front" "server" "emails" "website" "docs" "create-twenty-app")

if [ -n "$PACKAGE" ]; then
  if [[ " ${PACKAGES[*]} " =~ " ${PACKAGE} " ]]; then
    PACKAGES=("twenty-$PACKAGE")
  else
    echo -e "${RED}Unknown package: $PACKAGE${NC}"
    echo "Valid packages: ${PACKAGES[*]}"
    exit 1
  fi
fi

scan_package() {
  local pkg="$1"
  local pkg_path="packages/$pkg"

  if [ ! -d "$pkg_path" ]; then
    return
  fi

  echo -e "${YELLOW}Scanning packages/$pkg...${NC}"

  # Use grep to find files with "Twenty" or "twenty"
  # Exclude binary files and certain patterns
  local findings=$(grep -r -l -i "twenty" "$pkg_path" \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=dist \
    --exclude-dir=build \
    --exclude-dir=.next \
    --exclude-dir=.turbo \
    --exclude="*.png" \
    --exclude="*.jpg" \
    --exclude="*.jpeg" \
    --exclude="*.gif" \
    --exclude="*.svg" \
    --exclude="*.woff" \
    --exclude="*.woff2" \
    --exclude="*.ttf" 2>/dev/null || true)

  if [ -z "$findings" ]; then
    echo -e "  ${GREEN}No findings${NC}"
    echo "[$pkg] No findings" >> "$REPORT_FILE"
    return
  fi

  local count=$(echo "$findings" | wc -l)
  TOTAL_COUNT=$((TOTAL_COUNT + count))
  echo -e "  ${RED}$count files found${NC}"
  echo "[$pkg] $count files:" >> "$REPORT_FILE"
  echo "$findings" | while read -r file; do
    echo "  $file" >> "$REPORT_FILE"
  done
  echo "" >> "$REPORT_FILE"
}

for pkg in "${PACKAGES[@]}"; do
  scan_package "$pkg"
done

echo ""
echo "========================================"
echo -e "Total files with 'Twenty' references: ${RED}$TOTAL_COUNT${NC}"
echo ""
echo "Full report saved to: $REPORT_FILE"

if [ $TOTAL_COUNT -gt 0 ]; then
  echo -e "${YELLOW}Note: Not all findings are user-facing issues.${NC}"
  echo "Check $REPORT_FILE for details."
  exit 1
else
  echo -e "${GREEN}All clean! No Twenty references found.${NC}"
  exit 0
fi