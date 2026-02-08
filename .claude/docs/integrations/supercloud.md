# Supercloud - Comandos Pre-construidos para Claude Code

## ¿Qué es Supercloud?

**Supercloud** es una colección de comandos avanzados pre-construidos que extienden las capacidades de Claude Code. Proporciona herramientas especializadas para análisis profundo de código, workflows complejos y automatización de tareas comunes.

## Instalación

### Requisito Previo: uv

Supercloud se instala usando `uv`, un instalador rápido de paquetes Python.

#### Instalar uv (si no lo tienes)

**macOS/Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows:**
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

#### Verificar uv

```bash
uv --version
```

### Instalar Supercloud

Una vez que tengas `uv`:

```bash
uv tool install supercloud
```

O si ya lo tienes instalado, actualizarlo:

```bash
uv tool upgrade supercloud
```

### Verificar Instalación

```bash
supercloud --version
```

## Comandos Disponibles

### `/sc-analyze` - Análisis Profundo de Código

Analiza el código base en profundidad, más allá de lo que Claude Code hace por defecto.

```bash
/sc-analyze
```

**Qué hace:**
- Mapea toda la arquitectura del proyecto
- Identifica patrones y anti-patrones
- Detecta code smells y posibles problemas
- Genera un reporte detallado de la estructura

**Opciones:**
```bash
/sc-analyze --focus=security     # Enfoque en seguridad
/sc-analyze --focus=performance  # Enfoque en performance
/sc-analyze --focus=architecture # Enfoque en arquitectura
```

**Cuándo usarlo:**
- Al empezar un proyecto nuevo (para entender código existente)
- Antes de refactorizaciones grandes
- Para auditorías de código
- Cuando buscas optimizaciones

### `/sc-workflow` - Workflows Automatizados

Ejecuta workflows pre-definidos para tareas comunes.

```bash
/sc-workflow
```

**Workflows disponibles:**
- **setup-testing:** Configura framework de testing completo
- **add-ci-cd:** Añade pipeline de CI/CD
- **security-audit:** Auditoría de seguridad
- **dependency-update:** Actualiza dependencias de forma segura
- **documentation:** Genera documentación automática

**Ejemplo:**
```bash
/sc-workflow setup-testing
```

Claude ejecutará:
1. Instalar framework de testing (Jest, Vitest, etc.)
2. Configurar archivos de config
3. Crear ejemplos de tests
4. Actualizar scripts en package.json
5. Documentar cómo escribir tests

### `/sc-refactor` - Refactorización Guiada

Herramienta interactiva para refactorizar código de forma segura.

```bash
/sc-refactor [archivo]
```

**Qué hace:**
1. Analiza el archivo/función
2. Identifica oportunidades de mejora
3. Propone refactorizaciones específicas
4. Las ejecuta de forma incremental
5. Verifica que todo sigue funcionando después de cada paso

**Ejemplo:**
```bash
/sc-refactor src/utils/helpers.ts
```

### `/sc-test` - Generación Inteligente de Tests

Genera tests comprehensivos basados en el código.

```bash
/sc-test [archivo]
```

**Qué hace:**
- Analiza funciones y clases
- Identifica casos edge
- Genera tests unitarios
- Genera tests de integración
- Incluye mocks cuando es necesario

**Ejemplo:**
```bash
/sc-test src/api/userController.ts
```

### `/sc-optimize` - Optimización de Performance

Identifica y corrige problemas de performance.

```bash
/sc-optimize
```

**Qué hace:**
- Profiling del código
- Identifica bottlenecks
- Sugiere optimizaciones
- Implementa mejoras
- Benchmarks antes/después

### `/sc-migrate` - Migraciones Automatizadas

Ayuda con migraciones de versiones, frameworks, o librerías.

```bash
/sc-migrate
```

**Ejemplos de uso:**
```bash
/sc-migrate --from=webpack --to=vite
/sc-migrate --from=jest --to=vitest
/sc-migrate --from=class-components --to=hooks
```

### `/sc-security` - Escaneo de Seguridad

Escanea el código en busca de vulnerabilidades.

```bash
/sc-security
```

**Qué detecta:**
- Vulnerabilidades de dependencias
- SQL injection
- XSS
- CSRF
- Exposición de secretos
- Configuraciones inseguras

## Configuración

### Archivo de Configuración

Crea `.supercloud/config.json` en la raíz del proyecto:

```json
{
  "analyze": {
    "depth": "deep",
    "ignore": ["node_modules", "dist", ".git"]
  },
  "refactor": {
    "autoApprove": false,
    "testAfterRefactor": true
  },
  "test": {
    "framework": "vitest",
    "coverage": true
  }
}
```

### Integración con Claude Code

Supercloud se integra automáticamente con Claude Code. Los comandos `/sc-*` estarán disponibles en el contexto de Claude.

## Flujos de Trabajo Recomendados

### 1. Onboarding en Proyecto Nuevo

```bash
/sc-analyze                  # Entender el código base
/sc-security                 # Identificar problemas de seguridad
```

### 2. Antes de Gran Refactorización

```bash
/sc-analyze --focus=architecture
/sc-test [archivos-afectados]  # Crear tests primero
/sc-refactor [archivos]         # Refactorizar con seguridad
```

### 3. Optimización de Performance

```bash
/sc-analyze --focus=performance
/sc-optimize
# Revisar sugerencias
# Implementar mejoras
```

### 4. Setup de Testing

```bash
/sc-workflow setup-testing
/sc-test src/             # Generar tests para código existente
```

### 5. Migración de Tecnología

```bash
/sc-analyze               # Estado actual
/sc-migrate --from=X --to=Y
# Revisar plan de migración
# Aprobar e implementar
```

## Ventajas de Supercloud

### vs Claude Code Solo

| Característica | Claude Code | Supercloud |
|----------------|-------------|------------|
| Análisis básico | ✅ | ✅ |
| Análisis profundo | ❌ | ✅ |
| Workflows pre-definidos | ❌ | ✅ |
| Refactorización guiada | Limitada | ✅ |
| Generación de tests | Manual | Automatizada |
| Security scanning | ❌ | ✅ |

### Beneficios Clave

1. **Velocidad:** Workflows pre-construidos aceleran tareas comunes
2. **Calidad:** Análisis más profundo detecta más problemas
3. **Seguridad:** Escaneos integrados de vulnerabilidades
4. **Automatización:** Menos trabajo manual en tareas repetitivas

## Casos de Uso Avanzados

### Crear Workflow Personalizado

```bash
# .supercloud/workflows/my-workflow.yaml
name: setup-backend
steps:
  - install: express typescript prisma
  - configure: typescript
  - generate: api-boilerplate
  - create: docker-compose.yml
  - setup: database-migrations
```

Ejecutar:
```bash
/sc-workflow my-workflow
```

### Integrar con CI/CD

```yaml
# .github/workflows/supercloud.yml
name: Supercloud Analysis
on: [pull_request]
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: uv tool install supercloud
      - run: supercloud analyze --ci-mode
      - run: supercloud security --ci-mode
```

## Limitaciones

- Requiere instalación de `uv` y `supercloud`
- Algunos comandos pueden ser lentos en proyectos muy grandes
- Los workflows automatizados pueden necesitar ajustes manuales
- No reemplaza el juicio humano en decisiones arquitectónicas

## Troubleshooting

### Comando no encontrado

```bash
# Verifica que supercloud esté en el PATH
which supercloud

# Si no está, añade a tu shell config:
export PATH="$PATH:$HOME/.local/bin"
```

### Error de permisos

```bash
# Reinstala con permisos correctos
uv tool uninstall supercloud
uv tool install supercloud
```

### Análisis muy lento

```bash
# Reduce profundidad de análisis
/sc-analyze --depth=shallow

# O excluye directorios grandes
/sc-analyze --exclude=node_modules,dist,build
```

## Mejores Prácticas

1. **Ejecuta /sc-analyze al inicio:** Comprende el proyecto antes de hacer cambios
2. **Crea tests antes de refactorizar:** Usa `/sc-test` primero
3. **Revisa sugerencias:** Supercloud sugiere, tú decides
4. **Configura .supercloud/config.json:** Personaliza según tu proyecto
5. **Integra con CI/CD:** Automatiza análisis en PRs

## Recursos

- Documentación oficial: `supercloud --help`
- Repositorio: `https://github.com/supercloud/cli` (verificar URL real)
- Workflows de ejemplo: `.supercloud/examples/`
- Community: Discord/Slack de Supercloud

## Resumen

Supercloud **multiplica las capacidades de Claude Code** con:
- 🔍 Análisis profundo de código
- ⚡ Workflows automatizados
- 🛡️ Escaneo de seguridad
- 🧪 Generación inteligente de tests
- ♻️ Refactorización guiada

**Combínalo con Claude Code para un desarrollo más rápido, seguro y de mayor calidad.**
