#!/bin/sh
set -eu

API_URL="${API_BASE_URL:-}"
API_URL="${API_URL%/}"

cat > /usr/share/nginx/html/runtime-config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  apiBaseUrl: "${API_URL}",
};
EOF

echo "runtime-config.js generated with API_BASE_URL=${API_URL:-'(empty)'}"
