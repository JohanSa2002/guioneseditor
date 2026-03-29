<template>
  <div class="max-w-4xl mx-auto flex flex-col gap-10">
    <!-- Encabezado -->
    <header class="border-b border-white/5 pb-8">
      <h1 class="text-5xl font-extrabold font-headline tracking-tighter text-white mb-2 leading-tight">Configuración</h1>
      <p class="text-primary text-sm font-bold flex items-center gap-2 tracking-widest uppercase">
        <span class="material-symbols-outlined text-sm">settings</span>
        Ajustes del sistema y conexiones de servicio
      </p>
    </header>

    <!-- Sección: Estado de Conexiones -->
    <section class="space-y-4">
      <h2 class="text-xs font-black uppercase tracking-widest text-outline flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">cable</span> Estado de Conexiones
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="svc in servicios" :key="svc.nombre" class="bg-surface-container rounded-2xl border border-outline-variant/10 p-5 flex items-start gap-4">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" :class="svc.color">
            <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">{{ svc.icon }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-black text-white mb-0.5">{{ svc.nombre }}</p>
            <p class="text-[10px] text-outline font-bold uppercase tracking-widest">{{ svc.rol }}</p>
            <div class="flex items-center gap-1.5 mt-2">
              <span class="w-1.5 h-1.5 rounded-full" :class="svc.estado === 'ok' ? 'bg-secondary' : 'bg-outline/30'"></span>
              <span class="text-[10px] font-bold" :class="svc.estado === 'ok' ? 'text-secondary' : 'text-outline'">
                {{ svc.estado === 'ok' ? 'Configurado' : 'Sin configurar' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección: Variables de entorno -->
    <section class="space-y-4">
      <h2 class="text-xs font-black uppercase tracking-widest text-outline flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">key</span> Variables de Entorno (backend/.env)
      </h2>
      <div class="bg-surface-container rounded-3xl border border-outline-variant/10 overflow-hidden">
        <div class="bg-surface-container-high/50 px-6 py-3 border-b border-white/5 flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-red-500/50"></span>
          <span class="w-3 h-3 rounded-full bg-yellow-500/50"></span>
          <span class="w-3 h-3 rounded-full bg-secondary/50"></span>
          <span class="ml-3 text-[10px] text-outline font-black uppercase tracking-widest">backend/.env</span>
        </div>
        <div class="p-6 font-mono text-xs space-y-2">
          <div v-for="v in envVars" :key="v.key" class="flex items-center gap-3">
            <span class="text-primary/70 shrink-0">{{ v.key }}</span>
            <span class="text-outline/40">=</span>
            <span class="text-secondary/60 italic">{{ v.desc }}</span>
          </div>
        </div>
      </div>
      <p class="text-[11px] text-outline/60 italic px-1">Edita el archivo <code class="text-primary/70">backend/.env</code> directamente. No se exponen valores por seguridad.</p>
    </section>

    <!-- Sección: Plataformas soportadas -->
    <section class="space-y-4">
      <h2 class="text-xs font-black uppercase tracking-widest text-outline flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">video_library</span> Plataformas de Video Soportadas
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="p in plataformas" :key="p.nombre" class="bg-surface-container rounded-2xl border border-outline-variant/10 p-5 flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" :class="p.bg">
            <span class="font-black text-sm" :class="p.text">{{ p.sigla }}</span>
          </div>
          <div>
            <p class="text-sm font-black text-white">{{ p.nombre }}</p>
            <p class="text-[10px] text-outline font-bold">{{ p.formato }}</p>
          </div>
          <span class="ml-auto text-[9px] font-black text-secondary bg-secondary/10 border border-secondary/20 px-2 py-1 rounded-full uppercase tracking-widest">Activo</span>
        </div>
      </div>
    </section>

    <!-- Sección: Pipeline de análisis -->
    <section class="space-y-4">
      <h2 class="text-xs font-black uppercase tracking-widest text-outline flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">account_tree</span> Pipeline de Análisis
      </h2>
      <div class="bg-surface-container rounded-3xl border border-outline-variant/10 p-6 space-y-0 relative">
        <div class="absolute left-[2.45rem] top-8 bottom-8 w-px bg-white/5"></div>
        <div v-for="(paso, idx) in pipeline" :key="paso.id" class="flex gap-5 relative z-10 py-4">
          <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10 border border-primary/20">
            <span class="material-symbols-outlined text-sm text-primary">{{ paso.icon }}</span>
          </div>
          <div>
            <p class="text-sm font-black text-white mb-0.5">{{ idx + 1 }}. {{ paso.label }}</p>
            <p class="text-xs text-outline/70 font-medium leading-relaxed">{{ paso.desc }}</p>
            <span class="inline-block mt-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-surface-container-low border border-white/5 text-outline">{{ paso.tecnologia }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección: Versión -->
    <section class="bg-surface-container rounded-3xl border border-outline-variant/10 p-6 flex items-center justify-between">
      <div>
        <p class="text-sm font-black text-white mb-1">Sistema Generador de Guiones</p>
        <p class="text-[10px] text-outline font-bold uppercase tracking-widest">Versión 4.0 · Vue 3 + Express + Supabase + OpenAI</p>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl border border-white/5">
        <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
        <span class="text-[11px] font-black text-secondary uppercase tracking-widest">Sistema operativo</span>
      </div>
    </section>
  </div>
</template>

<script setup>
const servicios = [
  { nombre: 'OpenAI',    rol: 'GPT-4o + Whisper',      icon: 'psychology',    color: 'bg-green-500/10 text-green-400',   estado: 'ok' },
  { nombre: 'Supabase',  rol: 'Base de datos + Vectores', icon: 'database',   color: 'bg-emerald-500/10 text-emerald-400', estado: 'ok' },
  { nombre: 'RapidAPI',  rol: 'Extracción de audio',   icon: 'download',      color: 'bg-blue-500/10 text-blue-400',     estado: 'ok' },
]

const envVars = [
  { key: 'OPENAI_API_KEY',            desc: 'sk-... (requerido para GPT-4o y Whisper)' },
  { key: 'SUPABASE_URL',              desc: 'https://xxxx.supabase.co' },
  { key: 'SUPABASE_SERVICE_ROLE_KEY', desc: 'eyJ... (clave de servicio)' },
  { key: 'RAPIDAPI_KEY',              desc: 'Clave para extracción de audio de videos' },
  { key: 'ALLOWED_ORIGIN',            desc: 'http://localhost:5173 (CORS)' },
  { key: 'PORT',                       desc: '3001 (puerto del backend)' },
]

const plataformas = [
  { nombre: 'TikTok',          formato: 'Videos cortos',        sigla: 'TK', bg: 'bg-red-500/10',     text: 'text-red-400' },
  { nombre: 'Instagram Reels', formato: 'Reels verticales',     sigla: 'IG', bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400' },
  { nombre: 'YouTube Shorts',  formato: 'Shorts < 60 seg',      sigla: 'YT', bg: 'bg-red-600/10',     text: 'text-red-500' },
]

const pipeline = [
  { id: 'extraccion',   label: 'Extracción de Audio',    icon: 'downloading', desc: 'Descarga el video usando RapidAPI y extrae la pista de audio en formato compatible con Whisper.',           tecnologia: 'RapidAPI' },
  { id: 'transcripcion', label: 'Transcripción',          icon: 'mic',         desc: 'Convierte el audio a texto con marcas de tiempo usando Whisper de OpenAI.',                                 tecnologia: 'OpenAI Whisper' },
  { id: 'analisis',     label: 'Análisis Neurométrico',  icon: 'psychology',  desc: 'GPT-4o analiza la transcripción y extrae 70 campos: gancho, estructura, principios Cialdini, tono y más.', tecnologia: 'GPT-4o' },
  { id: 'validacion',   label: 'Validación de Esquema',  icon: 'verified',    desc: 'Valida que el JSON generado cumpla el esquema de 70 campos antes de persistirlo.',                          tecnologia: 'Validador interno' },
  { id: 'embedding',    label: 'Generación de Embedding', icon: 'hub',        desc: 'Genera un vector semántico del guion para búsquedas por similitud y lo almacena en Supabase pgvector.',    tecnologia: 'OpenAI Embeddings + pgvector' },
]
</script>
