# cc-undo - Revertir Cambios de Claude

## ¿Qué es cc-undo?

`cc-undo` es una herramienta que permite revertir cambios realizados por Claude Code sin necesidad de usar git. Es especialmente útil cuando Claude hace cambios que no te convencen y quieres volver rápidamente al estado anterior.

## Instalación

### Instalación Global

```bash
npm install -g cc-undo
```

Esto instalará `cc-undo` globalmente en tu sistema, haciéndolo disponible en cualquier proyecto.

### Verificar Instalación

```bash
cc-undo --version
```

## Comandos Principales

### Ver Lista de Cambios

Muestra un historial de cambios que Claude ha realizado:

```bash
cc-undo list
```

Esto mostrará:
- Timestamp de cada cambio
- Descripción de la operación
- Archivos afectados

### Vista Previa de Cambios

Antes de revertir, puedes ver exactamente qué cambios se deshacerán:

```bash
cc-undo preview
```

O para una operación específica:

```bash
cc-undo preview <operation-id>
```

### Deshacer Cambios

Para revertir el último cambio de Claude:

```bash
cc-undo undo
```

Para revertir un cambio específico:

```bash
cc-undo undo <operation-id>
```

### Revertir Múltiples Operaciones

Para deshacer los últimos N cambios:

```bash
cc-undo undo --last 3  # Deshace los últimos 3 cambios
```

## Flujo de Trabajo Recomendado

### 1. Claude hace cambios

Claude implementa una feature pero algo no te convence.

### 2. Ver qué cambió

```bash
cc-undo list
```

Identifica la operación que quieres revertir.

### 3. Vista previa

```bash
cc-undo preview
```

Verifica que es lo que quieres deshacer.

### 4. Deshacer

```bash
cc-undo undo
```

Los archivos vuelven al estado anterior.

## Casos de Uso

### Cambio No Deseado

Claude refactorizó código pero introdujo un bug:
```bash
cc-undo list           # Ver cambios recientes
cc-undo preview        # Verificar qué se revertirá
cc-undo undo          # Revertir
```

### Comparar Aproximaciones

Probar diferentes implementaciones:
```bash
# Claude implementa versión A
# No te gusta
cc-undo undo

# Pides a Claude que implemente versión B
# Comparas ambas aproximaciones
```

### Recuperación de Emergencia

Claude hizo cambios en cascada y rompió algo:
```bash
cc-undo undo --last 5  # Revertir los últimos 5 cambios
```

## Ventajas vs Git

| Característica | cc-undo | git |
|----------------|---------|-----|
| **Velocidad** | Instantáneo | Requiere commits/stash |
| **Granularidad** | Por operación de Claude | Por commit |
| **Simplicidad** | Un comando | Múltiples comandos git |
| **Contexto** | Sabe qué hizo Claude | Cambios generales |

## Limitaciones

- Solo funciona con cambios realizados por Claude Code
- No reemplaza git para control de versiones real
- El historial de undo es local y temporal
- No funciona para cambios manuales en archivos

## Mejores Prácticas

### 1. Usar cc-undo para Experimentación

Perfecto para probar ideas rápidamente:
```bash
# Pide a Claude que implemente algo
# Si no funciona: cc-undo undo
# Prueba otra aproximación
```

### 2. Combinar con Git

```bash
# Flujo recomendado:
cc-undo preview       # Ver cambios de Claude
# Si te gusta:
git add .
git commit -m "Feature implementada por Claude"
```

### 3. Revisar Antes de Commit

Antes de hacer commit, usa `cc-undo list` para ver exactamente qué cambió Claude en esta sesión.

### 4. No Confiar 100% en cc-undo

- Haz commits de git regularmente
- cc-undo es una red de seguridad, no un reemplazo de control de versiones
- Para cambios importantes, usa git

## Configuración Avanzada

### Configurar Retención de Historial

Por defecto, cc-undo guarda las últimas 50 operaciones. Puedes cambiarlo:

```bash
# En ~/.cc-undo/config.json
{
  "maxHistory": 100,
  "autoCleanup": true
}
```

### Integración con Hooks

Puedes crear un hook que automáticamente liste cambios antes de commit:

```bash
# .claude/hooks/pre-commit.sh
cc-undo list --since last-commit
```

## Troubleshooting

### "No operations found"

No hay historial de cambios de Claude. Esto significa:
- Claude no ha hecho cambios aún
- El historial se limpió
- cc-undo no estaba activo cuando Claude hizo cambios

### "Cannot undo: files modified externally"

Los archivos cambiaron después de que Claude los editó. cc-undo no puede revertir de forma segura.

**Solución:** Usa git para revertir o haz los cambios manualmente.

### Conflictos al Deshacer

Si hay conflictos:
```bash
cc-undo undo --force  # Forzar undo (cuidado: sobrescribe cambios)
```

## Referencias

- Repositorio: `https://github.com/anthropics/cc-undo` (ejemplo, verificar URL real)
- Issues: Reporta bugs en el repositorio oficial
- Documentación completa: `cc-undo --help`

## Resumen

`cc-undo` es tu **red de seguridad** cuando experimentas con Claude. Te permite:
- ✅ Revertir cambios instantáneamente
- ✅ Probar múltiples aproximaciones sin miedo
- ✅ Recuperarte de errores rápidamente
- ✅ Mantener control total sobre el código

**Úsalo libremente para experimentar, pero siempre usa git para control de versiones real.**
