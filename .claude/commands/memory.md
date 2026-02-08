# Memory Mode (# shortcut)

## ¿Qué es Memory Mode?

Memory Mode permite guardar información importante en la memoria de Claude para que la recuerde en futuras conversaciones dentro del mismo proyecto.

## Cómo usar

Escribe `#` seguido de la información que quieres que Claude recuerde:

```
#Este proyecto usa TypeScript con strict mode activado
#La API base URL es https://api.example.com/v1
#Preferimos usar async/await sobre Promises.then()
```

## Niveles de Memoria

### Per-Project Memory (predeterminado)
- Se almacena específicamente para este proyecto
- Claude la recordará en futuras sesiones del mismo proyecto
- Útil para preferencias, convenciones, configuraciones del proyecto

### User-Level Memory
- Se comparte entre todos los proyectos
- Para preferencias globales de desarrollo
- Configuración en settings de Claude Code

## Ventajas

- **Persistencia**: La información se mantiene entre sesiones
- **Contexto automático**: Claude tiene el contexto sin necesidad de repetirlo
- **Mejora continua**: Mientras más uses el proyecto, mejor entiende Claude tus preferencias

## Ejemplos de uso

```
# Convenciones de código
#Usar camelCase para variables y funciones
#Usar PascalCase para componentes React
#Máximo 80 caracteres por línea

# Configuración del proyecto
#El servidor de desarrollo corre en puerto 3000
#La base de datos de test es "test_db"

# Preferencias personales
#Preferir imports absolutos sobre relativos
#Siempre incluir tipos explícitos en funciones públicas
```

## Ver memoria guardada

Puedes pedirle a Claude que te muestre qué información tiene guardada:

```
"¿Qué información tienes guardada sobre este proyecto?"
```

## Notas

- La memoria se actualiza automáticamente
- Puedes sobrescribir información previa
- Útil para onboarding de nuevos desarrolladores al proyecto
