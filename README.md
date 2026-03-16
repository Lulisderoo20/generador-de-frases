# Luchi Story Maker

App estatica para crear historias de Instagram con look editorial, tipografias premium, paletas random curadas y firma automatica con `@luchilisdero`.

## Lo que incluye

- Generador 1080 x 1920 con preview en vivo.
- Tipografia aleatoria entre Fraunces Bold Italic y Playfair Display Bold Italic.
- Paletas oscuras y contrastadas para que el fondo nunca quede brillante.
- Descarga en PNG y compartir desde navegadores compatibles.
- Manifest, service worker e iconos para instalarla como app web.
- Workflow de GitHub Pages listo para publicar.

## Uso local

Como es un sitio estatico, alcanza con servir la carpeta del proyecto:

```bash
python -m http.server 8000
```

Despues abre `http://localhost:8000`.

## GitHub Pages

1. Sube este contenido a un repositorio en GitHub.
2. Usa la rama `main`.
3. En GitHub, activa Pages con **GitHub Actions**.
4. El workflow en `.github/workflows/deploy-pages.yml` publica la raiz del proyecto.

## Instalar como app

- En Chrome o Edge suele aparecer el boton `Instalar app`.
- En iPhone o iPad usa `Compartir` y luego `Anadir a pantalla de inicio`.
