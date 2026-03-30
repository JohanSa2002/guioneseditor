<template>
  <div class="max-w-7xl mx-auto flex flex-col gap-10">
    <!-- Encabezado -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
      <div>
        <h1 class="text-5xl font-extrabold font-headline tracking-tighter text-white mb-2 leading-tight">Nuevo Análisis de Video</h1>
        <p class="text-primary text-sm font-bold flex items-center gap-2 tracking-widest uppercase">
          <span class="material-symbols-outlined text-sm">rocket_launch</span>
          Motor de Pipeline GPT-4o + Whisper
        </p>
      </div>
      <div class="flex items-center gap-4">
        <button class="px-6 py-3 bg-surface-container border border-white/5 text-outline font-bold rounded-xl text-sm hover:text-white transition-colors">Guardar Borrador</button>
        <button class="px-8 py-3 bg-gradient-to-br from-primary-container to-primary text-on-primary-container font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm h-12 flex items-center gap-2" :disabled="analizando" @click="iniciarAnalisis">
          <span class="material-symbols-outlined text-sm">{{ analizando ? 'hourglass_top' : 'auto_fix_high' }}</span>
          {{ analizando ? 'Analizando...' : 'Iniciar Pipeline' }}
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-12">
      <!-- Columna del Formulario -->
      <div class="xl:col-span-7 flex flex-col gap-10">
        <!-- Paso 1: Fuente -->
        <section class="space-y-6">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20">01</span>
            <h2 class="text-xl font-headline font-extrabold text-white tracking-tight">Identificación de Fuente</h2>
          </div>

          <div class="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">URL del Video</label>
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-lg group-focus-within:animate-pulse">link</span>
                <input v-model="form.url" type="url" placeholder="https://www.tiktok.com/@usuario/video/..." class="w-full bg-surface-container-low border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary/40 text-white placeholder:text-outline/40 transition-all font-medium font-serif" :disabled="analizando"/>
              </div>
              <p class="text-[10px] text-outline/60 italic px-1">Compatible con TikTok, Instagram Reels y YouTube Shorts.</p>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Organización / Cliente</label>
                <select v-model="form.cliente_id" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface font-medium appearance-none transition-all shadow-inner" :disabled="analizando">
                  <option :value="null">Interno / Sin cliente</option>
                  <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nombre }}</option>
                </select>
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Nombre del Proyecto (opcional)</label>
                <input v-model="form.proyecto_nombre" type="text" placeholder="Ej. Campaña Q1" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface font-medium transition-all shadow-inner" :disabled="analizando"/>
              </div>
            </div>
          </div>
        </section>

        <!-- Paso 2: Métricas de Mercado -->
        <section class="space-y-6">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-black text-sm border border-secondary/20">02</span>
            <h2 class="text-xl font-headline font-extrabold text-white tracking-tight">Inteligencia de Mercado</h2>
          </div>

          <div class="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Nicho Principal</label>
                <div class="relative">
                  <input v-model="form.niche" list="nichos-list" placeholder="Seleccionar o escribir..." class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface font-black uppercase tracking-widest shadow-inner" :disabled="analizando"/>
                  <datalist id="nichos-list">
                    <option v-for="n in nichos" :key="n" :value="n">{{ n }}</option>
                  </datalist>
                </div>
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Audiencia Objetivo</label>
                <input v-model="form.mercado_objetivo" type="text" placeholder="Ej. Emprendedoras 25-35 años" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface font-medium shadow-inner" :disabled="analizando"/>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-6">
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Vistas</label>
                <input v-model.number="form.vistas" type="number" placeholder="0" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface font-bold text-center" :disabled="analizando"/>
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Likes</label>
                <input v-model.number="form.likes" type="number" placeholder="0" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface font-bold text-center" :disabled="analizando"/>
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Compartidos / Guardados</label>
                <input v-model.number="form.compartidos" type="number" placeholder="0" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface font-bold text-center" :disabled="analizando"/>
              </div>
            </div>

            <div class="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-white/5">
              <input v-model="form.competidor_referente" type="checkbox" id="check-comp" class="w-5 h-5 rounded border-white/10 bg-surface text-primary focus:ring-primary focus:ring-offset-surface-container ring-offset-2 transition-all cursor-pointer" :disabled="analizando"/>
              <label for="check-comp" class="text-xs font-bold text-on-surface cursor-pointer select-none">Marcar como Referencia de Competidor Estratégico</label>
            </div>
          </div>
        </section>

        <!-- Paso 3: Contexto del Video -->
        <section class="space-y-6">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center font-black text-sm border border-tertiary/20">03</span>
            <h2 class="text-xl font-headline font-extrabold text-white tracking-tight">Contexto del Video <span class="text-outline font-normal text-base">(opcional)</span></h2>
          </div>

          <div class="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl space-y-4">
            <p class="text-xs text-outline/70 leading-relaxed">
              Describe de qué trata el video, cuál era la intención del creador, o cualquier detalle que la transcripción sola no captura (ej. tono irónico, contexto de tendencia, referencia cultural). GPT-4o usará esto para enriquecer el análisis.
            </p>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-4 text-tertiary text-lg">lightbulb</span>
              <textarea
                v-model="form.contexto_video"
                rows="4"
                placeholder="Ej. Este video es una respuesta a una tendencia viral donde los creadores muestran su rutina matutina. El creador usa humor sarcástico y habla a emprendedores que trabajan desde casa..."
                class="w-full bg-surface-container-low border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary/40 text-white placeholder:text-outline/40 transition-all resize-none leading-relaxed"
                :disabled="analizando"
              ></textarea>
            </div>
          </div>
        </section>
      </div>

      <!-- Columna de Estado del Pipeline -->
      <div class="xl:col-span-5 flex flex-col gap-6">
        <div class="sticky top-24">
          <div class="bg-surface-container p-8 rounded-[40px] border border-outline-variant/10 shadow-3xl relative overflow-hidden flex flex-col gap-8">
            <div class="absolute -top-12 -right-12 w-32 h-32 bg-secondary/10 blur-3xl rounded-full"></div>

            <div class="flex items-center justify-between border-b border-white/5 pb-6">
              <div>
                <h3 class="text-sm font-headline font-black text-white uppercase tracking-widest mb-1">Motor de Pipeline</h3>
                <p class="text-[10px] text-outline uppercase font-bold tracking-tight">Estado del análisis en tiempo real</p>
              </div>
              <div class="flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full border border-white/5">
                <span class="w-1.5 h-1.5 rounded-full" :class="analizando ? 'bg-secondary animate-pulse' : 'bg-outline/30'"></span>
                <span class="text-[10px] font-black tracking-widest uppercase" :class="analizando ? 'text-secondary' : 'text-outline'">{{ analizando ? 'Activo' : 'En espera' }}</span>
              </div>
            </div>

            <div class="space-y-8 relative">
              <div class="absolute left-4 top-2 bottom-2 w-px bg-white/5 z-0"></div>

              <div v-for="(s, idx) in pasosVisibles" :key="s.id" class="flex gap-4 relative z-10" :class="idx > currentStepIdx ? 'opacity-30' : 'opacity-100'">
                <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300" :class="idx === currentStepIdx ? 'bg-secondary text-on-secondary shadow-lg shadow-secondary/40 scale-110' : (idx < currentStepIdx ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-outline')">
                  <span class="material-symbols-outlined text-sm font-black">{{ idx < currentStepIdx ? 'check' : s.icon }}</span>
                </div>
                <div>
                   <p class="text-xs font-black uppercase tracking-widest mb-1" :class="idx === currentStepIdx ? 'text-white' : 'text-outline'">{{ s.label }}</p>
                   <p class="text-[10px] font-bold tracking-tight leading-none" :class="idx === currentStepIdx ? 'text-secondary' : 'text-outline/40'">{{ s.desc }}</p>
                </div>
              </div>
            </div>

            <div v-if="error" class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-[11px] font-bold leading-relaxed shadow-lg">
              <div class="flex items-center gap-2 mb-1">
                <span class="material-symbols-outlined text-sm">report</span>
                <span class="uppercase tracking-widest">Error en el Pipeline</span>
              </div>
              {{ error }}
            </div>

            <div v-if="analizando" class="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
              <div class="w-full bg-surface-container-low h-1 rounded-full overflow-hidden">
                <div class="bg-secondary h-full transition-all duration-500" :style="{ width: ((currentStepIdx / 4) * 100) + '%' }"></div>
              </div>
              <p class="text-[10px] text-outline italic text-center animate-pulse">Procesando embeddings vectoriales y solicitud a OpenAI. Tiempo estimado: 15s</p>
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
  { id: 'extraccion',   label: 'Extracción de Audio',   icon: 'downloading', desc: 'Descargando el video fuente y extrayendo el audio.' },
  { id: 'transcripcion', label: 'Transcripción Whisper', icon: 'mic',         desc: 'Generando transcripción con precisión de milisegundos.' },
  { id: 'analisis',     label: 'Análisis con GPT-4o',   icon: 'psychology',  desc: 'Analizando patrones de neuromarketing y narrativa.' },
  { id: 'embedding',    label: 'Codificación Vectorial', icon: 'hub',         desc: 'Generando embedding e inyectando en la base de datos.' },
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
