#!/usr/bin/env bash
set -euo pipefail

echo "=== MarcGPT Health Check ==="
echo ""

echo "--- Docker Services ---"
docker compose ps
echo ""

echo "--- OpenClaw Gateway ---"
if curl -sf http://127.0.0.1:18789/health >/dev/null 2>&1; then
    echo "  Status: OK"
else
    echo "  Status: UNREACHABLE (port 18789)"
fi

echo ""
echo "--- n8n ---"
if curl -sf http://localhost:5678/healthz >/dev/null 2>&1; then
    echo "  Status: OK"
else
    echo "  Status: UNREACHABLE (port 5678)"
fi

echo ""
echo "--- PostgreSQL ---"
if docker compose exec -T postgres pg_isready -U "${POSTGRES_USER:-marcgpt}" >/dev/null 2>&1; then
    echo "  Status: OK"
else
    echo "  Status: UNREACHABLE"
fi

echo ""
echo "--- Moonshot API ---"
if [ -n "${MOONSHOT_API_KEY:-}" ]; then
    RESPONSE=$(curl -sf -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $MOONSHOT_API_KEY" \
        https://api.moonshot.ai/v1/models 2>/dev/null || echo "000")
    if [ "$RESPONSE" = "200" ]; then
        echo "  Status: OK (API key valid)"
    else
        echo "  Status: HTTP $RESPONSE (check API key)"
    fi
else
    echo "  Status: MOONSHOT_API_KEY not set in environment"
    echo "  Run: source .env && bash scripts/health-check.sh"
fi
