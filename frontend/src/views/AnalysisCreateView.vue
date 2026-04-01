<template>
  <div class="flex flex-col gap-8">

    <!-- Encabezado -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
      <div>
        <h1 class="text-3xl font-bold font-headline text-ink mb-1">Nuevo Análisis</h1>
        <p class="text-sm text-ink-3">Extrae patrones de neuromarketing de cualquier video viral</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="px-5 py-2 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="analizando"
          @click="iniciarAnalisis"
        >
          <span class="material-symbols-outlined text-[18px]" :class="analizando ? 'animate-spin' : ''">
            {{ analizando ? 'hourglass_top' : 'play_arrow' }}
          </span>
          {{ analizando ? 'Analizando…' : 'Iniciar Análisis' }}
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">

      <!-- Columna del Formulario -->
      <div class="xl:col-span-7 flex flex-col gap-6">

        <!-- Paso 1: Fuente del Video -->
        <section class="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-border bg-surface-muted/50 flex items-center gap-3">
            <span class="w-6 h-6 rounded-md bg-accent text-white text-xs font-bold flex items-center justify-center">1</span>
            <h2 class="text-sm font-semibold text-ink">Fuente del Video</h2>
          </div>
          <div class="p-6 space-y-5">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide">URL del Video</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 text-[18px]">link</span>
                <input
                  v-model="form.url"
                  type="url"
                  placeholder="https://www.tiktok.com/@usuario/video/..."
                  class="w-full bg-canvas border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all"
                  :disabled="analizando"
                />
              </div>
              <p class="text-[11px] text-ink-3">Compatible con TikTok, Instagram Reels y YouTube Shorts.</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide">Cliente</label>
                <select
                  v-model="form.cliente_id"
                  class="w-full bg-canvas border border-border rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 appearance-none transition-all"
                  :disabled="analizando"
                >
                  <option :value="null">Interno / Sin cliente</option>
                  <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nombre }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide">Proyecto (opcional)</label>
                <input
                  v-model="form.proyecto_nombre"
                  type="text"
                  placeholder="Ej. Campaña Q1"
                  class="w-full bg-canvas border border-border rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                  :disabled="analizando"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Paso 2: Inteligencia de Mercado -->
        <section class="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-border bg-surface-muted/50 flex items-center gap-3">
            <span class="w-6 h-6 rounded-md bg-success text-white text-xs font-bold flex items-center justify-center">2</span>
            <h2 class="text-sm font-semibold text-ink">Inteligencia de Mercado</h2>
          </div>
          <div class="p-6 space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide">Nicho Principal</label>
                <input
                  v-model="form.niche"
                  list="nichos-list"
                  placeholder="Seleccionar o escribir…"
                  class="w-full bg-canvas border border-border rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                  :disabled="analizando"
                />
                <datalist id="nichos-list">
                  <option v-for="n in nichos" :key="n" :value="n">{{ n }}</option>
                </datalist>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide">Audiencia Objetivo</label>
                <input
                  v-model="form.mercado_objetivo"
                  type="text"
                  placeholder="Ej. Emprendedoras 25-35 años"
                  class="w-full bg-canvas border border-border rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                  :disabled="analizando"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide">Vistas <span class="text-error normal-case font-normal">*</span></label>
                <input v-model.number="form.vistas" type="number" min="1" placeholder="Ej. 250000" class="w-full bg-canvas border border-border rounded-lg px-3 py-2.5 text-sm text-ink text-center focus:outline-none focus:ring-2 focus:ring-accent/30" :disabled="analizando"/>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide">Likes <span class="text-error normal-case font-normal">*</span></label>
                <input v-model.number="form.likes" type="number" min="1" placeholder="Ej. 18000" class="w-full bg-canvas border border-border rounded-lg px-3 py-2.5 text-sm text-ink text-center focus:outline-none focus:ring-2 focus:ring-accent/30" :disabled="analizando"/>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide">Compartidos</label>
                <input v-model.number="form.compartidos" type="number" min="0" placeholder="Ej. 3200" class="w-full bg-canvas border border-border rounded-lg px-3 py-2.5 text-sm text-ink text-center focus:outline-none focus:ring-2 focus:ring-accent/30" :disabled="analizando"/>
              </div>
            </div>

            <label class="flex items-center gap-3 cursor-pointer group">
              <input
                v-model="form.competidor_referente"
                type="checkbox"
                class="w-4 h-4 rounded border-border text-accent focus:ring-accent/30 focus:ring-offset-0 transition-all cursor-pointer"
                :disabled="analizando"
              />
              <span class="text-sm text-ink-2 group-hover:text-ink transition-colors select-none">
                Marcar como referencia de competidor estratégico
              </span>
            </label>
          </div>
        </section>

        <!-- Paso 3: Contexto del Video -->
        <section class="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-border bg-surface-muted/50 flex items-center gap-3">
            <span class="w-6 h-6 rounded-md bg-warn text-white text-xs font-bold flex items-center justify-center">3</span>
            <h2 class="text-sm font-semibold text-ink">
              Contexto del Video
              <span class="text-ink-3 font-normal ml-1">(opcional)</span>
            </h2>
          </div>
          <div class="p-6">
            <p class="text-xs text-ink-3 leading-relaxed mb-3">
              Describe la intención del creador o cualquier contexto que la transcripción no capture. GPT-4o lo usará para enriquecer el análisis.
            </p>
            <textarea
              v-model="form.contexto_video"
              rows="3"
              placeholder="Ej. Este video responde a una tendencia viral usando humor sarcástico dirigido a emprendedores…"
              class="w-full bg-canvas border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none leading-relaxed transition-all"
              :disabled="analizando"
            ></textarea>
          </div>
        </section>
      </div>

      <!-- Panel de Estado del Pipeline -->
      <div class="xl:col-span-5">
        <div class="sticky top-24 bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 class="text-sm font-semibold text-ink">Estado del Pipeline</h3>
              <p class="text-[11px] text-ink-3 mt-0.5">Proceso de análisis en tiempo real</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" :class="analizando ? 'bg-success animate-pulse' : 'bg-border-strong'"></span>
              <span class="text-[11px] font-medium" :class="analizando ? 'text-success' : 'text-ink-3'">
                {{ analizando ? 'Activo' : 'En espera' }}
              </span>
            </div>
          </div>

          <div class="p-6">
            <div class="space-y-5 relative">
              <!-- Línea vertical conectora -->
              <div class="absolute left-[14px] top-4 bottom-4 w-px bg-border z-0"></div>

              <div
                v-for="(s, idx) in pasosVisibles"
                :key="s.id"
                class="flex gap-4 relative z-10"
                :class="idx > currentStepIdx && analizando ? 'opacity-40' : 'opacity-100'"
              >
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 bg-surface"
                  :class="
                    idx < currentStepIdx
                      ? 'bg-success border-2 border-success text-white step-pulse'
                      : idx === currentStepIdx && analizando
                        ? 'bg-accent border-2 border-accent text-white step-pulse'
                        : 'border-2 border-border text-ink-3'
                  "
                >
                  <span class="material-symbols-outlined text-[14px]">{{ idx < currentStepIdx ? 'check' : s.icon }}</span>
                </div>
                <div class="pt-0.5">
                  <p class="text-sm font-medium" :class="idx === currentStepIdx && analizando ? 'text-ink' : 'text-ink-2'">{{ s.label }}</p>
                  <p class="text-[11px] text-ink-3 mt-0.5">{{ s.desc }}</p>
                </div>
              </div>
            </div>

            <!-- Progreso -->
            <div v-if="analizando" class="mt-6 pt-5 border-t border-border space-y-2">
              <div class="w-full bg-surface-subtle h-1.5 rounded-full overflow-hidden">
                <div
                  class="bg-accent h-full rounded-full transition-all duration-500"
                  :style="{ width: ((currentStepIdx / 3) * 100) + '%' }"
                ></div>
              </div>
              <p class="text-[11px] text-ink-3 text-center">Tiempo estimado: ~15 segundos · GPT-4o + Whisper</p>
            </div>

            <!-- Error -->
            <div v-if="error" class="mt-5 p-4 rounded-lg bg-error-subtle border border-error-border text-error text-sm">
              <p class="font-semibold mb-1">Error en el pipeline</p>
              <p class="text-[12px] leading-relaxed">{{ error }}</p>
            </div>

            <!-- Estado inicial -->
            <div v-if="!analizando && !error" class="mt-6 pt-5 border-t border-border">
              <p class="text-[11px] text-ink-3 leading-relaxed">
                Completa la URL y el nicho para iniciar. El pipeline extrae audio, transcribe y analiza los patrones de neuromarketing automáticamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../lib/api.js'

const router = useRouter()
const analizando = ref(false)
const error  = ref(null)
const paso   = ref('inicio')

const nichos   = ref([])
const clientes = ref([])

const form = ref({
  url: '',
  niche: '',
  sub_niche: '',
  mercado_objetivo: '',
  vistas: null,
  likes: null,
  compartidos: null,
  cliente_id: null,
  proyecto_nombre: '',
  competidor_referente: false,
  contexto_video: ''
})

const pasosVisibles = [
  { id: 'extraccion',    label: 'Extracción de Audio',    icon: 'downloading', desc: 'Descargando el video y extrayendo el audio.' },
  { id: 'transcripcion', label: 'Transcripción Whisper',  icon: 'mic',         desc: 'Convirtiendo audio a texto con precisión.' },
  { id: 'analisis',      label: 'Análisis con GPT-4o',    icon: 'psychology',  desc: 'Identificando patrones de neuromarketing.' },
  { id: 'embedding',     label: 'Codificación Vectorial', icon: 'hub',         desc: 'Guardando en la base de datos.' },
]

const currentStepIdx = computed(() => {
  if (!analizando.value) return -1
  return pasosVisibles.findIndex(p => p.id === paso.value)
})

onMounted(async () => {
  try {
    const [n, c] = await Promise.all([api.nichos(), api.clientes()])
    nichos.value   = n
    clientes.value = c
  } catch (e) { console.error(e) }
})

async function iniciarAnalisis() {
  if (!form.value.url || !form.value.niche) {
    error.value = "URL y Nicho son obligatorios para iniciar el pipeline."
    return
  }
  if (!form.value.vistas || form.value.vistas <= 0 || !form.value.likes || form.value.likes <= 0) {
    error.value = "Vistas y Likes son obligatorios. Cópialos directamente del video antes de analizar."
    return
  }

  const URL_SOPORTADAS = /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com|instagram\.com|youtube\.com|youtu\.be)/
  if (!URL_SOPORTADAS.test(form.value.url)) {
    error.value = "URL no soportada. Solo se aceptan TikTok, Instagram Reels y YouTube Shorts."
    return
  }

  analizando.value = true
  error.value  = null
  paso.value   = 'extraccion'

  const fakeInterval = setInterval(() => {
    if (paso.value === 'extraccion') paso.value = 'transcripcion';
    else if (paso.value === 'transcripcion') paso.value = 'analisis';
    else if (paso.value === 'analisis') paso.value = 'embedding';
  }, 4000)

  try {
    const res = await api.analizar(form.value)
    clearInterval(fakeInterval)
    paso.value = 'embedding'
    setTimeout(() => {
      router.push({ name: 'AnalysisDetail', params: { id: res.guion_id } })
    }, 1000)
  } catch (err) {
    clearInterval(fakeInterval)
    error.value = err.message
  } finally {
    analizando.value = false
  }
}
</script>
