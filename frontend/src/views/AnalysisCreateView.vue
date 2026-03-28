<template>
  <div class="max-w-7xl mx-auto flex flex-col gap-10">
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
      <div>
        <h1 class="text-5xl font-extrabold font-headline tracking-tighter text-white mb-2 leading-tight">New Video Analysis</h1>
        <p class="text-primary text-sm font-bold flex items-center gap-2 tracking-widest uppercase">
          <span class="material-symbols-outlined text-sm">rocket_launch</span>
          GPT-4o + Whisper Pipeline Engine
        </p>
      </div>
      <div class="flex items-center gap-4">
        <button class="px-6 py-3 bg-surface-container border border-white/5 text-outline font-bold rounded-xl text-sm hover:text-white transition-colors">Save as Draft</button>
        <button class="px-8 py-3 bg-gradient-to-br from-primary-container to-primary text-on-primary-container font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm h-12 flex items-center gap-2" :disabled="analizando" @click="iniciarAnalisis">
          <span class="material-symbols-outlined text-sm">{{ analizando ? 'hourglass_top' : 'auto_fix_high' }}</span>
          {{ analizando ? 'Analyzing...' : 'Start Pipeline' }}
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-12">
      <!-- Form Column -->
      <div class="xl:col-span-7 flex flex-col gap-10">
        <!-- Step 1: Source -->
        <section class="space-y-6">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20">01</span>
            <h2 class="text-xl font-headline font-extrabold text-white tracking-tight">Source Identification</h2>
          </div>
          
          <div class="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Video Destination URL</label>
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-lg group-focus-within:animate-pulse">link</span>
                <input v-model="form.url" type="url" placeholder="https://www.tiktok.com/@user/video/..." class="w-full bg-surface-container-low border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary/40 text-white placeholder:text-outline/40 transition-all font-medium font-serif" :disabled="analizando"/>
              </div>
              <p class="text-[10px] text-outline/60 italic px-1">Supports TikTok, Instagram Reels and YouTube Shorts.</p>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Organization / Client</label>
                <select v-model="form.cliente_id" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface font-medium appearance-none transition-all shadow-inner" :disabled="analizando">
                  <option :value="null">In-house / Internal</option>
                  <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nombre }}</option>
                </select>
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Project Name (Optional)</label>
                <input v-model="form.proyecto_nombre" type="text" placeholder="e.g. Q1 Campaign" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface font-medium transition-all shadow-inner" :disabled="analizando"/>
              </div>
            </div>
          </div>
        </section>

        <!-- Step 2: Contextual Metrics -->
        <section class="space-y-6">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-black text-sm border border-secondary/20">02</span>
            <h2 class="text-xl font-headline font-extrabold text-white tracking-tight">Market Intelligence</h2>
          </div>

          <div class="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Primary Niche</label>
                <div class="relative">
                  <input v-model="form.niche" list="nichos-list" placeholder="Select or type..." class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface font-black uppercase tracking-widest shadow-inner" :disabled="analizando"/>
                  <datalist id="nichos-list">
                    <option v-for="n in nichos" :key="n" :value="n">{{ n }}</option>
                  </datalist>
                </div>
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Target Audience</label>
                <input v-model="form.mercado_objetivo" type="text" placeholder="e.g. Female Entrepreneurs 25-35" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface font-medium shadow-inner" :disabled="analizando"/>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-6">
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Views</label>
                <input v-model.number="form.vistas" type="number" placeholder="0" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface font-bold text-center" :disabled="analizando"/>
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Likes</label>
                <input v-model.number="form.likes" type="number" placeholder="0" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface font-bold text-center" :disabled="analizando"/>
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Shares / Saves</label>
                <input v-model.number="form.compartidos" type="number" placeholder="0" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface font-bold text-center" :disabled="analizando"/>
              </div>
            </div>

            <div class="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-white/5">
              <input v-model="form.competidor_referente" type="checkbox" id="check-comp" class="w-5 h-5 rounded border-white/10 bg-surface text-primary focus:ring-primary focus:ring-offset-surface-container ring-offset-2 transition-all cursor-pointer" :disabled="analizando"/>
              <label for="check-comp" class="text-xs font-bold text-on-surface cursor-pointer select-none">Mark as Strategic Competitor Reference</label>
            </div>
          </div>
        </section>
      </div>

      <!-- Status Column -->
      <div class="xl:col-span-5 flex flex-col gap-6">
        <div class="sticky top-24">
          <div class="bg-surface-container p-8 rounded-[40px] border border-outline-variant/10 shadow-3xl relative overflow-hidden flex flex-col gap-8">
            <div class="absolute -top-12 -right-12 w-32 h-32 bg-secondary/10 blur-3xl rounded-full"></div>
            
            <div class="flex items-center justify-between border-b border-white/5 pb-6">
              <div>
                <h3 class="text-sm font-headline font-black text-white uppercase tracking-widest mb-1">Pipeline Engine</h3>
                <p class="text-[10px] text-outline uppercase font-bold tracking-tight">Real-time Analysis Status</p>
              </div>
              <div class="flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full border border-white/5">
                <span class="w-1.5 h-1.5 rounded-full" :class="analizando ? 'bg-secondary animate-pulse' : 'bg-outline/30'"></span>
                <span class="text-[10px] font-black tracking-widest uppercase" :class="analizando ? 'text-secondary' : 'text-outline'">{{ analizando ? 'Active' : 'Idle' }}</span>
              </div>
            </div>

            <div class="space-y-8 relative">
              <div class="absolute left-4 top-2 bottom-2 w-px bg-white/5 z-0"></div>
              
              <div v-for="(s, idx) in pasisVisibles" :key="s.id" class="flex gap-4 relative z-10" :class="idx > currentStepIdx ? 'opacity-30' : 'opacity-100'">
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
                <span class="uppercase tracking-widest">Pipeline Error</span>
              </div>
              {{ error }}
            </div>
            
            <div v-if="analizando" class="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
              <div class="w-full bg-surface-container-low h-1 rounded-full overflow-hidden">
                <div class="bg-secondary h-full transition-all duration-500" :style="{ width: ((currentStepIdx / 4) * 100) + '%' }"></div>
              </div>
              <p class="text-[10px] text-outline italic text-center animate-pulse">Processing vector embeddings and OpenAI request. Estimated time remaining: 15s</p>
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
  competidor_referente: false
})

const pasisVisibles = [
  { id: 'extraccion', label: 'Audio Extraction', icon: 'downloading', desc: 'Fetching source video and demuxing audio stream.' },
  { id: 'transcripcion', label: 'Whisper Context', icon: 'mic', desc: 'Generating millisecond-perfect SRD transcription.' },
  { id: 'analisis', label: 'GPT-4o Reasoning', icon: 'psychology', desc: 'Analyzing semantic hooks and neuro-marketing patterns.' },
  { id: 'embedding', label: 'Vector Encoding', icon: 'hub', desc: 'Finalizing database injection and embedding generation.' },
]

const currentStepIdx = computed(() => {
  if (!analizando.value) return -1
  return pasisVisibles.findIndex(p => p.id === paso.value)
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
    error.value = "Missing URL or Niche. These parameters are mandatory for the pipeline."
    return
  }

  const URL_SOPORTADAS = /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com|instagram\.com|youtube\.com|youtu\.be)/
  if (!URL_SOPORTADAS.test(form.value.url)) {
    error.value = "URL not supported. Only TikTok, Instagram Reels and YouTube Shorts are accepted."
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
