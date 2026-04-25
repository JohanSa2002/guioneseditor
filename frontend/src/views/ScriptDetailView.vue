<template>
  <div v-if="cargando" class="flex flex-col gap-8 animate-pulse">
    <div class="h-10 w-64 bg-white/5 rounded-xl"></div>
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <div class="xl:col-span-4 h-80 bg-white/5 rounded-3xl"></div>
      <div class="xl:col-span-8 h-[600px] bg-white/5 rounded-3xl"></div>
    </div>
  </div>

  <div v-else-if="guion" class="flex flex-col gap-8 pb-24">

    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
      <div class="flex flex-col gap-2">
        <nav class="flex items-center gap-2 text-[10px] font-bold text-ink-3 uppercase tracking-widest">
          <router-link to="/scripts" class="hover:text-accent transition-colors">Librería</router-link>
          <span class="material-symbols-outlined text-[12px]">chevron_right</span>
          <span class="text-ink">Detalle del Guion</span>
        </nav>
        <div class="flex items-center gap-4">
          <router-link to="/scripts" class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ink-3 hover:text-ink transition-all">
            <span class="material-symbols-outlined text-[20px]">arrow_back</span>
          </router-link>
          <h1 class="text-2xl font-bold font-headline text-ink leading-tight">
            {{ guion.titulo_sugerido || guion.tema || 'Guion Generado' }}
          </h1>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button @click="copiarGuionCompleto" class="btn-secondary">
          <span class="material-symbols-outlined text-[18px]">{{ copiado ? 'check' : 'content_copy' }}</span>
          {{ copiado ? 'Copiado' : 'Copiar Guion' }}
        </button>
        <router-link
          :to="{ name: 'Generate', query: { niche: guion.niche, platform: guion.plataforma } }"
          class="btn-primary"
        >
          <span class="material-symbols-outlined text-[18px]">auto_awesome</span>
          Nuevo Guion
        </router-link>
      </div>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

      <!-- Sidebar: Meta -->
      <aside class="xl:col-span-4 flex flex-col gap-5 sticky top-8">

        <!-- Score Card -->
        <div class="glass-panel p-6 flex flex-col items-center text-center gap-4">
          <p class="text-[10px] font-bold text-ink-3 uppercase tracking-[0.2em]">Score Estimado</p>
          <div class="relative w-36 h-36">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="8" class="text-white/5" />
              <circle
                cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="8"
                stroke-dasharray="282.7"
                :stroke-dashoffset="282.7 - (282.7 * (guion.score_estimado || 0)) / 100"
                class="transition-all duration-1000 ease-out"
                :class="getScoreStroke(guion.score_estimado)"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-4xl font-black font-headline text-ink tabular-nums leading-none">{{ guion.score_estimado || 0 }}</span>
              <span class="text-[9px] font-bold text-ink-3 uppercase tracking-widest mt-1">/ 100</span>
            </div>
          </div>
        </div>

        <!-- Metadata -->
        <div class="glass-panel p-6 space-y-4">
          <h3 class="text-[11px] font-bold text-ink-3 uppercase tracking-widest border-b border-border pb-3">Parámetros</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-ink-2">Nicho</span>
              <span class="text-xs font-bold text-ink">{{ guion.niche }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-ink-2">Plataforma</span>
              <span :class="getPlatformBadge(guion.plataforma)" class="platform-badge">{{ guion.plataforma }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-ink-2">Tono</span>
              <span class="text-xs font-bold text-ink capitalize">{{ guion.tono }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-ink-2">Objetivo</span>
              <span class="text-xs font-bold text-ink capitalize">{{ guion.objetivo }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-ink-2">Duración estimada</span>
              <span class="text-xs font-bold text-ink tabular-nums">{{ guion.duracion_estimada_seg || '—' }}s</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-ink-2">Estructura</span>
              <span class="text-xs font-bold text-ink uppercase">{{ guion.estructura_usada }}</span>
            </div>
            <div class="pt-2 border-t border-border flex items-center justify-between">
              <span class="text-xs text-ink-2">Generado</span>
              <span class="text-xs font-bold text-ink-3">{{ formatearFecha(guion.fecha_generacion) }}</span>
            </div>
          </div>
        </div>

        <!-- Audiencia -->
        <div v-if="guion.audiencia" class="glass-panel p-6">
          <p class="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-3">Audiencia Objetivo</p>
          <p class="text-sm text-ink-2 leading-relaxed">{{ guion.audiencia }}</p>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="xl:col-span-8 flex flex-col gap-6">

        <!-- Guion Completo -->
        <section class="glass-panel p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-sm font-bold text-ink uppercase tracking-[0.2em] flex items-center gap-3">
              <span class="material-symbols-outlined text-accent">description</span>
              Guion Completo
            </h3>
            <button @click="copiarGuionCompleto" class="text-[10px] font-bold text-accent hover:underline uppercase tracking-widest">
              COPIAR TODO
            </button>
          </div>

          <!-- Gancho -->
          <div class="mb-6">
            <p class="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">GANCHO</p>
            <div class="p-5 rounded-2xl bg-accent-subtle/10 border border-accent-border/30">
              <p class="text-base font-bold text-ink leading-snug">"{{ guion.gancho }}"</p>
            </div>
          </div>

          <!-- Desarrollo -->
          <div class="mb-6" v-if="guion.desarrollo">
            <p class="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-3">DESARROLLO</p>
            <div class="p-5 rounded-2xl bg-white/5 border border-border">
              <p class="text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">{{ guion.desarrollo }}</p>
            </div>
          </div>

          <!-- CTA -->
          <div v-if="guion.cta">
            <p class="text-[10px] font-bold text-success uppercase tracking-widest mb-3">CALL TO ACTION</p>
            <div class="p-5 rounded-2xl bg-success/5 border border-success/20">
              <p class="text-sm font-bold text-ink leading-relaxed">"{{ guion.cta }}"</p>
            </div>
          </div>
        </section>

        <!-- Variantes del Gancho -->
        <section v-if="guion.variantes_gancho?.length" class="glass-panel p-8">
          <h3 class="text-sm font-bold text-ink uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <span class="material-symbols-outlined text-accent">shuffle</span>
            Variantes del Gancho
          </h3>
          <div class="space-y-3">
            <div
              v-for="(v, idx) in guion.variantes_gancho"
              :key="idx"
              class="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-border hover:border-accent/30 transition-all group cursor-pointer"
              @click="copiarTexto(v)"
            >
              <span class="text-[10px] font-black text-ink-3 group-hover:text-accent tabular-nums mt-0.5 w-4 shrink-0">{{ idx + 1 }}</span>
              <p class="text-sm text-ink-2 group-hover:text-ink transition-colors leading-relaxed flex-1 italic">"{{ v }}"</p>
              <span class="material-symbols-outlined text-[16px] text-ink-3 group-hover:text-accent transition-colors opacity-0 group-hover:opacity-100 shrink-0">content_copy</span>
            </div>
          </div>
        </section>

        <!-- Técnicas Aplicadas -->
        <section v-if="guion.tecnicas_aplicadas?.length" class="glass-panel p-8">
          <h3 class="text-sm font-bold text-ink uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <span class="material-symbols-outlined text-accent">psychology</span>
            Técnicas Aplicadas
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="t in guion.tecnicas_aplicadas"
              :key="t"
              class="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[11px] font-bold"
            >{{ t }}</span>
          </div>
        </section>

        <!-- Notas de Producción -->
        <section v-if="guion.notas_produccion" class="glass-panel p-8">
          <h3 class="text-sm font-bold text-ink uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
            <span class="material-symbols-outlined text-accent">notes</span>
            Notas de Producción
          </h3>
          <p class="text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">{{ guion.notas_produccion }}</p>
        </section>

      </main>
    </div>

    <!-- Toast -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-10 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-4 opacity-0"
    >
      <div v-if="toastVisible" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div class="px-6 py-3 rounded-2xl bg-accent text-canvas font-bold text-sm shadow-2xl flex items-center gap-3">
          <span class="material-symbols-outlined">check_circle</span>
          Copiado al portapapeles
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../lib/api.js'
import { getPlatformBadge } from '../utils/badges.js'

const route  = useRoute()
const router = useRouter()
const guion  = ref(null)
const cargando = ref(true)
const copiado  = ref(false)
const toastVisible = ref(false)


function getScoreStroke(score) {
  if (!score) return 'text-border'
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-accent'
  if (score >= 40) return 'text-warn'
  return 'text-error'
}

function formatearFecha(f) {
  if (!f) return '—'
  return new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function cargarGuion() {
  cargando.value = true
  try {
    console.log('[ScriptDetail] Cargando ID:', route.params.id)
    const data = await api.generados.obtener(route.params.id)
    console.log('[ScriptDetail] Datos recibidos:', data)
    guion.value = data
  } catch (e) {
    console.error('[ScriptDetail] Error:', e)
    router.push({ name: 'Scripts' })
  } finally {
    cargando.value = false
  }
}

async function eliminarYVolver() {
  if (!confirm('¿Eliminar este guion? No se puede deshacer.')) return
  try {
    await api.generados.eliminar(route.params.id)
  } catch (e) {
    console.error(e)
  }
  router.push({ name: 'Scripts' })
}

function copiarTexto(txt) {
  navigator.clipboard.writeText(txt)
  toastVisible.value = true
  setTimeout(() => toastVisible.value = false, 2500)
}

function copiarGuionCompleto() {
  if (!guion.value) return
  const partes = [
    guion.value.titulo_sugerido ? 'TÍTULO: ' + guion.value.titulo_sugerido : '',
    '\nGANCHO:\n' + (guion.value.gancho || ''),
    guion.value.desarrollo ? '\nDESARROLLO:\n' + guion.value.desarrollo : '',
    guion.value.cta ? '\nCTA:\n' + guion.value.cta : '',
  ].filter(Boolean).join('\n')
  navigator.clipboard.writeText(partes)
  copiado.value = true
  toastVisible.value = true
  setTimeout(() => {
    copiado.value = false
    toastVisible.value = false
  }, 2500)
}

onMounted(cargarGuion)
</script>
