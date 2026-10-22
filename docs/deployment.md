# Despliegue de obraiq-frontend (Vercel)

El frontend se reconecta **al final**, cuando el backend ya corre desde obraiq-backend. El checklist completo está en [obraiq-backend/docs/deployment.md](https://github.com/Jack-Limas/obraiq-backend/blob/main/docs/deployment.md).

Se reutiliza **el mismo proyecto de Vercel**, así que la URL y el dominio se conservan:

1. **Settings → Git:** Disconnect `civil-works-system` → Connect `Jack-Limas/obraiq-frontend`.
2. **Settings → Build and Deployment:**
   - Root Directory: `./` (antes era `frontend`).
   - Framework Preset: Next.js.
   - Build, Install y Output: los valores por defecto (`next build`, `npm install`, `.next`).
3. **Environment Variables:** `NEXT_PUBLIC_API_URL` = URL del backend, sin cambios. Se incrusta en el build: si cambia, hay que redesplegar.
4. **Deployments → Redeploy**, y comprobar en el navegador:
   - Login con ambos roles.
   - `crossOriginIsolated === true`.
   - Fotos de Cloudinary, Markdown del asistente, tema claro y oscuro, es y en.

**Volver atrás:** Deployments → último deploy del monorrepo → **Promote to Production**.
