# Focus Sessions — Notion + Clockify Sync

**Started**: 2026-02-11
**Status**: In Progress

## Descripcion

Sistema de "Focus Sessions" que combina una base de datos Notion (calendario mensual con sesiones de enfoque, checklist pre-session, flow scoring post-session) con sincronizacion automatica a Clockify para time tracking.

## Arquitectura

- TypeScript CLI (`@marcgpt/focus-sessions`) en `src/main/focus-sessions/`
- Notion API (Bearer token) para leer/actualizar sesiones
- Clockify API (X-Api-Key) para crear/actualizar time entries
- Docker container on-demand (profiles: cli)
- Host cron job para scheduling automatico

## Cambios Realizados

### 2026-02-11 — Implementacion inicial

**Archivos creados:**
- `src/main/focus-sessions/package.json` — Scaffold del proyecto
- `src/main/focus-sessions/tsconfig.json` — TypeScript strict + ESM
- `src/main/focus-sessions/Dockerfile` — Node 22 Alpine
- `src/main/focus-sessions/.env.example` — Variables necesarias
- `src/main/focus-sessions/src/config.ts` — Validacion env con zod
- `src/main/focus-sessions/src/clockify.ts` — Cliente Clockify API (create/update/get)
- `src/main/focus-sessions/src/notion.ts` — Cliente Notion SDK (query, extract, update)
- `src/main/focus-sessions/src/sync.ts` — Motor de sync (push + dry-run)
- `src/main/focus-sessions/src/cli.ts` — CLI con commander (sync:push, sync:dry-run, sync:pull)
- `src/main/focus-sessions/tests/sync.test.ts` — Tests unitarios (idempotencia, errores, dry-run, mapping)

**Archivos modificados:**
- `docker-compose.yml` — Nuevo servicio `focus-sessions` (profiles: cli)
- `.env.example` — 4 nuevas variables (NOTION_API_KEY, NOTION_DATABASE_ID, CLOCKIFY_API_KEY, CLOCKIFY_WORKSPACE_ID)

## Pendiente

- [ ] Configurar Notion: crear Integration, base de datos, propiedades, template de pagina
- [ ] Configurar Clockify: obtener API key y workspace ID
- [ ] Agregar variables a `.env`
- [ ] npm install + npm test
- [ ] Primera prueba end-to-end con una sesion real
- [ ] Configurar cron job para sync automatico
- [ ] (Futuro) sync:pull — bidireccional desde Clockify
- [ ] (Futuro) n8n workflow con alertas de error
