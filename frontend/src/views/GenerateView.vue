<template>
  <div class="max-w-7xl mx-auto flex flex-col gap-10">
    <!-- Encabezado -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
      <div>
        <h1 class="text-5xl font-extrabold font-headline tracking-tighter text-white mb-2 leading-tight">Generador de Guiones</h1>
        <p class="text-secondary text-sm font-bold flex items-center gap-2 tracking-widest uppercase">
          <span class="material-symbols-outlined text-sm">auto_fix_high</span>
          IA que aprende de tus patrones de alto rendimiento
        </p>
      </div>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-10">
      <!-- Formulario -->
      <div class="xl:col-span-7 flex flex-col gap-8">

        <!-- Paso 1: Contexto -->
        <section class="space-y-6">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-black text-sm border border-secondary/20">01</span>
            <h2 class="text-xl font-headline font-extrabold text-white tracking-tight">Contexto del Guion</h2>
          </div>
          <div class="bg-surface-container p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline">Nicho</label>
                <input v-model="form.niche" list="nichos-gen" placeholder="ej. fitness, finanzas..." class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm text-white placeholder:text-outline/40 focus:ring-2 focus:ring-secondary/40 font-black uppercase tracking-widest" :disabled="generando" />
                <datalist id="nichos-gen">
                  <option v-for="n in nichos" :key="n" :value="n" />
                </datalist>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline">Plataforma</label>
                <select v-model="form.plataforma" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm text-on-surface appearance-none focus:ring-2 focus:ring-secondary/40" :disabled="generando">
                  <option value="tiktok">TikTok</option>
                  <option value="reels">Instagram Reels</option>
                  <option value="shorts">YouTube Shorts</option>
                </select>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-outline">Tema del Video</label>
              <input v-model="form.tema" type="text" placeholder="ej. Cómo perder 5kg en 30 días sin pasar hambre" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm text-white placeholder:text-outline/40 focus:ring-2 focus:ring-secondary/40" :disabled="generando" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-outline">Audiencia Objetivo</label>
              <input v-model="form.audiencia" type="text" placeholder="ej. Mujeres de 25-40 años con poco tiempo para el gimnasio" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm text-white placeholder:text-outline/40 focus:ring-2 focus:ring-secondary/40" :disabled="generando" />
            </div>
          </div>
        </section>

        <!-- Paso 2: Parámetros -->
        <section class="space-y-6">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20">02</span>
            <h2 class="text-xl font-headline font-extrabold text-white tracking-tight">Parámetros de Generación</h2>
          </div>
          <div class="bg-surface-container p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline">Estructura Narrativa</label>
                <select v-model="form.estructura" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm text-on-surface appearance-none focus:ring-2 focus:ring-primary/40" :disabled="generando">
                  <option value="AIDA">AIDA (Atención → Interés → Deseo → Acción)</option>
                  <option value="PAS">PAS (Problema → Agitación → Solución)</option>
                  <option value="hero_journey">Hero's Journey</option>
                  <option value="storybrand">StoryBrand</option>
                  <option value="antes_despues">Antes / Después</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline">Objetivo</label>
                <select v-model="form.objetivo" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm text-on-surface appearance-none focus:ring-2 focus:ring-primary/40" :disabled="generando">
                  <option value="engagement">Engagement (likes, comentarios)</option>
                  <option value="awareness">Awareness (alcance)</option>
                  <option value="conversion">Conversión (ventas, leads)</option>
                  <option value="educacion">Educación</option>
                  <option value="entretenimiento">Entretenimiento</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline">Tono</label>
                <select v-model="form.tono" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm text-on-surface appearance-none focus:ring-2 focus:ring-primary/40" :disabled="generando">
                  <option value="educativo">Educativo</option>
                  <option value="entretenimiento">Entretenimiento</option>
                  <option value="inspiracional">Inspiracional</option>
                  <option value="controversial">Controversial</option>
                  <option value="informativo">Informativo</option>
                  <option value="humoristico">Humorístico</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-outline">Duración Objetivo (seg)</label>
                <input v-model.number="form.duracion_objetivo" type="number" min="15" max="180" class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm text-on-surface font-bold text-center focus:ring-2 focus:ring-primary/40" :disabled="generando" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-outline">Instrucciones adicionales (opcional)</label>
              <textarea v-model="form.instrucciones_extra" rows="3" placeholder="ej. Incluir una estadística de estudio, no mencionar competidores, usar lenguaje informal..." class="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-4 text-sm text-white placeholder:text-outline/40 focus:ring-2 focus:ring-primary/40 resize-none" :disabled="generando"></textarea>
            </div>
          </div>
        </section>

        <!-- Botón -->
        <button
          @click="generar"
          :disabled="generando || !form.niche || !form.tema || !form.audiencia"
          class="w-full py-5 bg-gradient-to-br from-secondary/80 to-secondary text-on-secondary font-headline font-black rounded-2xl shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all text-base uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-40 disabled:scale-100"
        >
          <span class="material-symbols-outlined text-xl" :class="generando ? 'animate-spin' : ''">{{ generando ? 'hourglass_top' : 'auto_fix_high' }}</span>
          {{ generando ? 'Generando con GPT-4o...' : 'Generar Guion' }}
        </button>

        <p v-if="error" class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{{ error }}</p>
      </div>

      <!-- Panel derecho: Preview + Info -->
      <div class="xl:col-span-5 flex flex-col gap-6">

        <!-- Resultado -->
        <div v-if="resultado" class="flex flex-col gap-4">
          <!-- Score -->
          <div class="bg-surface-container p-6 rounded-3xl border border-secondary/20 shadow-xl relative overflow-hidden">
            <div class="absolute -top-8 -right-8 w-32 h-32 bg-secondary/10 blur-3xl rounded-full"></div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-headline font-black text-white uppercase tracking-widest">{{ resultado.guion.titulo_sugerido }}</h3>
              <div class="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-full border border-secondary/20">
                <span class="material-symbols-outlined text-secondary text-sm" style="font-variation-settings:'FILL' 1;">bolt</span>
                <span class="text-sm font-black text-secondary">{{ resultado.guion.score_estimado }}/100</span>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="t in resultado.guion.tecnicas_aplicadas" :key="t" class="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-surface-container-low border border-white/5 rounded text-outline">{{ t }}</span>
            </div>
            <p class="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">Duración estimada</p>
            <p class="text-2xl font-black text-white font-headline">{{ resultado.guion.duracion_estimada_seg }}s</p>
          </div>

          <!-- Guion completo -->
          <div class="bg-surface-container rounded-3xl border border-outline-variant/10 shadow-xl overflow-hidden">
            <div class="px-6 py-4 border-b border-white/5 bg-surface-container-high/50 flex items-center justify-between">
              <h3 class="text-xs font-black text-white uppercase tracking-widest">Guion Completo</h3>
              <button @click="copiarGuion" class="text-xs font-bold text-primary hover:text-white transition-colors flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">{{ copiado ? 'check' : 'content_copy' }}</span>
                {{ copiado ? 'Copiado' : 'Copiar' }}
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <p class="text-[9px] text-secondary font-black uppercase tracking-widest mb-2">Gancho</p>
                <p class="text-sm text-white leading-relaxed font-medium">{{ resultado.guion.gancho }}</p>
              </div>
              <div>
                <p class="text-[9px] text-primary font-black uppercase tracking-widest mb-2">Desarrollo</p>
                <p class="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">{{ resultado.guion.desarrollo }}</p>
              </div>
              <div v-if="resultado.guion.cta">
                <p class="text-[9px] text-tertiary font-black uppercase tracking-widest mb-2">Call to Action</p>
                <p class="text-sm text-white leading-relaxed font-medium">{{ resultado.guion.cta }}</p>
              </div>
            </div>
          </div>

          <!-- Variantes del gancho -->
          <div v-if="resultado.guion.variantes_gancho?.length" class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10">
            <h3 class="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-outline text-base">shuffle</span> Variantes del Gancho
            </h3>
            <div class="space-y-3">
              <div v-for="(v, i) in resultado.guion.variantes_gancho" :key="i" class="p-3 rounded-xl bg-surface-container-low border border-white/5">
                <span class="text-[9px] text-outline font-black uppercase tracking-widest mr-2">V{{ i + 1 }}</span>
                <span class="text-sm text-on-surface-variant italic">"{{ v }}"</span>
              </div>
            </div>
          </div>

          <!-- Notas de producción -->
          <div v-if="resultado.guion.notas_produccion" class="bg-surface-container p-6 rounded-3xl border border-yellow-500/20">
            <h3 class="text-xs font-black text-yellow-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-base">videocam</span> Notas de Producción
            </h3>
            <p class="text-sm text-on-surface-variant leading-relaxed">{{ resultado.guion.notas_produccion }}</p>
          </div>

          <!-- Nuevo guion -->
          <button @click="resultado = null; form.tema = ''; form.instrucciones_extra = ''" class="w-full py-3 bg-surface-container border border-white/5 text-outline font-bold rounded-xl text-sm hover:text-white hover:border-white/10 transition-colors">
            Generar otro guion
          </button>
        </div>

        <!-- Estado vacío / Info -->
        <div v-else class="bg-surface-container rounded-3xl border border-outline-variant/10 p-8 flex flex-col gap-6 sticky top-24">
          <div>
            <h3 class="text-sm font-headline font-black text-white uppercase tracking-widest mb-2">Cómo funciona</h3>
            <p class="text-xs text-outline/70 leading-relaxed">El generador analiza los guiones de mayor rendimiento de tu base de datos y aplica sus patrones estructurales, técnicas de retención y triggers emocionales a tu nuevo contenido.</p>
          </div>
          <div class="space-y-3">
            <div v-for="paso in pasoInfo" :key="paso.label" class="flex items-start gap-3">
              <div class="w-7 h-7 rounded-full bg-surface-container-low border border-white/5 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-sm text-primary">{{ paso.icon }}</span>
              </div>
              <div>
                <p class="text-xs font-black text-white">{{ paso.label }}</p>
                <p class="text-[10px] text-outline/60">{{ paso.desc }}</p>
              </div>
            </div>
          </div>
          <div class="pt-4 border-t border-white/5">
            <p class="text-[10px] text-outline/50 italic">Tiempo estimado: 5-10 segundos · Modelo: GPT-4o</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../lib/api.js'

const generando = ref(false)
const error     = ref(null)
const resultado = ref(null)
const copiado   = ref(false)
const nichos    = ref([])

const form = ref({
  niche:              '',
  tema:               '',
  audiencia:          '',
  plataforma:         'tiktok',
  estructura:         'AIDA',
  objetivo:           'engagement',
  tono:               'educativo',
  duracion_objetivo:  60,
  instrucciones_extra: '',
})

const pasoInfo = [
  { icon: 'search',        label: 'Busca patrones',       desc: 'Selecciona los mejores guiones del niche en tu biblioteca' },
  { icon: 'psychology',    label: 'Extrae técnicas',      desc: 'Identifica estructura, triggers y principios Cialdini activos' },
  { icon: 'auto_fix_high', label: 'Genera el guion',      desc: 'GPT-4o crea contenido original aplicando los patrones' },
  { icon: 'save',          label: 'Guarda en biblioteca', desc: 'El guion queda guardado con su score y notas de producción' },
]

async function generar() {
  if (!form.value.niche || !form.value.tema || !form.value.audiencia) return
  generando.value = true
  error.value = null
  resultado.value = null

  try {
    resultado.value = await api.generar(form.value)
  } catch (e) {
    error.value = e.message
  } finally {
    generando.value = false
  }
}

async function copiarGuion() {
  if (!resultado.value?.guion?.guion_completo) return
  await navigator.clipboard.writeText(resultado.value.guion.guion_completo)
  copiado.value = true
  setTimeout(() => { copiado.value = false }, 2000)
}

onMounted(async () => {
  try { nichos.value = await api.nichos() } catch {}
})
</script>
