# [NOMBRE DE LA TAREA]

**Fecha de Inicio:** [YYYY-MM-DD]
**Estado:** 🟡 Planificación / 🔵 En Progreso / 🟢 Completado / 🔴 Bloqueado
**Asignado a:** Claude + [Nombre del desarrollador]

---

## Resumen Ejecutivo

[Descripción breve de 2-3 líneas sobre qué se va a implementar y por qué]

---

## Contexto y Motivación

### Problema a Resolver
[Descripción del problema o necesidad que motiva esta tarea]

### Caso de Uso
[Cómo se usará esta funcionalidad una vez implementada]

### Criterios de Éxito
- [ ] [Criterio medible 1]
- [ ] [Criterio medible 2]
- [ ] [Criterio medible 3]

---

## Requisitos Funcionales

### Requisitos Obligatorios (MUST)
1. [Requisito esencial 1]
2. [Requisito esencial 2]
3. [Requisito esencial 3]

### Requisitos Deseables (SHOULD)
1. [Requisito deseable 1]
2. [Requisito deseable 2]

### Requisitos Opcionales (COULD)
1. [Requisito opcional 1]
2. [Requisito opcional 2]

---

## Requisitos No Funcionales

- **Rendimiento:** [Especificar requisitos de velocidad, latencia, etc.]
- **Seguridad:** [Consideraciones de seguridad]
- **Escalabilidad:** [Cómo debe escalar]
- **Mantenibilidad:** [Cómo debe ser mantenible]
- **Compatibilidad:** [Con qué debe ser compatible]

---

## Investigación y Análisis

### Tecnologías Consideradas
| Tecnología | Ventajas | Desventajas | Decisión |
|------------|----------|-------------|----------|
| [Tech 1] | [Pros] | [Contras] | ✅ / ❌ |
| [Tech 2] | [Pros] | [Contras] | ✅ / ❌ |

### Patrones de Diseño Evaluados
- **[Patrón 1]:** [Razón para usar/no usar]
- **[Patrón 2]:** [Razón para usar/no usar]

### Código Existente Relacionado
- [Archivo 1:línea] - [Descripción de relevancia]
- [Archivo 2:línea] - [Descripción de relevancia]

---

## Diseño de la Solución

### Arquitectura General
```
[Diagrama ASCII o descripción de la arquitectura]

┌─────────────┐
│  Component1 │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Component2 │
└─────────────┘
```

### Componentes Principales
1. **[Componente 1]**
   - Responsabilidad: [Qué hace]
   - Entrada: [Qué recibe]
   - Salida: [Qué produce]

2. **[Componente 2]**
   - Responsabilidad: [Qué hace]
   - Entrada: [Qué recibe]
   - Salida: [Qué produce]

### Interfaces y Contratos
```typescript
// Ejemplo de interfaz (ajustar al lenguaje del proyecto)
interface [InterfaceName] {
  [property]: [type];
  [method](): [returnType];
}
```

---

## Plan de Implementación

### Fase 1: Preparación
- [ ] Crear estructura de directorios
- [ ] Configurar dependencias
- [ ] Preparar archivos de prueba

### Fase 2: Implementación Core
- [ ] [Tarea específica 1]
- [ ] [Tarea específica 2]
- [ ] [Tarea específica 3]

### Fase 3: Integración
- [ ] [Integración con componente X]
- [ ] [Integración con componente Y]

### Fase 4: Testing
- [ ] Escribir tests unitarios
- [ ] Escribir tests de integración
- [ ] Ejecutar suite completa de tests

### Fase 5: Documentación
- [ ] Documentar API/interfaces públicas
- [ ] Actualizar README si es necesario
- [ ] Crear ejemplos de uso

---

## Archivos a Crear/Modificar

### Archivos Nuevos
- [ ] `[ruta/al/archivo1.ext]` - [Descripción]
- [ ] `[ruta/al/archivo2.ext]` - [Descripción]

### Archivos a Modificar
- [ ] `[ruta/al/archivo3.ext]` - [Qué cambios]
- [ ] `[ruta/al/archivo4.ext]` - [Qué cambios]

---

## Dependencias

### Dependencias de Código
- [ ] [Tarea/componente que debe completarse primero]

### Dependencias Externas
- [ ] [Paquete npm/pip/etc a instalar]
- [ ] [Servicio externo a configurar]

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| [Riesgo 1] | Alta/Media/Baja | Alto/Medio/Bajo | [Cómo mitigar] |
| [Riesgo 2] | Alta/Media/Baja | Alto/Medio/Bajo | [Cómo mitigar] |

---

## Plan de Testing

### Tests Unitarios
```
[archivo_test.ext]
- test_[función1]
- test_[función2]
```

### Tests de Integración
```
[archivo_integration_test.ext]
- test_[escenario1]
- test_[escenario2]
```

### Tests Manuales
1. [Paso 1 del test manual]
2. [Paso 2 del test manual]
3. [Resultado esperado]

---

## Criterios de Aceptación

- [ ] Todos los tests pasan
- [ ] No hay errores de linting/formateo
- [ ] El código está documentado
- [ ] Se completaron todos los requisitos MUST
- [ ] La funcionalidad fue probada manualmente
- [ ] [Criterio específico adicional]

---

## Log de Progreso

### [YYYY-MM-DD] - Sesión 1
**Objetivo:** [Qué se planeó hacer]

**Completado:**
- ✅ [Tarea completada 1]
- ✅ [Tarea completada 2]

**En Progreso:**
- 🔄 [Tarea iniciada pero no terminada]

**Bloqueado:**
- ⛔ [Tarea bloqueada - Razón del bloqueo]

**Decisiones Tomadas:**
- [Decisión 1] - Razón: [Por qué se tomó]
- [Decisión 2] - Razón: [Por qué se tomó]

**Cambios Realizados:**
```
[archivo1.ext:línea] - [Descripción del cambio]
[archivo2.ext:línea] - [Descripción del cambio]
```

**Problemas Encontrados:**
- [Problema 1] - Solución: [Cómo se resolvió]
- [Problema 2] - Estado: [Pendiente/Resuelto]

**Notas para la Próxima Sesión:**
- [Nota 1]
- [Nota 2]

---

### [YYYY-MM-DD] - Sesión 2
[Repetir el formato anterior]

---

## Referencias

- [Documentación relevante 1]
- [Artículo/tutorial relevante 2]
- [Issue/PR relacionado 3]

---

## Notas Adicionales

[Cualquier información adicional que no encaje en las secciones anteriores]

---

**Última Actualización:** [YYYY-MM-DD HH:MM]
**Próximos Pasos:** [Qué hacer a continuación]
