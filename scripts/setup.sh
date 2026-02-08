#!/usr/bin/env bash
set -euo pipefail

echo "=== MarcGPT Setup ==="
echo ""

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "ERROR: Docker not found. Install Docker Desktop first: https://www.docker.com/products/docker-desktop/"; exit 1; }
docker compose version >/dev/null 2>&1 || { echo "ERROR: Docker Compose not found. Update Docker Desktop."; exit 1; }

# Check .env exists
if [ ! -f .env ]; then
    echo "ERROR: .env file not found."
    echo "Run: cp .env.example .env"
    echo "Then fill in your values (API keys, Telegram token, etc.)"
    exit 1
fi

# Check critical variables are set (not placeholder values)
source .env
if [ "$TELEGRAM_BOT_TOKEN" = "REPLACE_WITH_YOUR_BOT_TOKEN" ] || [ "$TELEGRAM_BOT_TOKEN" = "123456789:ABCdefGhIJKlmNoPQRsTUVwxYZ" ]; then
    echo "ERROR: TELEGRAM_BOT_TOKEN is still a placeholder."
    echo "Create a bot via @BotFather on Telegram and update .env"
    exit 1
fi

if [ "$TELEGRAM_OWNER_ID" = "REPLACE_WITH_YOUR_TELEGRAM_ID" ] || [ "$TELEGRAM_OWNER_ID" = "your-telegram-numeric-user-id" ]; then
    echo "ERROR: TELEGRAM_OWNER_ID is still a placeholder."
    echo "DM @userinfobot on Telegram to get your numeric ID and update .env"
    exit 1
fi

# Generate gateway token if placeholder
if [ "$OPENCLAW_GATEWAY_TOKEN" = "generate-a-random-token-here" ]; then
    TOKEN=$(openssl rand -hex 32)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/generate-a-random-token-here/$TOKEN/" .env
    else
        sed -i "s/generate-a-random-token-here/$TOKEN/" .env
    fi
    echo "Generated OPENCLAW_GATEWAY_TOKEN"
fi

# Ensure init-data.sh is executable
chmod +x src/main/n8n/init-data.sh

# Pull images
echo ""
echo "Pulling Docker images..."
docker compose pull

# Start services
echo ""
echo "Starting services..."
docker compose up -d

# Wait for health
echo ""
echo "Waiting for services to start..."
sleep 10

# Show status
echo ""
docker compose ps

echo ""
echo "=== MarcGPT is running ==="
echo ""
echo "  OpenClaw Dashboard: http://127.0.0.1:18789/"
echo "  n8n Dashboard:      http://localhost:5678"
echo ""
echo "Next steps:"
echo "  1. Open Telegram and DM your bot"
echo "  2. Check logs: docker compose logs -f openclaw-gateway"
echo "  3. Health check: bash scripts/health-check.sh"
