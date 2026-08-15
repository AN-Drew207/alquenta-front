# Entornos

Dos entornos, cada uno apuntando a su propio backend. `main` es producción;
`develop` es donde se prueba todo. Ninguna otra rama larga viva — el trabajo
en curso pasa por `feature/*` con PR hacia `develop`.

| | `main` (producción) | `develop` (pruebas) |
| --- | --- | --- |
| Rama | `main` | `develop` |
| Vercel | Production → dominio real | Preview → `gestion-inmueble-git-develop-<team>.vercel.app` |
| Backend (`NEXT_PUBLIC_API_URL`) | `gestion-inmueble-api` (Render) | `gestion-inmueble-api-dev` (Render) |
| `NEXT_PUBLIC_APP_ENV` | `production` | `development` |

## Flujo de trabajo

```
feature/mi-cambio → PR → develop → (probar en el preview) → PR → main
```

- Todo el trabajo nuevo sale de `develop` (o de una rama `feature/*` con PR
  hacia `develop`).
- `main` solo recibe merges vía PR desde `develop`, nunca commits directos.
- Cada PR corre CI (`.github/workflows/ci.yml`): install, lint y `tsc --noEmit`.
- Cualquier página que **no** sea `NEXT_PUBLIC_APP_ENV=production` muestra
  una franja en la parte superior con el nombre del entorno — así un
  preview nunca se confunde con producción de un vistazo.

## Variables de entorno

Ver `.env.example` para la lista completa comentada.

- **`NEXT_PUBLIC_API_URL`** vive en un solo lugar: `lib/env.ts`. Ningún
  fetch ni el cliente HTTP (`lib/api/client.ts`) debe leer
  `process.env.NEXT_PUBLIC_API_URL` directamente — importar `API_URL`
  desde `lib/env.ts` en su lugar. Ese módulo también revienta con un
  mensaje claro al arrancar si la variable no está seteada.
- **`NEXT_PUBLIC_APP_ENV`** controla la franja de entorno. En Vercel:
  Production → `production`; el scope Preview de la rama `develop` →
  `development`.
- Configurar en Vercel: **Settings → Environment Variables**, creando cada
  variable con el scope correcto (Production vs. Preview) y, para el
  scope Preview, restringiéndola a la rama `develop` en el selector de
  branch.

## Advertencia

**Nunca apuntes `NEXT_PUBLIC_API_URL` del entorno de pruebas al backend de
producción**, ni viceversa — cada scope de Vercel debe apuntar únicamente
a su propio servicio de Render.

## Problema pre-existente, no relacionado a este cambio

`npm run lint` falla hoy por un error en
`components/layout/house-image-panel.tsx:22` (`react-hooks/set-state-in-effect`,
ya existía antes de este trabajo). El primer run de CI en este repo va a
salir en rojo por eso hasta que se corrija aparte.
