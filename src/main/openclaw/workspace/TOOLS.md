# Tools & Infrastructure

MarcGPT runs as an OpenClaw agent inside Docker Compose on Marc's machine.
All services below are on the same Docker network (`marcgpt-net`) and reachable by hostname.

---

## Notion API

**Purpose:** Marc's knowledge base, focus sessions calendar, project docs.
**Base URL:** `https://api.notion.com/v1`
**Auth:** Bearer token from env var `NOTION_API_KEY`
**Database ID:** env var `NOTION_DATABASE_ID` (marcgpt-lifeos DB)

### Headers (required on every request)
- `Authorization: Bearer $NOTION_API_KEY`
- `Notion-Version: 2022-06-28` (v2025-09-03 available but requires migration to data_source_id)
- `Content-Type: application/json`

### Key endpoints
- `POST /databases/{database_id}/query` — Query focus sessions (filter by status, date, etc.)
- `GET /pages/{page_id}` — Get a specific page
- `PATCH /pages/{page_id}` — Update page properties
- `POST /pages` — Create a new page in a database

### Focus Sessions DB properties
| Property | Type | Description |
|----------|------|-------------|
| Name | title | Session name |
| start_time | date | Session start (with time) |
| end_time | date | Session end (with time) |
| total_minutes | formula | Auto-calculated duration |
| objectives | rich_text | Session goals |
| micro_objectives | rich_text | Detailed sub-goals |
| achieved | checkbox | Was the session completed? |
| flow_score | number | Post-session flow rating |
| sync_status | select | Draft / Ready / Synced / Error |
| clockify_project_id | rich_text | Linked Clockify project |
| clockify_task_id | rich_text | Linked Clockify task (optional) |
| clockify_time_entry_id | rich_text | Clockify time entry ID (auto-populated after sync) |

---

## Clockify API

**Purpose:** Time tracking for Marc's projects and focus sessions.
**Base URL:** `https://api.clockify.me/api/v1`
**Auth header:** `X-Api-Key: $CLOCKIFY_API_KEY`
**Workspace ID:** env var `CLOCKIFY_WORKSPACE_ID`

### Key endpoints
- `GET /user` — Get current user (includes userId)
- `GET /workspaces/{workspaceId}/projects` — List projects
- `POST /workspaces/{workspaceId}/time-entries` — Create a time entry
- `PUT /workspaces/{workspaceId}/time-entries/{id}` — Update a time entry
- `GET /workspaces/{workspaceId}/user/{userId}/time-entries` — List time entries

### Time entry body example
```json
{
  "start": "2026-02-12T09:00:00Z",
  "end": "2026-02-12T10:30:00Z",
  "projectId": "...",
  "description": "Focus session: Deep work on MarcGPT"
}
```

---

## n8n (Workflow Automation)

**Purpose:** Workflow automation, scheduled tasks, multi-step integrations.
**Internal URL:** `http://n8n:5678` (reachable from this container)
**External URL:** `http://localhost:5678` (Marc's browser)

### Status
n8n is running but has no custom workflows yet. Future uses:
- Webhook endpoints for complex multi-step operations
- Scheduled Focus Sessions sync
- Alert notifications

### Health check
```bash
curl -s http://n8n:5678/healthz
```

---

## Focus Sessions CLI

A separate Docker container that syncs Notion Focus Sessions to Clockify.
Not callable from inside this container, but you can replicate its operations via the APIs above.

Commands (run by Marc from the host):
- `docker compose --profile cli run --rm focus-sessions sync:push`
- `docker compose --profile cli run --rm focus-sessions sync:dry-run`

---

## Environment Variables

Access via `exec` tool: `printenv VARIABLE_NAME`

| Variable | Purpose |
|----------|---------|
| `NOTION_API_KEY` | Notion API bearer token |
| `NOTION_DATABASE_ID` | Focus Sessions database ID |
| `CLOCKIFY_API_KEY` | Clockify API key |
| `CLOCKIFY_WORKSPACE_ID` | Clockify workspace ID |
| `MOONSHOT_API_KEY` | LLM API key (never share) |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token (never share) |
