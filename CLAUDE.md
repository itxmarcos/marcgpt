# MarcGPT Project

## Descripción del Proyecto

MarcGPT es un asistente personal AI desplegado con Docker Compose. Usa OpenClaw como hub central de agentes AI, Kimi K2.5 (Moonshot API) como LLM, Telegram como canal de mensajería, y n8n para automatización de workflows.

Metodología de desarrollo guiada por especificaciones ("Spec-driven development") con Claude Code.

## Arquitectura

```
Telegram ←→ OpenClaw Gateway ←→ Moonshot API (Kimi K2.5)
                  ↕ (webhook)
                n8n ←→ PostgreSQL
```

**Directorios principales:**
- `src/main/openclaw/` - Configuración de OpenClaw (openclaw.json)
- `src/main/n8n/` - Scripts de inicialización de n8n y PostgreSQL
- `scripts/` - Scripts de setup y mantenimiento

## Stack Tecnológico

**Servicios Docker:**
- OpenClaw (alpine/openclaw) - Hub de agente AI, conexión con Telegram
- Kimi K2.5 (Moonshot API) - LLM principal via API OpenAI-compatible
- n8n (n8nio/n8n) - Automatización de workflows y monitoreo
- PostgreSQL (postgres:16-alpine) - Base de datos para n8n

**Herramientas:**
- Docker Compose - Orquestación de servicios
- Claude Code (CLI de Anthropic)

## Plan & Review

### Before starting work
- Always enter plan mode to make a plan.
- After creating the plan, make sure you write it to `.claude/tasks/TASK_NAME.md`.
- The plan should be a detailed implementation plan with specific tasks.
- Also append detailed descriptions of the requirements and the reasoning behind them, as well as tasks broken down.
- If the task requires external knowledge or certain packages, also research to get latest knowledge (Use Tool for research).
- Don't over plan it, always think MVP.
- Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While implementing
- You should update the plan as you work.
- After you complete tasks in the plan, you should update and append detailed descriptions of the changes made today, so following tasks can be easily handed over to other engineers.

## Comandos Útiles de Claude Code

### Comandos Básicos
- `/init` - Inicializar el análisis del repositorio (ejecutar al comenzar)
- `/ide` - Conectar con el editor actual (VS Code, Cursor, Windsurf)
- `/help` - Obtener ayuda sobre comandos disponibles

### Permisos
- `/dangerously-skip-permissions` - Evitar preguntas de permisos (usar con precaución)

### Atajos de Teclado
- `Shift + Tab` - Activar modo auto-accept edits (útil durante la fase de planificación)

## Sistema de Hooks

Este proyecto utiliza hooks para automatizar tareas comunes durante el desarrollo.

### Hooks Configurados

**Stop Hook** (`.claude/hooks/stop.sh`)
- Se ejecuta cuando Claude termina una tarea
- Reproduce un sonido del sistema para notificarte
- Útil cuando trabajas en otra ventana

**Post-Tool-Use Hook** (`.claude/hooks/post-tool-use-typecheck.py`)
- Se ejecuta después de editar archivos TypeScript (.ts, .tsx)
- Ejecuta `npx tsc --noEmit` para verificar tipos
- Bloquea cambios si hay errores de tipo (exit code 2)
- Previene errores de compilación antes de ejecutar el código

### Configuración

Los hooks están configurados en `.claude/settings.json`:
- `stop`: Notificación al terminar
- `post-tool-use`: Type checking automático en edit/write/multi-edit

### Códigos de Salida de Hooks
- `0`: Éxito (continuar normalmente)
- `1`: Advertencia no bloqueante (mostrar mensaje pero continuar)
- `2`: Error bloqueante (detener y requerir corrección)

## Comandos Personalizados

### Comandos Disponibles

**`/joke`** - Comando de ejemplo del tutorial
- Hace que Claude cuente un chiste en mayúsculas
- Útil para probar que el sistema de comandos funciona

**`/bash-mode`** o `!` - Ejecución rápida de bash
- Atajo: `!ls`, `!git status`, `!npm install`
- Ejecuta comandos bash directamente
- El contexto se mantiene en el historial

**`/memory`** o `#` - Guardar en memoria de Claude
- Atajo: `#Este proyecto usa TypeScript strict mode`
- Guarda información que Claude recordará en futuras sesiones
- Útil para convenciones del proyecto y preferencias

### Crear Nuevos Comandos

Para añadir comandos personalizados:
1. Crear archivo `.claude/commands/nombre-comando.md`
2. Escribir las instrucciones que Claude debe seguir
3. El comando estará disponible como `/nombre-comando`

## Flujo de Trabajo Recomendado

1. **Inicio de sesión:**
   - Ejecutar `/init` para que Claude analice el proyecto
   - Verificar que `/ide` esté conectado correctamente

2. **Desarrollo con Plan & Review:**
   ```
   Usuario: [Describe la tarea]
   ↓
   Claude: Entra en modo plan automáticamente
   ↓
   Claude: Crea .claude/tasks/[TASK_NAME].md
   ↓
   Claude: Solicita aprobación del plan
   ↓
   Usuario: Revisa y aprueba
   ↓
   Claude: Implementa siguiendo el plan
   ↓
   Claude: Actualiza el archivo de tareas con los cambios
   ```

3. **Uso de Shift + Tab:**
   - Activar al inicio de la planificación
   - Permite que Claude cree archivos de plan sin confirmación manual
   - Facilita el flujo de trabajo

## Estructura del Proyecto

```
marcgpt/
├── .claude/
│   ├── commands/          # Comandos personalizados (bash-mode, memory)
│   ├── docs/integrations/ # Guías de integración
│   ├── hooks/             # Scripts de automatización (stop.sh)
│   ├── plans/             # Planes generales (auto-generados)
│   ├── tasks/             # Tareas específicas y sus planes
│   ├── specs/             # Especificaciones de funcionalidades
│   └── settings.json      # Configuración de hooks
├── src/main/
│   ├── openclaw/          # Config OpenClaw (openclaw.json)
│   └── n8n/               # Init scripts PostgreSQL
├── scripts/               # Setup y health-check
├── docker-compose.yml     # Orquestación de servicios
├── .env.example           # Template de variables de entorno
├── CLAUDE.md              # Este archivo
└── README.md              # Documentación del proyecto
```

## Principios de Desarrollo

### Siempre MVP (Minimum Viable Product)
- No sobre-planificar
- Implementar la funcionalidad mínima necesaria
- Iterar basándose en feedback

### Documentación Continua
- Cada tarea debe documentarse en `.claude/tasks/`
- Los cambios deben explicarse detalladamente
- Facilitar el traspaso a otros desarrolladores

### Planificación Obligatoria
- No codificar sin un plan aprobado
- Los planes deben ser específicos y accionables
- Investigar conocimiento externo cuando sea necesario

## Notas Adicionales

- Este archivo (CLAUDE.md) se inyecta automáticamente en el contexto de Claude
- Cualquier regla o instrucción aquí será seguida por Claude durante el desarrollo
- Mantener este archivo actualizado con decisiones arquitectónicas importantes
