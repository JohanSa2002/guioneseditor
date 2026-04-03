<template>
  <div class="flex flex-col gap-8">

    <!-- Encabezado -->
    <header class="pb-6 border-b border-border">
      <h1 class="text-3xl font-bold font-headline text-ink mb-1">Generar Guion</h1>
      <p class="text-sm text-ink-3">IA que aprende de tus patrones de mayor rendimiento</p>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">

      <!-- Formulario -->
      <div class="xl:col-span-7 flex flex-col gap-6">

        <!-- Paso 1: Contexto -->
        <section class="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-border bg-surface-muted/50 flex items-center gap-3">
            <span class="w-6 h-6 rounded-md bg-accent text-white text-xs font-bold flex items-center justify-center">1</span>
            <h2 class="text-sm font-semibold text-ink">Contexto del Guion</h2>
          </div>
          <div class="p-6 space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide flex items-center gap-1">
                  Nicho
                  <span class="text-error font-normal normal-case ml-1 text-[11px]">obligatorio</span>
                </label>
                <input
                  v-model="form.niche"
                  list="nichos-gen"
                  placeholder="ej. fitness, finanzas…"
                  class="w-full bg-canvas border rounded-lg px-3 py-2.5 text-sm text-ink
                         placeholder:text-ink-3 focus:outline-none focus:ring-2 transition-all"
                  :class="campoTocado.niche && !form.niche
                    ? 'border-error/50 focus:ring-error/20'
                    : 'border-border focus:ring-accent/30 focus:border-accent/40'"
                  :disabled="generando"
                  @blur="campoTocado.niche = true"
                />
                <p v-if="campoTocado.niche && !form.niche" class="text-[11px] text-error">Este campo es obligatorio</p>
                <datalist id="nichos-gen">
                  <option v-for="n in nichos" :key="n" :value="n" />
                </datalist>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide">Plataforma</label>
                <select
                  v-model="form.plataforma"
                  class="w-full bg-canvas border border-border rounded-lg px-3 py-2.5 text-sm text-ink
                         focus:outline-none focus:ring-2 focus:ring-accent/30 appearance-none transition-all"
                  :disabled="generando"
                >
                  <option value="tiktok">TikTok</option>
                  <option value="reels">Instagram Reels</option>
                  <option value="shorts">YouTube Shorts</option>
                </select>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide flex items-center gap-1">
                Tema del Video
                <span class="text-error font-normal normal-case ml-1 text-[11px]">obligatorio</span>
              </label>
              <input
                v-model="form.tema"
                type="text"
                placeholder="ej. Cómo perder 5kg en 30 días sin pasar hambre"
                class="w-full bg-canvas border rounded-lg px-3 py-2.5 text-sm text-ink
                       placeholder:text-ink-3 focus:outline-none focus:ring-2 transition-all"
                :class="campoTocado.tema && !form.tema
                  ? 'border-error/50 focus:ring-error/20'
                  : 'border-border focus:ring-accent/30 focus:border-accent/40'"
                :disabled="generando"
                @blur="campoTocado.tema = true"
              />
              <p v-if="campoTocado.tema && !form.tema" class="text-[11px] text-error">Este campo es obligatorio</p>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide flex items-center gap-1">
                Audiencia Objetivo
                <span class="text-error font-normal normal-case ml-1 text-[11px]">obligatorio</span>
              </label>
              <input
                v-model="form.audiencia"
                type="text"
                placeholder="ej. Mujeres de 25-40 años con poco tiempo para el gimnasio"
                class="w-full bg-canvas border rounded-lg px-3 py-2.5 text-sm text-ink
                       placeholder:text-ink-3 focus:outline-none focus:ring-2 transition-all"
                :class="campoTocado.audiencia && !form.audiencia
                  ? 'border-error/50 focus:ring-error/20'
                  : 'border-border focus:ring-accent/30 focus:border-accent/40'"
                :disabled="generando"
                @blur="campoTocado.audiencia = true"
              />
              <p v-if="campoTocado.audiencia && !form.audiencia" class="text-[11px] text-error">Este campo es obligatorio</p>
            </div>
          </div>
        </section>

        <!-- Paso 2: Parámetros -->
        <section class="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-border bg-surface-muted/50 flex items-center gap-3">
            <span class="w-6 h-6 rounded-md bg-success text-white text-xs font-bold flex items-center justify-center">2</span>
            <h2 class="text-sm font-semibold text-ink">Parámetros de Generación</h2>
          </div>
          <div class="p-6 space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide">Estructura Narrativa</label>
                <select v-model="form.estructura"
                  class="w-full bg-canvas border border-border rounded-lg px-3 py-2.5 text-sm text-ink
                         focus:outline-none focus:ring-2 focus:ring-accent/30 appearance-none transition-all"
                  :disabled="generando">
                  <option value="AIDA">AIDA — Atención · Interés · Deseo · Acción</option>
                  <option value="PAS">PAS — Problema · Agitación · Solución</option>
                  <option value="hero_journey">Hero's Journey</option>
                  <option value="storybrand">StoryBrand</option>
                  <option value="antes_despues">Antes / Después</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide">Objetivo</label>
                <select v-model="form.objetivo"
                  class="w-full bg-canvas border border-border rounded-lg px-3 py-2.5 text-sm text-ink
                         focus:outline-none focus:ring-2 focus:ring-accent/30 appearance-none transition-all"
                  :disabled="generando">
                  <option value="engagement">Engagement (likes, comentarios)</option>
                  <option value="awareness">Awareness (alcance)</option>
                  <option value="conversion">Conversión (ventas, leads)</option>
                  <option value="educacion">Educación</option>
                  <option value="entretenimiento">Entretenimiento</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide">Tono</label>
                <select v-model="form.tono"
                  class="w-full bg-canvas border border-border rounded-lg px-3 py-2.5 text-sm text-ink
                         focus:outline-none focus:ring-2 focus:ring-accent/30 appearance-none transition-all"
                  :disabled="generando">
                  <option value="educativo">Educativo</option>
                  <option value="entretenimiento">Entretenimiento</option>
                  <option value="inspiracional">Inspiracional</option>
                  <option value="controversial">Controversial</option>
                  <option value="informativo">Informativo</option>
                  <option value="humoristico">Humorístico</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide">Duración objetivo (seg)</label>
                <input
                  v-model.number="form.duracion_objetivo"
                  type="number" min="15" max="180"
                  class="w-full bg-canvas border border-border rounded-lg px-3 py-2.5 text-sm text-ink
                         font-medium text-center focus:outline-none focus:ring-2 focus:ring-accent/30
                         transition-all tabular-nums"
                  :disabled="generando"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-ink-2 uppercase tracking-wide">
                Instrucciones adicionales
                <span class="font-normal text-ink-3 normal-case ml-1">(opcional)</span>
              </label>
              <textarea
                v-model="form.instrucciones_extra"
                rows="3"
                placeholder="ej. Incluir una estadística de estudio, no mencionar competidores…"
                class="w-full bg-canvas border border-border rounded-lg px-3 py-3 text-sm text-ink
                       placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-accent/30
                       resize-none leading-relaxed transition-all"
                :disabled="generando"
              ></textarea>
            </div>
          </div>
        </section>

        <!-- Botón Generar con tooltip de campos faltantes -->
        <div class="relative group/btn">
          <button
            @click="generar"
            :disabled="generando || !form.niche || !form.tema || !form.audiencia"
            class="w-full py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg text-sm
                   flex items-center justify-center gap-2 transition-all shadow-sm
                   active:scale-[0.98] hover:shadow-md hover:shadow-accent/20
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
          >
            <span class="material-symbols-outlined text-[18px]" :class="generando ? 'animate-spin' : ''">
              {{ generando ? 'progress_activity' : 'auto_fix_high' }}
            </span>
            {{ generando ? 'Generando con GPT-4o…' : 'Generar Guion' }}
          </button>
          <!-- Tooltip de campos faltantes -->
          <div
            v-if="!generando && (!form.niche || !form.tema || !form.audiencia)"
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5
                   bg-surface-muted border border-border rounded-lg text-[11px] text-ink-2
                   whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none
                   transition-opacity z-10 shadow-lg"
          >
            <span class="material-symbols-outlined text-[12px] text-warn align-middle mr-1">warning</span>
            Falta: {{ camposFaltantes.join(', ') }}
            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border"></div>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="p-4 rounded-lg bg-error-subtle border border-error-border">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5"
              style="font-variation-settings:'FILL' 1;">error</span>
            <div>
              <p class="text-sm font-semibold text-error mb-1">Error al generar</p>
              <p class="text-xs text-error/80 leading-relaxed">{{ error }}</p>
            </div>
          </div>
          <button
            @click="error = null; generar()"
            class="mt-3 w-full px-3 py-2 bg-error/10 border border-error-border text-error text-xs
                   font-semibold rounded-lg hover:bg-error/20 transition-colors flex items-center
                   justify-center gap-1.5 active:scale-[0.97]"
          >
            <span class="material-symbols-outlined text-[14px]">refresh</span>
            Reintentar
          </button>
        </div>
      </div>

      <!-- Panel de resultados -->
      <div class="xl:col-span-5 flex flex-col gap-5">

        <!-- Resultado -->
        <div v-if="resultado" class="flex flex-col gap-5">

          <!-- Score -->
          <div class="bg-surface rounded-xl border border-success-border shadow-sm p-5">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-sm font-semibold text-ink leading-snug">{{ resultado.guion.titulo_sugerido }}</h3>
              <div class="flex items-center gap-1.5 px-2.5 py-1 bg-success-subtle border border-success-border
                          rounded-full ml-3 shrink-0">
                <span class="material-symbols-outlined text-success text-[14px]" style="font-variation-settings:'FILL' 1;">bolt</span>
                <span class="text-xs font-bold text-success tabular-nums">{{ resultado.guion.score_estimado }}/100</span>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span
                v-for="t in resultado.guion.tecnicas_aplicadas"
                :key="t"
                class="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5
                       bg-surface-muted border border-border rounded text-ink-3"
              >{{ t }}</span>
            </div>
            <div class="flex items-center gap-3">
              <p class="text-[10px] text-ink-3 font-medium uppercase tracking-wide">Duración estimada</p>
              <p class="text-base font-bold text-ink tabular-nums">{{ resultado.guion.duracion_estimada_seg }}s</p>
            </div>
          </div>

          <!-- Guion completo -->
          <div class="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div class="px-5 py-3.5 border-b border-border flex items-center justify-between bg-surface/90 backdrop-blur-sm">
              <h3 class="text-xs font-semibold text-ink uppercase tracking-wider">Guion Completo</h3>
              <button
                @click="copiarGuion"
                class="text-xs font-medium flex items-center gap-1 transition-all active:scale-95 px-2.5 py-1
                       rounded-lg border"
                :class="copiado
                  ? 'text-success border-success-border bg-success-subtle'
                  : 'text-accent border-accent-border hover:bg-accent-subtle'"
              >
                <span class="material-symbols-outlined text-[14px]">{{ copiado ? 'check' : 'content_copy' }}</span>
                {{ copiado ? 'Copiado' : 'Copiar' }}
              </button>
            </div>
            <div class="p-5 space-y-4">
              <div>
                <p class="text-[10px] font-semibold text-success uppercase tracking-wider mb-2">Gancho</p>
                <p class="text-sm text-ink leading-relaxed">{{ resultado.guion.gancho }}</p>
              </div>
              <div>
                <p class="text-[10px] font-semibold text-accent uppercase tracking-wider mb-2">Desarrollo</p>
                <p class="text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">{{ resultado.guion.desarrollo }}</p>
              </div>
              <div v-if="resultado.guion.cta">
                <p class="text-[10px] font-semibold text-warn uppercase tracking-wider mb-2">Call to Action</p>
                <p class="text-sm text-ink leading-relaxed">{{ resultado.guion.cta }}</p>
              </div>
            </div>
          </div>

          <!-- Variantes del Gancho -->
          <div v-if="resultado.guion.variantes_gancho?.length" class="bg-surface rounded-xl border border-border shadow-sm p-5">
            <h3 class="text-xs font-semibold text-ink-2 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-ink-3 text-[16px]">shuffle</span> Variantes del Gancho
            </h3>
            <div class="space-y-2">
              <div
                v-for="(v, i) in resultado.guion.variantes_gancho"
                :key="i"
                class="flex items-start gap-2.5 p-3 rounded-lg bg-surface-muted border border-border"
              >
                <span class="text-[9px] font-bold text-ink-3 uppercase tracking-wider pt-0.5 shrink-0">V{{ i + 1 }}</span>
                <span class="text-sm text-ink-2 italic leading-relaxed">"{{ v }}"</span>
              </div>
            </div>
          </div>

          <!-- Notas de Producción -->
          <div v-if="resultado.guion.notas_produccion" class="bg-surface rounded-xl border border-warn-border p-5">
            <h3 class="text-xs font-semibold text-warn uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">videocam</span> Notas de Producción
            </h3>
            <p class="text-sm text-ink-2 leading-relaxed">{{ resultado.guion.notas_produccion }}</p>
          </div>

          <!-- Generar otro -->
          <button
            @click="resetForm"
            class="w-full py-2.5 bg-canvas border border-border text-ink-2 font-medium rounded-lg text-sm
                   hover:bg-surface-muted transition-all active:scale-[0.97]"
          >
            Generar otro guion
          </button>
        </div>

        <!-- Estado vacío / Info -->
        <div v-else class="bg-surface rounded-xl border border-border shadow-sm p-6 sticky top-24">
          <h3 class="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-accent text-[18px]">auto_fix_high</span>
            ¿Cómo funciona?
          </h3>
          <p class="text-xs text-ink-3 leading-relaxed mb-5">
            El generador analiza los guiones de mayor rendimiento de tu base de datos y aplica sus patrones estructurales, técnicas de retención y triggers emocionales al nuevo contenido.
          </p>
          <div class="space-y-4">
            <div
              v-for="(paso, i) in pasoInfo"
              :key="paso.label"
              class="flex items-start gap-3"
              :style="{ animationDelay: `${i * 60}ms` }"
            >
              <div class="w-7 h-7 rounded-full bg-accent-subtle border border-accent-border flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-accent text-[14px]">{{ paso.icon }}</span>
              </div>
              <div>
                <p class="text-xs font-semibold text-ink">{{ paso.label }}</p>
                <p class="text-[11px] text-ink-3 mt-0.5 leading-snug">{{ paso.desc }}</p>
              </div>
            </div>
          </div>
          <div class="mt-5 pt-4 border-t border-border flex items-center justify-between">
            <p class="text-[11px] text-ink-3">Tiempo estimado: 5–10s</p>
            <span class="text-[10px] font-semibold px-2 py-0.5 bg-accent-subtle border border-accent-border text-accent rounded-full">GPT-4o</span>
          </div>

          <!-- Indicador de campos completados -->
          <div class="mt-4 pt-4 border-t border-border">
            <div class="flex items-center justify-between mb-2">
              <p class="text-[11px] font-medium text-ink-3">Progreso del formulario</p>
              <p class="text-[11px] font-bold tabular-nums" :class="camposCompletos === 3 ? 'text-success' : 'text-ink-3'">
                {{ camposCompletos }}/3
              </p>
            </div>
            <div class="flex gap-1.5">
              <div
                v-for="(campo, i) in ['niche', 'tema', 'audiencia']"
                :key="campo"
                class="flex-1 h-1 rounded-full transition-all duration-300"
                :class="form[campo] ? 'bg-success' : 'bg-border'"
              ></div>
            </div>
            <div class="flex gap-1.5 mt-1.5">
              <p v-for="(campo, i) in camposLabels" :key="i"
                class="flex-1 text-center text-[9px] transition-colors"
                :class="form[camposKeys[i]] ? 'text-success' : 'text-ink-3'">
                {{ campo }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../lib/api.js'
import { useToast } from '../composables/useToast.js'

const toast     = useToast()
const generando = ref(false)
const error     = ref(null)
const resultado = ref(null)
const copiado   = ref(false)
const nichos    = ref([])

const campoTocado = ref({ niche: false, tema: false, audiencia: false })

const form = ref({
  niche:               '',
  tema:                '',
  audiencia:           '',
  plataforma:          'tiktok',
  estructura:          'AIDA',
  objetivo:            'engagement',
  tono:                'educativo',
  duracion_objetivo:   60,
  instrucciones_extra: '',
})

const camposKeys   = ['niche', 'tema', 'audiencia']
const camposLabels = ['Nicho', 'Tema', 'Audiencia']

const camposCompletos = computed(() =>
  camposKeys.filter(k => !!form.value[k]).length
)

const camposFaltantes = computed(() => {
  const faltan = []
  if (!form.value.niche)    faltan.push('nicho')
  if (!form.value.tema)     faltan.push('tema')
  if (!form.value.audiencia) faltan.push('audiencia')
  return faltan
})

const pasoInfo = [
  { icon: 'search',        label: 'Busca patrones',       desc: 'Selecciona los mejores guiones del niche en tu biblioteca' },
  { icon: 'psychology',    label: 'Extrae técnicas',      desc: 'Identifica estructura, triggers y principios Cialdini activos' },
  { icon: 'auto_fix_high', label: 'Genera el guion',      desc: 'GPT-4o crea contenido original aplicando los patrones' },
  { icon: 'save',          label: 'Guarda en biblioteca', desc: 'El guion queda guardado con su score y notas de producción' },
]

async function generar() {
  campoTocado.value = { niche: true, tema: true, audiencia: true }
  if (!form.value.niche || !form.value.tema || !form.value.audiencia) return

  generando.value = true
  error.value     = null
  resultado.value = null

  try {
    resultado.value = await api.generar(form.value)
    toast.success('Guion generado correctamente')
  } catch (e) {
    error.value = e.message
    toast.error('Error al generar el guion')
  } finally {
    generando.value = false
  }
}

async function copiarGuion() {
  if (!resultado.value?.guion?.guion_completo) return
  await navigator.clipboard.writeText(resultado.value.guion.guion_completo)
  copiado.value = true
  toast.success('Guion copiado al portapapeles')
  setTimeout(() => { copiado.value = false }, 2500)
}

function resetForm() {
  resultado.value = null
  form.value.tema = ''
  form.value.instrucciones_extra = ''
  campoTocado.value = { niche: false, tema: false, audiencia: false }
}

onMounted(async () => {
  try { nichos.value = await api.nichos() } catch {}
})
</script>
