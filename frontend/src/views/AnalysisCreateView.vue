<template>
  <div class="max-w-6xl mx-auto flex flex-col gap-8 pb-20">
    
    <!-- Encabezado -->
    <header class="flex flex-col gap-2">
      <div class="flex items-center gap-3">
        <router-link to="/" class="p-2 rounded-xl hover:bg-white/5 text-ink-3 hover:text-ink transition-colors">
          <span class="material-symbols-outlined text-[20px]">arrow_back</span>
        </router-link>
        <h1 class="text-3xl font-bold font-headline text-ink">Nuevo Análisis</h1>
      </div>
      <p class="text-sm text-ink-3 ml-12">Extrae patrones virales y neuromarketing de cualquier video</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Formulario Principal -->
      <div class="lg:col-span-7 flex flex-col gap-6">
        <div class="glass-panel p-8 flex flex-col gap-8 relative overflow-hidden">
          
          <!-- URL del Video -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-bold text-ink-3 uppercase tracking-widest flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-accent">link</span>
                URL del Video Viral
              </label>
              <span v-if="errorUrl" class="text-[10px] font-bold text-error uppercase tracking-tighter">{{ errorUrl }}</span>
              <span v-else-if="form.url && !errorUrl" class="text-[10px] font-bold text-success uppercase tracking-tighter">URL VÁLIDA</span>
            </div>
            <input
              v-model="form.url"
              type="text"
              placeholder="https://www.tiktok.com/@user/video/..."
              class="input-base text-lg py-4"
              :class="[errorUrl ? 'border-error/50 focus:ring-error/20' : '', form.url && !errorUrl ? 'border-success/50 focus:ring-success/20' : '']"
              :disabled="analizando"
            />
            <p class="text-[10px] text-ink-3 italic">Soportamos TikTok, Instagram Reels y YouTube Shorts.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nicho con ComboBox -->
            <div class="space-y-3">
              <label class="text-[11px] font-bold text-ink-3 uppercase tracking-widest flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-accent">category</span>
                Nicho Principal
              </label>
              <ComboBox
                v-model="form.niche"
                :options="nichosPredefinidos"
                placeholder="Selecciona o escribe..."
                icon="search"
                :disabled="analizando"
              />
            </div>

            <!-- Plataforma -->
            <div class="space-y-3">
              <label class="text-[11px] font-bold text-ink-3 uppercase tracking-widest flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-accent">language</span>
                Plataforma
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="p in ['tiktok', 'reels', 'shorts']"
                  :key="p"
                  @click="form.plataforma = p"
                  type="button"
                  class="py-3 rounded-xl border transition-all flex flex-col items-center gap-1 group"
                  :class="form.plataforma === p ? 'bg-accent/10 border-accent text-accent shadow-neon-accent' : 'bg-white/5 border-border text-ink-3 hover:border-border-strong'"
                  :disabled="analizando"
                >
                  <span class="text-[10px] font-black uppercase tracking-tighter">{{ p }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Métricas de Engagement -->
          <div class="space-y-4">
            <label class="text-[11px] font-bold text-ink-3 uppercase tracking-widest flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px] text-accent">analytics</span>
              Métricas de Engagement (Contexto)
            </label>
            <div class="grid grid-cols-3 gap-4">
              <div class="space-y-2">
                <p class="text-[9px] font-bold text-ink-3 uppercase text-center">Vistas</p>
                <input v-model.number="form.vistas" type="number" class="input-base text-center font-bold tabular-nums" placeholder="0" :disabled="analizando"/>
              </div>
              <div class="space-y-2">
                <p class="text-[9px] font-bold text-ink-3 uppercase text-center">Likes</p>
                <input v-model.number="form.likes" type="number" class="input-base text-center font-bold tabular-nums" placeholder="0" :disabled="analizando"/>
              </div>
              <div class="space-y-2">
                <p class="text-[9px] font-bold text-ink-3 uppercase text-center">Compartidos</p>
                <input v-model.number="form.compartidos" type="number" class="input-base text-center font-bold tabular-nums" placeholder="0" :disabled="analizando"/>
              </div>
            </div>
          </div>

          <!-- Contexto Visual del Video -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-bold text-ink-3 uppercase tracking-widest flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-accent">videocam</span>
                Contexto Visual del Video
              </label>
              <span class="text-[10px] text-ink-3 italic">Opcional pero mejora el análisis</span>
            </div>
            <textarea
              v-model="form.contexto_video"
              rows="4"
              placeholder="Describe los primeros segundos: plano, inclinación de cámara, texto en pantalla, tipo de música, palabras clave visuales...
Ej: Plano medio frontal, cámara fija, música lo-fi de fondo, texto rojo parpadeante en pantalla que dice '¿Sabías esto?', creador apunta directo a cámara."
              class="input-base py-3 resize-none leading-relaxed text-sm"
              :disabled="analizando"
            ></textarea>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tip in contextTips"
                :key="tip"
                type="button"
                @click="appendContextTip(tip)"
                :disabled="analizando"
                class="px-2.5 py-1 rounded-lg bg-white/5 border border-border text-[10px] font-bold text-ink-3 hover:border-accent/40 hover:text-accent transition-all"
              >+ {{ tip }}</button>
            </div>
          </div>

          <!-- Botón de Acción -->
          <div class="pt-4">
            <button
              @click="iniciarAnalisis"
              class="btn-primary w-full py-5 text-lg group overflow-hidden relative"
              :disabled="analizando || !form.url || !form.niche"
            >
              <div v-if="analizando" class="flex items-center gap-3">
                <div class="w-5 h-5 border-2 border-canvas/30 border-t-canvas rounded-full animate-spin"></div>
                <span>Analizando tu video...</span>
              </div>
              <div v-else class="flex items-center justify-center gap-3">
                <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">bolt</span>
                <span>Analizar este video</span>
              </div>
              
              <!-- Glow effect on hover -->
              <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Pipeline de Estado -->
      <div class="lg:col-span-5 flex flex-col gap-6 sticky top-8">
        <div class="glass-panel p-6 overflow-hidden">
          <h2 class="text-sm font-bold text-ink uppercase tracking-widest mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-accent">settings_suggest</span>
            ¿Qué está haciendo la IA?
          </h2>

          <!-- Barra de progreso global -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-2">
              <p class="text-[10px] font-bold text-ink-3 uppercase">Progreso</p>
              <p class="text-[10px] font-bold text-accent tabular-nums">{{ Math.round(progresoVisual) }}%</p>
            </div>
            <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-border">
              <div
                class="h-full bg-accent shadow-neon-accent transition-all duration-500 ease-out"
                :style="{ width: progresoVisual + '%' }"
              ></div>
            </div>
          </div>

          <!-- Pasos -->
          <div class="space-y-2 relative">
            <!-- Línea conectora -->
            <div class="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border"></div>

            <div
              v-for="(p, idx) in pasosVisibles"
              :key="p.id"
              class="relative pl-12 py-3 transition-all duration-500"
              :class="[
                p.id === pasoActualId ? 'opacity-100' : 'opacity-40',
                pasoActualIdx > idx ? 'opacity-100' : ''
              ]"
            >
              <!-- Punto del paso -->
              <div
                class="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-4 border-canvas z-10 flex items-center justify-center transition-all duration-500"
                :class="[
                  pasoActualId === p.id ? 'bg-accent text-canvas shadow-neon-accent scale-110 step-pulse' : 
                  pasoActualIdx > idx ? 'bg-success text-canvas' : 'bg-surface-subtle text-ink-3'
                ]"
              >
                <span class="material-symbols-outlined text-[18px] font-bold">
                  {{ pasoActualIdx > idx ? 'check' : p.icon }}
                </span>
              </div>

              <div>
                <p class="text-[11px] font-bold uppercase tracking-wider" :class="pasoActualId === p.id ? 'text-accent' : 'text-ink'">
                  {{ p.label }}
                </p>
                <p class="text-[10px] text-ink-3 leading-tight mt-0.5">{{ p.desc }}</p>
              </div>
            </div>
          </div>

          <!-- Panel de Error -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform translate-y-4 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
          >
            <div v-if="errorAnalisis" class="mt-8 p-4 rounded-xl bg-error-subtle border border-error-border">
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-error">error</span>
                <div class="flex-1">
                  <p class="text-xs font-bold text-error uppercase mb-1">Error en el Pipeline</p>
                  <p class="text-xs text-ink leading-relaxed">{{ errorAnalisis }}</p>
                  <button @click="reintentar" class="mt-3 text-[10px] font-bold text-error hover:underline uppercase tracking-widest">
                    Volver a intentar
                  </button>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Timer -->
          <div v-if="analizando" class="mt-6 flex items-center justify-center gap-2 text-ink-3">
            <span class="material-symbols-outlined text-[16px] animate-spin">schedule</span>
            <span class="text-[11px] font-bold tabular-nums">Tiempo: {{ tiempoFormateado }}</span>
          </div>
        </div>

        <!-- Info Card -->
        <div class="glass-panel p-6 bg-accent-subtle/5 border-accent-border/20">
          <h3 class="text-xs font-bold text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">lightbulb</span>
            ¿Sabías que?
          </h3>
          <p class="text-[11px] text-ink-2 leading-relaxed italic">
            Cuanto más contexto des sobre el video (música, cámara, texto en pantalla), más preciso será el análisis.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../lib/api.js'
import ComboBox from '../components/ComboBox.vue'

const router = useRouter()

const form = ref({
  url: '',
  niche: '',
  plataforma: 'tiktok',
  vistas: null,
  likes: null,
  compartidos: null,
  contexto_video: ''
})

const contextTips = [
  'Plano medio', 'Plano detalle', 'Cámara en mano', 'Cámara fija',
  'Música upbeat', 'Música lo-fi', 'Sin música', 'Voz en off',
  'Texto en pantalla', 'Subtítulos animados', 'Transición rápida', 'Zoom agresivo',
]

function appendContextTip(tip) {
  const sep = form.value.contexto_video ? ', ' : ''
  form.value.contexto_video += sep + tip
}

const analizando = ref(false)
const errorAnalisis = ref(null)
const tiempoInicio = ref(null)
const tiempoActual = ref(null)
const timerInterval = ref(null)

const nichosPredefinidos = [
  'Fitness & Bienestar',
  'Emprendimiento & Negocios',
  'Tecnología & Gadgets',
  'Cocina & Recetas',
  'Moda & Estilo',
  'Viajes & Lifestyle',
  'Educación & Tutoriales',
  'Marketing & Redes Sociales',
  'Finanzas Personales',
  'Desarrollo Personal'
]

const pasosVisibles = [
  { id: 'extraccion',    label: 'Descargando el video',         icon: 'download',    desc: 'Accediendo al audio de tu video...' },
  { id: 'transcripcion', label: 'Escuchando lo que se dice',    icon: 'hearing',     desc: 'Convirtiendo el audio en texto...' },
  { id: 'analisis',      label: 'Analizando el contenido',      icon: 'manage_search', desc: 'Detectando ganchos, emociones y patrones virales...' },
  { id: 'embedding',     label: 'Guardando en tu biblioteca',   icon: 'save',        desc: 'Registrando el análisis para futuras generaciones...' },
]

const pasoActualId = ref(null)
const progresoReal = ref(0) // 0 a 100

const progresoVisual = computed(() => {
  if (!analizando.value && !errorAnalisis.value && progresoReal.value === 0) return 0
  if (progresoReal.value >= 100) return 100
  
  // Basado en el paso actual
  const idx = pasosVisibles.findIndex(p => p.id === pasoActualId.value)
  if (idx === -1) return 0
  
  // Cada paso es el 25% del total
  const base = (idx / pasosVisibles.length) * 100
  // Le sumamos un pequeño offset para que se vea movimiento
  return Math.min(base + 10, 95)
})

const pasoActualIdx = computed(() => pasosVisibles.findIndex(p => p.id === pasoActualId.value))

const tiempoFormateado = computed(() => {
  if (!tiempoInicio.value || !tiempoActual.value) return '00s'
  const diff = Math.floor((tiempoActual.value - tiempoInicio.value) / 1000)
  if (diff < 60) return `${diff}s`
  const m = Math.floor(diff / 60)
  const s = diff % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

const errorUrl = computed(() => {
  if (!form.value.url) return null
  try {
    const u = new URL(form.value.url)
    if (!['tiktok.com', 'instagram.com', 'youtube.com', 'youtu.be', 'www.tiktok.com', 'www.instagram.com', 'www.youtube.com'].some(d => u.hostname.includes(d))) {
      return 'Dominio no soportado'
    }
  } catch (e) {
    return 'URL inválida'
  }
  return null
})

async function iniciarAnalisis() {
  if (errorUrl.value) return
  if (!form.value.niche) return

  analizando.value = true
  errorAnalisis.value = null
  progresoReal.value = 5
  pasoActualId.value = 'extraccion'
  
  tiempoInicio.value = Date.now()
  tiempoActual.value = Date.now()
  timerInterval.value = setInterval(() => {
    tiempoActual.value = Date.now()
  }, 1000)

  // Simulación de flujo de pasos (hasta tener WebSockets/SSE)
  const pipeSim = async () => {
    if (!analizando.value) return
    await new Promise(r => setTimeout(r, 4000))
    if (!analizando.value) return
    pasoActualId.value = 'transcripcion'
    await new Promise(r => setTimeout(r, 6000))
    if (!analizando.value) return
    pasoActualId.value = 'analisis'
    await new Promise(r => setTimeout(r, 5000))
    if (!analizando.value) return
    pasoActualId.value = 'embedding'
  }
  
  pipeSim()

  try {
    const res = await api.analizar(form.value)
    progresoReal.value = 100
    clearInterval(timerInterval.value)
    
    // Pequeña pausa para que el usuario vea el 100%
    setTimeout(() => {
      router.push({ name: 'AnalysisDetail', params: { id: res.guion_id } })
    }, 1200)
    
  } catch (err) {
    analizando.value = false
    errorAnalisis.value = err.message || 'Error desconocido al procesar el video'
    clearInterval(timerInterval.value)
  }
}

function reintentar() {
  errorAnalisis.value = null
  progresoReal.value = 0
  pasoActualId.value = null
}

onUnmounted(() => {
  if (timerInterval.value) clearInterval(timerInterval.value)
})
</script>
