# ¿Quién no me sigue? 📱

Aplicación móvil (Android e iOS) hecha con **React Native y Expo** que te dice a qué cuentas sigues en Instagram que **no te siguen de vuelta**.

> Proyecto personal y educativo. No está afiliado ni respaldado por Instagram ni Meta.

## ¿Cómo funciona?

Instagram no ofrece una API oficial para consultar la lista de seguidores y seguidos de una cuenta personal. Por eso la app **no pide tu usuario ni tu contraseña**. En su lugar usa el archivo de exportación que Instagram te permite descargar de tus propios datos:

1. Descargas tu información de Instagram en formato JSON (ZIP).
2. Cargas ese ZIP en la app.
3. La app lee dentro del ZIP los archivos `followers_N.json` y `following.json`.
4. Calcula la diferencia: **seguidos − seguidores**.
5. Muestra la lista. Al tocar una cuenta se abre su perfil en Instagram.

### Privacidad

Todo se procesa **en tu dispositivo**. La app no sube ningún dato a ningún servidor.

## Cómo descargar tu información de Instagram

Los nombres de los menús pueden cambiar con el tiempo, pero el recorrido habitual es:

1. En Instagram, ve a **Centro de cuentas → Tu información y permisos → Descargar tu información**.
2. Elige **Descargar o transferir información** y selecciona tu cuenta.
3. Marca **Personalizar información** y selecciona **Seguidores y seguidos**.
4. En el intervalo de fechas, elige **Desde el principio** (todo el tiempo).
5. En el formato, elige **JSON**.
6. Cuando Instagram te avise de que está listo (puede tardar desde minutos hasta horas), descarga el ZIP y cópialo a tu móvil.

> ⚠️ Si tu ZIP no contiene ningún archivo `followers_N.json`, la app te avisará de que no puede comparar. Revisa que hayas marcado *Seguidores y seguidos* y el intervalo *Desde el principio*.

## Requisitos

- [Node.js](https://nodejs.org/) (versión LTS recomendada)
- Un móvil con la app **Expo Go** instalada (Android o iOS)
- El móvil y el ordenador conectados a la misma red wifi

## Instalación y ejecución

```bash
# 1. Clona el repositorio
git clone <URL-DE-TU-REPOSITORIO>
cd no-me-siguen

# 2. Instala las dependencias
npm install

# 3. Inicia el servidor de desarrollo
npx expo start
```

Escanea el código QR que aparece en la terminal con **Expo Go** (en Android, desde la propia app; en iPhone, con la cámara).

Si al clonar el proyecto falta alguna librería, instálala con:

```bash
npx expo install expo-document-picker
npm install jszip
```

## Cómo se usa la app

1. Pulsa **1. Elegir ZIP** y selecciona el ZIP que descargaste de Instagram.
2. Pulsa **2. Comparar**.
3. Verás cuántas cuentas no te siguen de vuelta y la lista completa.
4. Toca cualquier cuenta para abrir su perfil en Instagram.

## Estructura del proyecto

```
src/
├── app/
│   └── index.tsx      # Pantalla principal (interfaz y flujo de la app)
└── utils/
    ├── zip.ts         # Lee el ZIP y extrae los JSON de seguidores y seguidos
    └── compare.ts     # Calcula quién no te sigue de vuelta
```

### Qué hace cada archivo

- **`src/utils/zip.ts`**: abre el ZIP con [JSZip](https://stuk.github.io/jszip/) y busca los archivos `followers_N.json` y `following.json` en cualquier carpeta del ZIP.
- **`src/utils/compare.ts`**: extrae los nombres de usuario de los JSON (a partir del enlace de cada perfil), ignora las cuentas eliminadas y devuelve las cuentas que sigues y no están en tu lista de seguidores.
- **`src/app/index.tsx`**: selector de archivos, botones, mensajes de estado y lista de resultados.

## Tecnologías

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) (Expo Router)
- TypeScript
- [expo-document-picker](https://docs.expo.dev/versions/latest/sdk/document-picker/) para elegir el ZIP
- [JSZip](https://stuk.github.io/jszip/) para leer el ZIP

## Limitaciones conocidas

- Los resultados son una **foto del momento** en que descargaste los datos, no información en tiempo real.
- Si Instagram cambia el formato de la exportación, puede que haya que ajustar la lectura de los archivos.
- Se han hecho pruebas en Android con Expo Go. El funcionamiento en iOS no está verificado.
- El ZIP se carga entero en memoria, así que un ZIP muy grande (por ejemplo, con fotos y mensajes) puede ir lento o fallar. Se recomienda exportar solo *Seguidores y seguidos*.

## Posibles mejoras

- Buscador para filtrar la lista por nombre de usuario.
- Guardar comparaciones anteriores para ver quién ha dejado de seguirte entre una exportación y otra.
- Modo oscuro.

## Aviso importante sobre tus datos

**No subas tu exportación de Instagram al repositorio** (ZIP ni archivos JSON). Contiene datos personales. Si quieres estar seguro, añade esto a tu `.gitignore`:

```
*.zip
followers_*.json
following.json
```

## Licencia

Consulta el archivo `LICENSE` del repositorio.