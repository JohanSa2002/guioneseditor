<template>
  <div v-if="cargando" class="flex flex-col gap-8 animate-pulse">
    <div class="h-10 w-64 bg-white/5 rounded-xl"></div>
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <div class="xl:col-span-4 h-[600px] bg-white/5 rounded-3xl"></div>
      <div class="xl:col-span-8 h-[800px] bg-white/5 rounded-3xl"></div>
    </div>
  </div>

  <div v-else-if="guion" class="flex flex-col gap-8 pb-24">
    
    <!-- Header / Breadcrumbs -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
      <div class="flex flex-col gap-2">
        <nav class="flex items-center gap-2 text-[10px] font-bold text-ink-3 uppercase tracking-widest">
          <router-link to="/analysis" class="hover:text-accent transition-colors">Historial</router-link>
          <span class="material-symbols-outlined text-[12px]">chevron_right</span>
          <span class="text-ink">Detalle de Análisis</span>
        </nav>
        <div class="flex items-center gap-4">
          <router-link to="/analysis" class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ink-3 hover:text-ink transition-all">
            <span class="material-symbols-outlined text-[20px]">arrow_back</span>
          </router-link>
          <h1 class="text-2xl font-bold font-headline text-ink leading-tight">{{ guion.tema_principal || 'Análisis de Video' }}</h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button @click="copiarLink" class="btn-secondary">
          <span class="material-symbols-outlined text-[18px]">{{ copiado ? 'check' : 'link' }}</span>
          {{ copiado ? 'Copiado' : 'Copiar URL' }}
        </button>
        <router-link
          :to="{ name: 'Generate', query: { niche: guion.niche, platform: guion.plataforma, base_id: guion.id } }"
          class="btn-primary"
        >
          <span class="material-symbols-outlined text-[18px]">auto_awesome</span>
          Generar Guion IA
        </router-link>
      </div>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      
      <!-- Barra Lateral: Métricas Flash -->
      <aside class="xl:col-span-4 flex flex-col gap-6 sticky top-8">
        
        <!-- Score Card -->
        <div class="glass-panel p-8 flex flex-col items-center text-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-radial from-accent/5 to-transparent"></div>
          
          <p class="text-[10px] font-bold text-ink-3 uppercase tracking-[0.2em] mb-6 relative z-10">Puntaje de Viralidad</p>
          
          <div class="relative w-48 h-48 mb-6 z-10">
            <!-- SVG Progress -->
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="8" class="text-white/5" />
              <circle
                cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="8"
                stroke-dasharray="282.7"
                :stroke-dashoffset="282.7 - (282.7 * (guion.score_virabilidad || 0)) / 100"
                class="transition-all duration-1000 ease-out"
                :class="getScoreColor(guion.score_virabilidad).replace('text-', 'stroke-')"
              />
            </svg>
            <!-- Centro del Score -->
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-5xl font-black font-headline text-ink tabular-nums leading-none">{{ guion.score_virabilidad }}%</span>
              <span class="text-[10px] font-bold uppercase tracking-widest mt-1" :class="getScoreColor(guion.score_virabilidad)">
                {{ guion.score_virabilidad >= 80 ? 'POTENCIAL ALTO' : 'POTENCIAL MEDIO' }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 w-full relative z-10">
            <div class="p-4 rounded-2xl bg-white/5 border border-border">
              <p class="text-[9px] font-bold text-ink-3 uppercase mb-1">CIALDINI</p>
              <p class="text-xl font-bold text-ink">{{ guion.score_cialdini }}<span class="text-xs text-ink-3">/7</span></p>
            </div>
            <div class="p-4 rounded-2xl bg-white/5 border border-border">
              <p class="text-[9px] font-bold text-ink-3 uppercase mb-1">ENGAGEMENT</p>
              <p class="text-xl font-bold text-success">{{ (guion.score_engagement || 0).toFixed(1) }}%</p>
            </div>
          </div>
        </div>

        <!-- Social Metrics -->
        <div class="glass-panel p-6 space-y-4">
          <h3 class="text-[11px] font-bold text-ink-3 uppercase tracking-widest border-b border-border pb-3">Estadísticas del Video</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-ink-2">Vistas Reales</span>
              <span class="text-sm font-bold text-ink tabular-nums">{{ formatearNumero(guion.vistas) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-ink-2">Likes</span>
              <span class="text-sm font-bold text-ink tabular-nums">{{ formatearNumero(guion.likes) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-ink-2">Compartidos</span>
              <span class="text-sm font-bold text-ink tabular-nums">{{ formatearNumero(guion.compartidos) }}</span>
            </div>
            <div class="pt-2 border-t border-border flex items-center justify-between">
              <span class="text-xs text-accent font-bold">Plataforma</span>
              <span :class="getPlatformBadge(guion.plataforma)" class="platform-badge">{{ guion.plataforma }}</span>
            </div>
          </div>
        </div>

        <!-- Meta Info -->
        <div class="glass-panel p-6 bg-white/2">
          <p class="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-3">Detección de Nicho</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[11px] font-bold">{{ guion.niche }}</span>
            <span v-if="guion.sub_niche" class="px-3 py-1.5 rounded-lg bg-white/5 border border-border text-ink-2 text-[11px] font-bold">{{ guion.sub_niche }}</span>
          </div>
          <div class="mt-4 pt-4 border-t border-border">
            <p class="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-2">Hashtags Detectados</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="h in hashtags" :key="h"
                class="text-[10px] text-accent hover:underline transition-all"
                @click="copiarTexto(h)"
              >#{{ h }}</button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Contenido Principal -->
      <main class="xl:col-span-8 flex flex-col gap-6">
        
        <!-- Tab Bar Sticky -->
        <nav class="glass-panel p-1.5 flex items-center gap-1 sticky top-8 z-40">
          <button
            v-for="t in tabsDisponibles" :key="t.id"
            @click="irASeccion(t.id)"
            class="px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
            :class="tabActivo === t.id ? 'bg-accent text-canvas shadow-neon-accent' : 'text-ink-3 hover:text-ink hover:bg-white/5'"
          >
            {{ t.label }}
          </button>
        </nav>

        <!-- Secciones -->
        <div class="space-y-6">
          
          <!-- Resumen del Patrón -->
          <section id="resumen" class="glass-panel p-8 seccion-detalle">
            <h3 class="text-sm font-bold text-ink uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span class="material-symbols-outlined text-accent">insights</span>
              Patrón Narrativo Ganador
            </h3>
            <p class="text-lg text-ink leading-relaxed font-medium italic mb-8">
              "{{ guion.resumen_patron }}"
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p class="text-[11px] font-bold text-accent uppercase tracking-widest mb-4">¿Por qué funcionó?</p>
                <p class="text-sm text-ink-2 leading-relaxed">{{ guion.explicacion_exito }}</p>
              </div>
              <div class="p-6 rounded-3xl bg-white/5 border border-border">
                <p class="text-[11px] font-bold text-success uppercase tracking-widest mb-3">Acción Sugerida</p>
                <p class="text-sm text-ink leading-relaxed">{{ guion.accion_sugerida }}</p>
              </div>
            </div>
          </section>

          <!-- Ganchos -->
          <section id="ganchos" class="glass-panel p-8 seccion-detalle">
            <h3 class="text-sm font-bold text-ink uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span class="material-symbols-outlined text-accent">anchor</span>
              Análisis del Gancho (Hooks)
            </h3>
            <div class="space-y-8">
              <div class="p-6 rounded-3xl bg-accent-subtle/10 border border-accent-border/30 relative overflow-hidden">
                <div class="absolute right-0 top-0 p-4 opacity-10">
                  <span class="material-symbols-outlined text-6xl">format_quote</span>
                </div>
                <p class="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">TEXTO ORIGINAL</p>
                <p class="text-xl font-bold text-ink leading-snug">"{{ guion.gancho_texto }}"</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-accent">category</span>
                    <div>
                      <p class="text-[10px] font-bold text-ink-3 uppercase tracking-tighter">TIPO DE GANCHO</p>
                      <p class="text-sm font-bold text-ink">{{ guion.gancho_tipo }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-accent">bolt</span>
                    <div>
                      <p class="text-[10px] font-bold text-ink-3 uppercase tracking-tighter">EFECTO PSICOLÓGICO</p>
                      <p class="text-sm font-bold text-ink">{{ guion.gancho_efecto }}</p>
                    </div>
                  </div>
                </div>
                <div class="p-5 rounded-2xl bg-white/2 border border-dashed border-border">
                  <p class="text-[11px] font-bold text-ink-3 uppercase mb-2">CONSEJO DEL GANCHO</p>
                  <p class="text-xs text-ink-2 leading-relaxed italic">"{{ guion.gancho_consejo }}"</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Neuromarketing (Cialdini) -->
          <section id="neuromarketing" class="glass-panel p-8 seccion-detalle">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-sm font-bold text-ink uppercase tracking-[0.2em] flex items-center gap-3">
                <span class="material-symbols-outlined text-accent">psychology</span>
                Disparadores de Cialdini
              </h3>
              <span class="px-3 py-1 rounded-full bg-white/5 border border-border text-[10px] font-bold text-ink-3 uppercase">
                {{ guion.score_cialdini }} / 7 DETECTADOS
              </span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="princ in principiosCialdini" :key="princ.id"
                class="p-4 rounded-2xl border transition-all"
                :class="princ.detectado ? 'bg-success/5 border-success/30' : 'bg-white/2 border-border opacity-40'"
              >
                <div class="flex items-center gap-3 mb-2">
                  <span class="material-symbols-outlined text-[20px]" :class="princ.detectado ? 'text-success' : 'text-ink-3'">
                    {{ princ.detectado ? 'check_circle' : 'circle' }}
                  </span>
                  <p class="text-xs font-bold uppercase tracking-tight" :class="princ.detectado ? 'text-ink' : 'text-ink-3'">{{ princ.label }}</p>
                </div>
                <p v-if="princ.detectado" class="text-[10px] text-ink-2 leading-relaxed">{{ princ.desc }}</p>
              </div>
            </div>
          </section>

          <!-- Estructura -->
          <section id="estructura" class="glass-panel p-8 seccion-detalle">
            <h3 class="text-sm font-bold text-ink uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span class="material-symbols-outlined text-accent">reorder</span>
              Arquitectura del Contenido
            </h3>
            <div class="space-y-6">
              <div v-for="(p, idx) in guion.partes_guion" :key="idx" class="flex gap-6 group">
                <div class="flex flex-col items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-white/5 border border-border flex items-center justify-center shrink-0 group-hover:border-accent transition-colors">
                    <span class="text-xs font-black text-ink-3 group-hover:text-accent tabular-nums">{{ idx + 1 }}</span>
                  </div>
                  <div v-if="idx < guion.partes_guion.length - 1" class="w-px flex-1 bg-border group-hover:bg-accent/30 transition-colors"></div>
                </div>
                <div class="pb-8">
                  <p class="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">{{ p.fase }}</p>
                  <p class="text-sm text-ink leading-relaxed">{{ p.contenido }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Transcripción -->
          <section v-if="guion.transcript" id="transcripcion" class="glass-panel p-8 seccion-detalle">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-sm font-bold text-ink uppercase tracking-[0.2em] flex items-center gap-3">
                <span class="material-symbols-outlined text-accent">notes</span>
                Transcripción del Video
              </h3>
              <button @click="copiarTexto(guion.transcript)" class="text-[10px] font-bold text-accent hover:underline uppercase tracking-widest">
                COPIAR TEXTO
              </button>
            </div>
            <div class="relative overflow-hidden group">
              <div
                class="text-sm text-ink-2 leading-relaxed whitespace-pre-wrap font-serif"
                :class="transcripcionExpandida ? '' : 'max-h-48'"
              >
                {{ guion.transcript }}
              </div>
              <!-- Gradiente fade -->
              <div v-if="!transcripcionExpandida" class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-solid to-transparent pointer-events-none"></div>
            </div>
            <button
              @click="transcripcionExpandida = !transcripcionExpandida"
              class="w-full mt-4 py-2 text-[10px] font-black text-ink-3 hover:text-ink uppercase tracking-[0.3em] transition-colors border-t border-white/5"
            >
              {{ transcripcionExpandida ? 'Colapsar transcripción' : 'Ver transcripción completa' }}
            </button>
          </section>

        </div>
      </main>
    </div>

    <!-- Toast Copy -->
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
          {{ toastMensaje }}
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../lib/api.js'
import { getScoreColor, getScoreBarColor } from '../utils/scores.js'
import { getPlatformBadge } from '../utils/badges.js'

const route = useRoute()
const router = useRouter()
const guion = ref(null)
const cargando = ref(true)
const copiado = ref(false)
const toastVisible = ref(false)
const toastMensaje = ref('')
const transcripcionExpandida = ref(false)
const tabActivo = ref('resumen')

const hashtags = computed(() => {
  if (!guion.value?.transcript) return []
  const matches = guion.value.transcript.match(/#[\wáéíóú]+/g)
  return matches ? [...new Set(matches.map(h => h.slice(1)))] : []
})

const principiosCialdini = computed(() => {
  if (!guion.value) return []
  return [
    { id: 'reciprocidad', label: 'Reciprocidad', detectado: !!guion.value.cialdini_reciprocidad, desc: 'Ofrece algo de valor gratis para generar deuda emocional.' },
    { id: 'escasez',      label: 'Escasez',      detectado: !!guion.value.cialdini_escasez,      desc: 'Genera urgencia limitando el tiempo o disponibilidad.' },
    { id: 'autoridad',    label: 'Autoridad',    detectado: !!guion.value.cialdini_autoridad,    desc: 'Usa credenciales, títulos o pruebas de experto.' },
    { id: 'consistencia', label: 'Consistencia', detectado: !!guion.value.cialdini_consistencia, desc: 'Logra un pequeño compromiso inicial del usuario.' },
    { id: 'simpatia',     label: 'Simpatía',     detectado: !!guion.value.cialdini_simpatia,     desc: 'Genera conexión a través de valores o estilo similar.' },
    { id: 'consenso',     label: 'Prueba Social', detectado: !!guion.value.cialdini_prueba_social, desc: 'Muestra que otros ya confían o usan el producto.' },
    { id: 'unidad',       label: 'Unidad',       detectado: !!guion.value.cialdini_unidad,       desc: 'Crea un sentido de pertenencia a un grupo exclusivo.' },
  ]
})

const tabsDisponibles = computed(() => {
  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'ganchos', label: 'Ganchos' },
    { id: 'neuromarketing', label: 'Neuro' },
    { id: 'estructura', label: 'Estructura' },
  ]
  if (guion.value?.transcript) tabs.push({ id: 'transcripcion', label: 'Transcripción' })
  return tabs
})

async function cargarGuion() {
  cargando.value = true
  try {
    guion.value = await api.guiones.obtener(route.params.id)
  } catch (e) {
    console.error(e)
  } finally {
    cargando.value = false
  }
}

function formatearNumero(n) {
  if (!n) return '0'
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toLocaleString()
}

function irASeccion(id) {
  tabActivo.value = id
  const el = document.getElementById(id)
  if (el) {
    const yOffset = -100 
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

function copiarLink() {
  navigator.clipboard.writeText(window.location.href)
  copiado.value = true
  showToast('¡Link del análisis copiado!')
  setTimeout(() => copiado.value = false, 2000)
}

function copiarTexto(txt) {
  navigator.clipboard.writeText(txt)
  showToast('Texto copiado al portapapeles')
}

function showToast(msg) {
  toastMensaje.value = msg
  toastVisible.value = true
  setTimeout(() => toastVisible.value = false, 3000)
}

// Intersection Observer para actualizar el tab activo al scrollear
let observer = null
onMounted(() => {
  cargarGuion()
  
  setTimeout(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tabActivo.value = entry.target.id
        }
      })
    }, { threshold: 0.5, rootMargin: '-10% 0px -40% 0px' })

    document.querySelectorAll('.seccion-detalle').forEach(sec => observer.observe(sec))
  }, 1000)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>
