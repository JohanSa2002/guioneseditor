<template>
  <div v-if="cargando" class="flex flex-col items-center justify-center py-24 gap-4 min-h-[50vh]">
    <div class="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p class="text-outline text-sm animate-pulse">Cargando datos neuro-semánticos...</p>
  </div>

  <div v-else-if="guion" class="max-w-6xl mx-auto relative flex flex-col gap-8 pb-12">
    <!-- Encabezado -->
    <header class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <router-link to="/" class="flex items-center gap-2 text-outline hover:text-white transition-colors text-sm font-bold uppercase tracking-widest mb-6 w-fit">
          <span class="material-symbols-outlined text-lg">west</span> Volver al Panel
        </router-link>
        <div class="flex items-center gap-3 mb-3 flex-wrap">
          <span class="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-[11px] font-black rounded uppercase tracking-widest">{{ guion.niche }}</span>
          <span v-if="guion.sub_niche" class="px-3 py-1 bg-surface-container-low border border-outline-variant/20 text-outline text-[11px] font-bold rounded shadow-sm">{{ guion.sub_niche }}</span>
          <span :class="plataformaBadge(guion.plataforma)" class="px-3 py-1 text-[11px] font-black rounded uppercase tracking-widest">{{ guion.plataforma }}</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter text-white mb-2 leading-tight max-w-3xl">
          {{ guion.tema_principal || 'Análisis sin título' }}
        </h1>
        <p class="text-primary text-sm font-bold flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">visibility</span>
          {{ guion.angulo_unico || 'Ángulo único no especificado' }}
        </p>
      </div>

      <div class="flex items-center gap-4 shrink-0">
        <button v-if="guion.url_origen" class="h-12 w-12 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors shadow-lg" title="Ver video original" @click="openUrl(guion.url_origen)">
          <span class="material-symbols-outlined">link</span>
        </button>
        <div class="h-12 w-12 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors shadow-lg cursor-pointer">
          <span class="material-symbols-outlined">bookmark</span>
        </div>
        <button class="px-6 py-3 bg-gradient-to-br from-primary-container to-primary text-on-primary-container font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm h-12 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">download</span> Exportar Vector
        </button>
      </div>
    </header>

    <!-- Cuadrícula principal -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
      <!-- Columna izquierda: Analíticas -->
      <div class="xl:col-span-4 flex flex-col gap-6">
        <!-- Tarjeta de Puntaje -->
        <div class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-2xl relative overflow-hidden group">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors pointer-events-none"></div>
          <h3 class="text-sm font-headline font-bold text-white mb-8 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">analytics</span> Puntaje Neuro-Engagement
          </h3>
          <div class="flex justify-center mb-6 relative">
            <svg class="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="8" />
              <circle cx="50" cy="50" r="45" fill="none" class="stroke-primary drop-shadow-[0_0_8px_rgba(78,222,163,0.5)] transition-all duration-1000 ease-out" stroke-width="8" :stroke-dasharray="`${(guion.score_virabilidad || 0)/100 * 283} 283`" stroke-linecap="round" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-6xl font-black font-headline text-white tracking-tighter neon-glow">{{ guion.score_virabilidad || 0 }}</span>
              <span class="text-xs font-bold text-primary uppercase tracking-widest mt-1">/ 100</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
            <div>
              <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-1">Índice Cialdini</p>
              <p class="text-xl font-bold text-white">{{ guion.score_cialdini ?? 0 }}<span class="text-sm text-outline">/7</span></p>
            </div>
            <div>
              <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-1">Engagement Real</p>
              <p class="text-xl font-bold text-emerald-400">{{ guion.score_engagement ? (guion.score_engagement*1).toFixed(2) + '%' : 'N/A' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl">
          <h3 class="text-sm font-headline font-bold text-white mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary">psychology_alt</span> Ganchos Semánticos
          </h3>
          <div class="space-y-4">
            <div>
              <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-2">Estructura Narrativa</p>
              <div class="glass-panel p-3 rounded-lg border border-white/5 inline-block w-full">
                <span class="text-sm font-bold text-on-surface">{{ guion.estructura_narrativa || 'No detectada' }}</span>
              </div>
            </div>
            <div>
              <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-2 flex justify-between">
                <span>Gancho Principal</span>
                <span class="text-secondary">{{ guion.gancho_duracion_seg ? guion.gancho_duracion_seg + 's' : '' }}</span>
              </p>
              <div class="glass-panel p-4 rounded-xl border border-secondary/20 relative">
                <div class="absolute top-0 right-0 p-2"><span class="w-1.5 h-1.5 rounded-full bg-secondary block"></span></div>
                <p class="text-xs text-secondary font-bold uppercase tracking-wider mb-2">{{ guion.gancho_tipo || 'Gancho Estándar' }}</p>
                <p class="text-sm text-white font-medium leading-relaxed italic">"{{ guion.gancho_texto || '—' }}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columnas Central y Derecha -->
      <div class="xl:col-span-8 flex flex-col gap-6">
        <div class="bg-surface-container p-8 rounded-3xl border border-primary/20 shadow-2xl relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
          <p class="text-xs text-primary font-bold uppercase tracking-widest mb-4">Síntesis del Patrón Ganador</p>
          <p class="text-lg md:text-xl text-white font-medium leading-relaxed max-w-3xl relative z-10">{{ guion.resumen_patron }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl">
             <h3 class="text-sm font-headline font-bold text-white mb-6 flex items-center gap-2">
               <span class="material-symbols-outlined text-orange-400">local_fire_department</span> Resonancia Emocional
             </h3>
             <div class="mb-6">
               <div class="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                 <span class="text-outline">Intensidad</span>
                 <span class="text-orange-400">{{ guion.intensidad_emocional || 0 }}/10</span>
               </div>
               <div class="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                 <div class="bg-gradient-to-r from-orange-500/50 to-orange-400 h-full" :style="{ width: ((guion.intensidad_emocional||0)*10) + '%' }"></div>
               </div>
             </div>
             <div class="space-y-4">
               <DataRow label="Trigger Principal"  :value="guion.trigger_emocional" highlight />
               <DataRow label="Sesgo Cognitivo"    :value="guion.sesgo_cognitivo" />
               <DataRow label="Dolor / Placer"     :value="guion.dolor_placer" highlight />
             </div>
          </div>

          <div class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl flex flex-col">
            <h3 class="text-sm font-headline font-bold text-white mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-indigo-400">group_work</span> Principios de Cialdini
            </h3>
            <div class="grid grid-cols-2 gap-3 flex-1">
              <CialdiniItem label="Reciprocidad"   :active="!!guion.cialdini_reciprocidad" />
              <CialdiniItem label="Escasez"        :active="!!guion.cialdini_escasez" />
              <CialdiniItem label="Autoridad"      :active="!!guion.cialdini_autoridad" />
              <CialdiniItem label="Consistencia"   :active="!!guion.cialdini_consistencia" />
              <CialdiniItem label="Prueba Social"  :active="!!guion.cialdini_prueba_social" />
              <CialdiniItem label="Simpatía"       :active="!!guion.cialdini_simpatia" />
              <CialdiniItem label="Unidad"         :active="!!guion.cialdini_unidad" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl">
            <h3 class="text-sm font-headline font-bold text-white mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-fuchsia-400">biotech</span> Neuromarketing
            </h3>
            <div class="space-y-3">
              <DataRow label="Atención Visual"     :value="guion.atencion_visual"      highlight />
              <DataRow label="Carga Cognitiva"     :value="guion.carga_cognitiva"      highlight />
              <DataRow label="Ritmo / Pacing"      :value="guion.pacing_ritmo"         highlight />
              <DataRow label="Lenguaje Sensorial"  :value="guion.lenguaje_sensorial"   type="boolean" />
              <DataRow label="Contraste Narrativo" :value="guion.contraste_narrativo"  type="boolean" />
              <DataRow label="Efecto Novedad"      :value="guion.efecto_novedad"       type="boolean" />
            </div>
          </div>

          <div class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl flex flex-col">
            <h3 class="text-sm font-headline font-bold text-white mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-cyan-400">record_voice_over</span> Entrega y Alcance
            </h3>
            <div class="space-y-4 mb-6">
              <DataRow label="Tono"              :value="guion.tono"                highlight/>
              <DataRow label="Perspectiva"       :value="guion.persona_narradora"   highlight/>
              <DataRow label="Especificidad"     :value="guion.nivel_especificidad" highlight/>
              <div>
                <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-2">Palabras Clave Extraídas</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="kw in guion.palabras_clave" :key="kw" class="px-2 py-1 bg-surface-container-lowest border border-white/5 rounded text-[10px] font-bold text-on-surface-variant">{{ kw }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Visor de Transcripción -->
        <div class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl">
          <div class="flex items-center justify-between mb-2">
             <h3 class="text-sm font-headline font-bold text-white flex items-center gap-2">
               <span class="material-symbols-outlined text-outline">notes</span> Transcripción Completa
             </h3>
             <button @click="showTranscript = !showTranscript" class="text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
               {{ showTranscript ? 'Colapsar' : 'Expandir' }}
             </button>
          </div>
          <div :class="showTranscript ? 'max-h-[800px]' : 'max-h-24'" class="overflow-hidden relative transition-all duration-500 ease-in-out">
            <div v-if="!showTranscript" class="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent z-10"></div>
            <p class="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap font-serif pt-4">
              {{ guion.transcript || 'Video sin transcripción disponible.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../lib/api.js'
import CialdiniItem from '../components/CialdiniItem.vue'
import DataRow from '../components/DataRow.vue'

const route = useRoute()
const guion  = ref(null)
const cargando = ref(true)
const showTranscript = ref(false)

function openUrl(url) {
  if(url) window.open(url, '_blank')
}

function plataformaBadge(p) {
  return {
    tiktok: 'bg-red-500/20 text-red-400',
    reels: 'bg-fuchsia-500/20 text-fuchsia-400',
    shorts: 'bg-red-600/20 text-red-500'
  }[p] ?? 'bg-white/5 text-on-surface-variant'
}

onMounted(async () => {
  try {
    guion.value = await api.guiones.obtener(route.params.id)
  } finally {
    cargando.value = false
  }
})
</script>
