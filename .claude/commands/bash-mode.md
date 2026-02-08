# Bash Mode (!shortcut)

## ¿Qué es Bash Mode?

Bash Mode es un atajo rápido que permite ejecutar comandos bash directamente sin necesidad de usar el formato `/cmd` o herramientas adicionales.

## Cómo usar

Simplemente escribe `!` seguido del comando bash que quieres ejecutar:

```
!ls -la
!git status
!npm install
```

## Ventajas

- **Más rápido**: No necesitas formateo especial
- **Contexto preservado**: Los comandos se añaden al historial de la conversación
- **Integración fluida**: Claude entiende el contexto de lo que estás haciendo

## Ejemplos

```
!pwd                    # Ver directorio actual
!git log --oneline     # Ver historial de commits
!npm run build         # Ejecutar build
```

## Notas

- El comando se ejecuta en el directorio actual del proyecto
- Los resultados se muestran directamente en la conversación
- Claude puede referenciar estos resultados en respuestas posteriores
