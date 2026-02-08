# MarcGPT MVP - Setup Inicial

**Fecha de Inicio:** 2026-02-08
**Estado:** 🔵 En Progreso
**Asignado a:** Claude + Marc

---

## Resumen Ejecutivo

Crear la infraestructura base de MarcGPT: un asistente personal AI usando OpenClaw como hub central, Kimi K2.5 como LLM, Telegram como canal de mensajería, y n8n para automatización. Todo desplegado con Docker Compose, portable a Raspberry Pi y Mac Mini.

---

## Contexto y Motivación

### Problema a Resolver
Necesidad de un asistente personal AI privado, modular y extensible que se pueda controlar desde Telegram y automatizar workflows.

### Criterios de Éxito
- [x] Docker Compose con OpenClaw + n8n + PostgreSQL
- [x] OpenClaw configurado con Kimi K2.5
- [x] Canal Telegram habilitado con seguridad allowlist
- [x] Secretos gestionados via .env (gitignored)
- [x] Git inicializado con .gitignore correcto
- [ ] Servicios arrancando sin errores
- [ ] Bot Telegram respondiendo mensajes

---

## Archivos Creados

| Archivo | Descripción |
|---------|-------------|
| `.gitignore` | Excluye .env, .DS_Store, node_modules |
| `.env.example` | Template con todas las variables necesarias |
| `.env` | Valores reales (gitignored) |
| `docker-compose.yml` | 4 servicios: openclaw-gateway, openclaw-cli, postgres, n8n |
| `src/main/openclaw/openclaw.json` | Config OpenClaw: Moonshot/Kimi K2.5 + Telegram |
| `src/main/n8n/init-data.sh` | Init PostgreSQL con usuario non-root para n8n |
| `scripts/setup.sh` | Setup automatizado: valida prereqs, pull, up |
| `scripts/health-check.sh` | Verifica estado de todos los servicios |
| `README.md` | Documentación del proyecto |

## Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `CLAUDE.md` | Actualizada descripción, arquitectura, stack y estructura |

---

## Decisiones Técnicas

1. **Multi-arch Docker images** (amd64+arm64): alpine/openclaw, n8n, postgres:16-alpine → portable a Raspberry Pi
2. **Named Docker volumes** para datos persistentes (no bind mounts para data)
3. **Bind mount para config** (`src/main/openclaw/`) → versionable en git, secretos via env vars
4. **PostgreSQL non-root user** para n8n → principio de mínimo privilegio
5. **openclaw-cli con profiles** → no arranca por defecto, solo bajo demanda
6. **API Moonshot directa** (no via CometAPI) → menos dependencias externas

---

## Log de Progreso

### 2026-02-08 - Sesión 1
**Objetivo:** Setup inicial completo del proyecto

**Completado:**
- ✅ Investigación de OpenClaw, Kimi K2.5 API, n8n Docker setup
- ✅ Plan aprobado por el usuario
- ✅ git init + .gitignore + .env.example + .env
- ✅ docker-compose.yml con 4 servicios
- ✅ openclaw.json con Kimi K2.5 y Telegram
- ✅ init-data.sh para PostgreSQL
- ✅ Scripts setup.sh y health-check.sh
- ✅ README.md y actualización de CLAUDE.md

**Pendiente:**
- ⏳ Commit inicial
- ⏳ Guardar en memoria largo plazo
- ⏳ Usuario debe: instalar Docker Desktop, crear bot Telegram, obtener Telegram ID
- ⏳ Primer `docker compose up` y verificación end-to-end

---

## Próximos Pasos (Post-MVP)

1. Workflows de monitoreo y alertas en n8n
2. AgentSkills personalizados para OpenClaw
3. Migración a Raspberry Pi
4. Migración a Mac Mini

---

**Última Actualización:** 2026-02-08
**Próximos Pasos:** Commit inicial, verificar que Docker levante los servicios
