# MarcGPT

Asistente personal AI desplegado con Docker Compose.

## Arquitectura

```
Telegram ←→ OpenClaw Gateway ←→ Moonshot API (Kimi K2.5)
                  ↕
                n8n ←→ PostgreSQL
```

| Servicio | Imagen | Puerto | Propósito |
|----------|--------|--------|-----------|
| OpenClaw Gateway | alpine/openclaw | 18789 | Hub AI, bot Telegram |
| n8n | n8nio/n8n | 5678 | Automatización de workflows |
| PostgreSQL | postgres:16-alpine | 5432 (interno) | Base de datos para n8n |

## Quick Start

### Prerequisitos

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado
2. Bot de Telegram creado via [@BotFather](https://t.me/BotFather)
3. Tu ID de Telegram obtenido via [@userinfobot](https://t.me/userinfobot)

### Setup

```bash
# 1. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores reales

# 2. Ejecutar setup
bash scripts/setup.sh
```

### Acceso

- **OpenClaw Dashboard:** http://127.0.0.1:18789/
- **n8n Dashboard:** http://localhost:5678

## Comandos

```bash
# Iniciar todos los servicios
docker compose up -d

# Parar todos los servicios
docker compose down

# Ver logs de OpenClaw
docker compose logs -f openclaw-gateway

# Ver logs de n8n
docker compose logs -f n8n

# Ejecutar CLI de OpenClaw
docker compose --profile cli run --rm openclaw-cli status

# Health check
bash scripts/health-check.sh
```

## Seguridad

- API keys y tokens en `.env` (nunca versionado)
- Telegram: solo responde al owner (allowlist)
- PostgreSQL: no expuesto al host, usuario non-root para n8n
- n8n: basic auth habilitado
- Contenedores: usuario non-root (node, uid 1000)

## Roadmap

- [ ] Workflows de monitoreo y alertas en n8n
- [ ] AgentSkills personalizados para OpenClaw
- [ ] Migración a Raspberry Pi
- [ ] Migración a Mac Mini
