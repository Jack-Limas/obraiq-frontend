# Publicar obraiq-frontend en GitHub

Comandos para ejecutar a mano, una sola vez. El repo es **público**: revisa los pasos 1 y 2 antes de hacer push.

## 1. Crear el repositorio vacío

En GitHub → **New repository**:
- Owner: `Jack-Limas`.
- Name: `obraiq-frontend`.
- Visibility: **Public**.
- **Sin** README, sin .gitignore y sin licencia. Si GitHub crea un commit inicial, el primer push es rechazado.

Con GitHub CLI, en lugar de la web: `gh repo create Jack-Limas/obraiq-frontend --public`.

## 2. Comprobar que no se publica nada sensible

```bash
cd "C:/Users/Proyectos_Mide/obraiq/obraiq-frontend"
git status                                          # working tree clean
git ls-files | grep -iE "(^|/)\.env|cookies"         # solo debe salir .env.example
git check-ignore .env                               # debe imprimir .env (ignorado)
git log --all --oneline -- cookies.txt              # debe salir vacío
```

## 3. Publicar la rama y el tag

```bash
cd "C:/Users/Proyectos_Mide/obraiq/obraiq-frontend"
git remote add origin https://github.com/Jack-Limas/obraiq-frontend.git
git push -u origin main
git push origin v1.0.0
```

## 4. Verificar

- En GitHub, la pestaña **Actions** muestra el workflow `CI` en verde.
- **Tags** muestra `v1.0.0`.
- El historial conserva los commits originales con sus fechas.

Siguiente paso: el checklist de despliegue en [obraiq-backend/docs/deployment.md](https://github.com/Jack-Limas/obraiq-backend/blob/main/docs/deployment.md) (orden: IA, backend, frontend).
