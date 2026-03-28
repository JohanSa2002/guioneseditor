# Sistema Generador de Guiones IA

Este repositorio contiene el sistema completo de análisis y generación de guiones virales utilizando Whisper, GPT-4o y Supabase, con una interfaz web construida en Vue 3 y Tailwind CSS.

## Estructura del Proyecto

El proyecto está diseñado bajo una arquitectura modular y escalable:

```
/
├── backend/            # Lógica central (API, IA, Transcripción, Embeddings)
│   ├── api/            # Serverless handlers (ej. api/analizar.js)
│   ├── lib/            # Módulos de orquestación y LLM
│   └── server.js       # Servidor Express.js para testeo y desarrollo local
│
├── frontend/           # Interfaz de usuario "Obsidian Architecture"
│   ├── src/            # Vistas en Vue 3 y componentes
│   └── tailwind...     # Configuración del Design System
│
├── database/           # Archivos SQL para gestionar Supabase
│   ├── migrations/     # Setup de tablas (schema), funciones y RLS
│   └── seeds/          # Datos de prueba para iniciar la aplicación
│
└── docs/               # Archivos HTML originales del diseño (referencia)
```

## 1. Configuración de Variables de Entorno

En la carpeta `/backend/`, crea un archivo `.env` o renombra el existente con tus credenciales:

```env
RAPIDAPI_KEY=               # Key de Social Download All In One
OPENAI_API_KEY=             # Key de OpenAI para GPT-4o y Whisper
SUPABASE_URL=               # URL de tu base de datos Supabase (https://xxxx.supabase.co)
SUPABASE_SERVICE_ROLE_KEY=  # Tu Service Role Key (no exponer en el frontend)
```

## 2. Iniciar el Sistema en Local

Abre dos terminales para correr ambos entornos en simultáneo:

**Terminal 1 — Backend:**
```powershell
cd backend
npm install
npm run dev
```
> El servicio de IA y base de datos estará corriendo en `http://localhost:3001`

**Terminal 2 — Frontend:**
```powershell
cd frontend
npm install
npm run dev
```
> La interfaz estará disponible en `http://localhost:5173` (o `5174`)

## 3. Base de Datos (Supabase)

Si es la primera vez que despliegas el proyecto, dirígete a la consola SQL de tu proyecto en Supabase y ejecuta los archivos de la carpeta `/database` en el siguiente orden:

1. `database/migrations/01_schema.sql`
2. `database/migrations/02_funciones.sql`
3. `database/migrations/03_rls.sql`
4. `database/seeds/04_datos_prueba.sql` (Opcional)

## 4. Arquitectura de Despliegue

- **Frontend:** Preparado para desplegar de manera estática en Vercel, Netlify o Cloudflare Pages.
- **Backend:** Configurado con `vercel.json` para despliegues Serverless Edge/Node en Vercel (la ruta principal será `/api/analizar`). Alternativamente, funciona como un backend en la nube utilizando el `server.js` provisto.
