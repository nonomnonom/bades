#!/bin/sh

# Production multi-workspace memakai same-origin API (window.location.origin).
# Lihat packages/front/src/config/index.ts — jangan inject SERVER_URL ke browser.

echo "Injecting runtime environment config into index.html..."

CONFIG_BLOCK=$(cat << EOF
    <script id="bades-env-config">
      window._env_ = {};
    </script>
    <!-- END: Bades Config -->
EOF
)
# Use sed to replace the config block in index.html
# Using pattern space to match across multiple lines
echo "$CONFIG_BLOCK" | sed -i.bak '
  /<!-- BEGIN: Bades Config -->/,/<!-- END: Bades Config -->/{
    /<!-- BEGIN: Bades Config -->/!{
      /<!-- END: Bades Config -->/!d
    }
    /<!-- BEGIN: Bades Config -->/r /dev/stdin
    /<!-- END: Bades Config -->/d
  }
' build/index.html
rm -f build/index.html.bak
