<template>
  <!-- Loading -->
  <div v-if="cargando" class="flex flex-col items-center justify-center py-24 gap-4">
    <div class="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
    <p class="text-sm text-ink-3">Cargando análisis…</p>
  </div>

  <div v-else-if="guion" class="flex flex-col gap-8 pb-12">

    <!-- Encabezado -->
    <header class="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-border">
      <div class="flex-1">
        <router-link to="/analysis" class="inline-flex items-center gap-1.5 text-xs font-medium text-ink-3 hover:text-accent transition-colors mb-4 uppercase tracking-wider">
          <span class="material-symbols-outlined text-base">west</span> Volver al historial
        </router-link>

        <div class="flex items-center gap-2 flex-wrap mb-3">
          <span class="text-[11px] font-semibold px-2.5 py-1 bg-surface-muted border border-border rounded-md text-ink-2 uppercase tracking-wide">{{ guion.niche }}</span>
          <span v-if="guion.sub_niche" class="text-[11px] px-2.5 py-1 bg-canvas border border-border rounded-md text-ink-3">{{ guion.sub_niche }}</span>
          <span :class="plataformaBadge(guion.plataforma)" class="platform-badge">{{ guion.plataforma }}</span>
          <span v-if="guion.replicabilidad" :class="replicabilidadBadge(guion.replicabilidad)" class="text-[11px] font-semibold px-2.5 py-1 rounded-md">
            Replicabilidad {{ guion.replicabilidad }}
          </span>
        </div>

        <h1 class="text-3xl font-bold font-headline text-ink mb-2 leading-tight max-w-2xl">
          {{ guion.tema_principal || 'Análisis sin título' }}
        </h1>
        <p class="text-sm text-ink-2 flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px] text-ink-3">visibility</span>
          {{ guion.angulo_unico || 'Ángulo único no especificado' }}
        </p>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <button
          v-if="guion.url_origen"
          class="h-9 w-9 rounded-lg bg-canvas border border-border flex items-center justify-center text-ink-2 hover:bg-surface-muted hover:text-ink transition-colors"
          title="Ver video original"
          @click="openUrl(guion.url_origen)"
        >
          <span class="material-symbols-outlined text-[18px]">open_in_new</span>
        </button>
        <router-link to="/generate" class="px-4 py-2 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg text-sm flex items-center gap-1.5 transition-colors shadow-sm">
          <span class="material-symbols-outlined text-[16px]">auto_fix_high</span>
          Generar Guion
        </router-link>
      </div>
    </header>

    <!-- Cuadrícula principal -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

      <!-- Columna izquierda (métricas) -->
      <div class="xl:col-span-4 flex flex-col gap-4">

        <!-- Métricas Sociales -->
        <div v-if="guion.vistas || guion.likes || guion.compartidos" class="bg-surface rounded-xl border border-border shadow-sm p-5">
          <h3 class="text-xs font-semibold text-ink-2 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-ink-3 text-[16px]">bar_chart</span>
            Métricas del Video
          </h3>
          <div class="grid grid-cols-3 gap-3">
            <div class="text-center p-3 rounded-lg bg-surface-muted border border-border">
              <span class="material-symbols-outlined text-blue-500 text-lg block mb-1">visibility</span>
              <p class="text-[9px] text-ink-3 font-semibold uppercase tracking-wider mb-1">Vistas</p>
              <p class="text-base font-bold text-ink">{{ formatNum(guion.vistas) }}</p>
            </div>
            <div class="text-center p-3 rounded-lg bg-surface-muted border border-border">
              <span class="material-symbols-outlined text-red-500 text-lg block mb-1" style="font-variation-settings:'FILL' 1;">favorite</span>
              <p class="text-[9px] text-ink-3 font-semibold uppercase tracking-wider mb-1">Likes</p>
              <p class="text-base font-bold text-ink">{{ formatNum(guion.likes) }}</p>
            </div>
            <div class="text-center p-3 rounded-lg bg-surface-muted border border-border">
              <span class="material-symbols-outlined text-success text-lg block mb-1">share</span>
              <p class="text-[9px] text-ink-3 font-semibold uppercase tracking-wider mb-1">Compartidos</p>
              <p class="text-base font-bold text-ink">{{ formatNum(guion.compartidos) }}</p>
            </div>
          </div>
          <div v-if="guion.score_engagement" class="mt-3 flex items-center justify-between px-3 py-2 rounded-lg bg-success-subtle border border-success-border">
            <span class="text-[11px] text-success font-semibold">Engagement Rate</span>
            <span class="text-sm font-bold text-success">{{ (guion.score_engagement * 1).toFixed(2) }}%</span>
          </div>
        </div>

        <!-- Puntaje Circular -->
        <div class="bg-surface rounded-xl border border-border shadow-sm p-6">
          <h3 class="text-xs font-semibold text-ink-2 uppercase tracking-wider mb-5 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-accent text-[16px]">analytics</span>
            Puntaje de Viralidad
          </h3>
          <div class="flex justify-center mb-5 relative">
            <svg class="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e3de" stroke-width="7"/>
              <circle
                cx="50" cy="50" r="42" fill="none"
                class="stroke-accent transition-all duration-1000 ease-out"
                stroke-width="7"
                :stroke-dasharray="`${(guion.score_virabilidad || 0)/100 * 264} 264`"
                stroke-linecap="round"
              />
            </svg>
            <div class="absolute flex flex-col items-center justify-center" style="margin-top: 30px;">
              <span class="text-5xl font-bold font-headline text-ink">{{ guion.score_virabilidad || 0 }}</span>
              <span class="text-xs text-ink-3 font-medium">/ 100</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-4 border-t border-border">
            <div class="text-center p-3 rounded-lg bg-surface-muted">
              <p class="text-[10px] text-ink-3 font-medium mb-1">Cialdini</p>
              <p class="text-xl font-bold text-ink">{{ guion.score_cialdini ?? 0 }}<span class="text-sm text-ink-3">/7</span></p>
            </div>
            <div class="text-center p-3 rounded-lg bg-surface-muted">
              <p class="text-[10px] text-ink-3 font-medium mb-1">Intensidad</p>
              <p class="text-xl font-bold text-warn">{{ guion.intensidad_emocional || 0 }}<span class="text-sm text-ink-3">/10</span></p>
            </div>
          </div>
        </div>

        <!-- Ganchos Semánticos -->
        <div class="bg-surface rounded-xl border border-border shadow-sm p-5">
          <h3 class="text-xs font-semibold text-ink-2 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-success text-[16px]">psychology_alt</span>
            Ganchos Semánticos
          </h3>
          <div class="space-y-4">
            <div>
              <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-2">Estructura Narrativa</p>
              <div class="px-3 py-2 rounded-lg bg-surface-muted border border-border">
                <span class="text-sm font-medium text-ink">{{ guion.estructura_narrativa || 'No detectada' }}</span>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-2">
                <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider">Gancho Principal</p>
                <span v-if="guion.gancho_duracion_seg" class="text-[10px] font-medium text-success">{{ guion.gancho_duracion_seg }}s</span>
              </div>
              <div class="p-3 rounded-lg border border-success-border bg-success-subtle">
                <p class="text-[10px] font-semibold text-success uppercase tracking-wider mb-1.5">{{ guion.gancho_tipo || 'Gancho Estándar' }}</p>
                <p class="text-xs text-ink-2 leading-relaxed italic">"{{ guion.gancho_texto || '—' }}"</p>
              </div>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-2">Técnica de Retención</p>
              <div class="px-3 py-2 rounded-lg border border-accent-border bg-accent-subtle flex items-center gap-2">
                <span class="material-symbols-outlined text-accent text-[16px]">repeat</span>
                <span class="text-sm font-medium text-accent">{{ guion.tecnica_retencion || '—' }}</span>
                <span v-if="guion.momento_pico_seg" class="ml-auto text-[10px] text-ink-3">Pico: {{ guion.momento_pico_seg }}s</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Avatar y Consciencia -->
        <div class="bg-surface rounded-xl border border-border shadow-sm p-5">
          <h3 class="text-xs font-semibold text-ink-2 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-warn text-[16px]">person_search</span>
            Avatar & Copywriting
          </h3>
          <div class="space-y-4">
            <div>
              <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-2">Nivel de Consciencia</p>
              <div class="flex gap-1 mb-1.5">
                <div
                  v-for="(nivel, i) in nivelesConciencia"
                  :key="nivel.key"
                  class="flex-1 h-1.5 rounded-full transition-all"
                  :class="nivelConcienciaIndex >= i ? 'bg-accent' : 'bg-border'"
                ></div>
              </div>
              <p class="text-xs font-medium text-accent">{{ guion.nivel_consciencia?.replace(/_/g,' ') || '—' }}</p>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-1.5">Avatar Objetivo</p>
              <p class="text-xs text-ink-2 leading-relaxed">{{ guion.avatar_descripcion || '—' }}</p>
            </div>
            <div v-if="guion.objecion_principal">
              <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-1.5">Objeción Principal</p>
              <div class="p-3 rounded-lg border border-error-border bg-error-subtle">
                <p class="text-xs text-error leading-relaxed italic">"{{ guion.objecion_principal }}"</p>
              </div>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-1.5">Balance Emoción / Lógica</p>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base" :class="ratioColor">{{ ratioIcon }}</span>
                <span class="text-sm font-medium" :class="ratioColor">{{ guion.ratio_emocion_logica || '—' }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Columna derecha (contenido) -->
      <div class="xl:col-span-8 flex flex-col gap-5">

        <!-- Patrón Ganador -->
        <div class="bg-surface rounded-xl border border-accent-border shadow-sm p-6 bg-accent-subtle/30">
          <p class="text-[10px] font-semibold text-accent uppercase tracking-wider mb-3">Síntesis del Patrón Ganador</p>
          <p class="text-base text-ink leading-relaxed max-w-2xl">{{ guion.resumen_patron }}</p>
        </div>

        <!-- Apertura y Cierre -->
        <div v-if="guion.apertura_exacta || guion.cierre_exacto" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-surface rounded-xl border border-success-border p-5">
            <p class="text-[10px] font-semibold text-success uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">play_arrow</span> Apertura Exacta
            </p>
            <p class="text-sm text-ink-2 leading-relaxed italic">"{{ guion.apertura_exacta }}"</p>
          </div>
          <div class="bg-surface rounded-xl border border-warn-border p-5">
            <p class="text-[10px] font-semibold text-warn uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">stop</span> Cierre Exacto
            </p>
            <p class="text-sm text-ink-2 leading-relaxed italic">"{{ guion.cierre_exacto }}"</p>
          </div>
        </div>

        <!-- Ingredientes Clave -->
        <div v-if="guion.ingredientes_clave?.length" class="bg-surface rounded-xl border border-border shadow-sm p-6">
          <h3 class="text-xs font-semibold text-ink-2 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-warn text-[16px]">key</span>
            Ingredientes Clave para Replicar
          </h3>
          <div class="space-y-2">
            <div v-for="(ing, i) in guion.ingredientes_clave" :key="i" class="flex items-start gap-3 py-2 border-b border-border last:border-0">
              <span class="w-5 h-5 rounded-full bg-warn-subtle border border-warn-border text-warn text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{{ i + 1 }}</span>
              <p class="text-sm text-ink-2 leading-relaxed">{{ ing }}</p>
            </div>
          </div>
        </div>

        <!-- Emocional + Cialdini -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-surface rounded-xl border border-border shadow-sm p-5">
            <h3 class="text-xs font-semibold text-ink-2 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-orange-500 text-[16px]">local_fire_department</span>
              Resonancia Emocional
            </h3>
            <div class="mb-4">
              <div class="flex justify-between text-xs font-medium mb-1.5">
                <span class="text-ink-3">Intensidad</span>
                <span class="text-orange-500 font-semibold">{{ guion.intensidad_emocional || 0 }}/10</span>
              </div>
              <div class="w-full bg-surface-subtle h-1.5 rounded-full overflow-hidden">
                <div class="bg-orange-400 h-full rounded-full" :style="{ width: ((guion.intensidad_emocional||0)*10) + '%' }"></div>
              </div>
            </div>
            <div class="space-y-2">
              <DataRow label="Trigger Principal"  :value="guion.trigger_emocional" highlight />
              <DataRow label="Arco Emocional"     :value="guion.arco_emocional" />
              <DataRow label="Sesgo Cognitivo"    :value="guion.sesgo_cognitivo" />
              <DataRow label="Dolor / Placer"     :value="guion.dolor_placer" highlight />
            </div>
          </div>

          <div class="bg-surface rounded-xl border border-border shadow-sm p-5 flex flex-col">
            <h3 class="text-xs font-semibold text-ink-2 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-indigo-500 text-[16px]">group_work</span>
              Principios de Cialdini
            </h3>
            <div class="grid grid-cols-2 gap-2 flex-1">
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

        <!-- Neuromarketing + Entrega -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-surface rounded-xl border border-border shadow-sm p-5">
            <h3 class="text-xs font-semibold text-ink-2 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-fuchsia-500 text-[16px]">biotech</span>
              Neuromarketing
            </h3>
            <div class="space-y-2">
              <DataRow label="Atención Visual"     :value="guion.atencion_visual"      highlight />
              <DataRow label="Carga Cognitiva"     :value="guion.carga_cognitiva"      highlight />
              <DataRow label="Ritmo / Pacing"      :value="guion.pacing_ritmo"         highlight />
              <DataRow label="Lenguaje Sensorial"  :value="guion.lenguaje_sensorial"   type="boolean" />
              <DataRow label="Contraste Narrativo" :value="guion.contraste_narrativo"  type="boolean" />
              <DataRow label="Efecto Novedad"      :value="guion.efecto_novedad"       type="boolean" />
              <DataRow label="Micro Compromisos"   :value="guion.micro_compromisos"    type="boolean" />
            </div>
          </div>

          <div class="bg-surface rounded-xl border border-border shadow-sm p-5 flex flex-col">
            <h3 class="text-xs font-semibold text-ink-2 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-cyan-600 text-[16px]">record_voice_over</span>
              Entrega y Alcance
            </h3>
            <div class="space-y-2 mb-4">
              <DataRow label="Tono"              :value="guion.tono"                highlight />
              <DataRow label="Perspectiva"       :value="guion.persona_narradora"   highlight />
              <DataRow label="Especificidad"     :value="guion.nivel_especificidad" highlight />
              <DataRow label="Velocidad"         :value="guion.velocidad_locucion" />
              <DataRow label="CTA"               :value="guion.cta_tipo"            highlight />
            </div>
            <div v-if="guion.cta_texto" class="p-3 rounded-lg bg-surface-muted border border-border">
              <p class="text-[9px] text-ink-3 font-semibold uppercase tracking-wider mb-1">Texto del CTA</p>
              <p class="text-xs text-ink-2 italic">"{{ guion.cta_texto }}"</p>
            </div>
            <div class="mt-3">
              <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-2">Palabras Clave</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="kw in guion.palabras_clave" :key="kw" class="px-2 py-0.5 bg-surface-muted border border-border rounded text-[10px] font-medium text-ink-2">{{ kw }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Promesa + Conflicto -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-surface rounded-xl border border-border p-5">
            <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-2">Promesa Explícita</p>
            <p class="text-sm text-ink leading-relaxed">{{ guion.promesa_explicita || '—' }}</p>
          </div>
          <div class="bg-surface rounded-xl border border-border p-5">
            <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-2">Conflicto → Resolución</p>
            <p class="text-xs text-ink-2 leading-relaxed">{{ guion.conflicto_central || '—' }}</p>
            <p v-if="guion.resolucion" class="text-xs text-success mt-2 leading-relaxed font-medium">→ {{ guion.resolucion }}</p>
          </div>
        </div>

        <!-- Fortalezas / Debilidades -->
        <div v-if="guion.fortalezas?.length || guion.debilidades?.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-surface rounded-xl border border-success-border p-5">
            <h3 class="text-xs font-semibold text-success uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]" style="font-variation-settings:'FILL' 1;">thumb_up</span> Fortalezas
            </h3>
            <div class="space-y-2">
              <div v-for="(f, i) in guion.fortalezas" :key="i" class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0"></span>
                <p class="text-xs text-ink-2 leading-relaxed">{{ f }}</p>
              </div>
            </div>
          </div>
          <div class="bg-surface rounded-xl border border-error-border p-5">
            <h3 class="text-xs font-semibold text-error uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">build</span> Áreas de Mejora
            </h3>
            <div class="space-y-2 mb-4">
              <div v-for="(d, i) in guion.debilidades" :key="i" class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-error mt-1.5 shrink-0"></span>
                <p class="text-xs text-ink-2 leading-relaxed">{{ d }}</p>
              </div>
            </div>
            <div v-if="guion.sugerencias_mejora?.length">
              <p class="text-[9px] text-ink-3 font-semibold uppercase tracking-wider mb-2">Sugerencias</p>
              <div class="space-y-1.5">
                <div v-for="(s, i) in guion.sugerencias_mejora" :key="i" class="flex items-start gap-2">
                  <span class="text-[10px] font-bold text-warn shrink-0 mt-0.5">{{ i + 1 }}.</span>
                  <p class="text-xs text-ink-2 leading-relaxed">{{ s }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hashtags -->
        <div v-if="guion.hashtags_sugeridos?.length" class="bg-surface rounded-xl border border-border shadow-sm p-5">
          <h3 class="text-xs font-semibold text-ink-2 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-ink-3 text-[16px]">tag</span> Hashtags Sugeridos
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in guion.hashtags_sugeridos"
              :key="tag"
              class="px-3 py-1.5 bg-accent-subtle border border-accent-border rounded-full text-xs font-medium text-accent cursor-pointer hover:bg-accent hover:text-white transition-colors"
              @click="copiarTag(tag)"
            >#{{ tag.replace(/^#/, '') }}</span>
          </div>
          <p class="text-[10px] text-ink-3 mt-2">Haz clic en un hashtag para copiarlo</p>
        </div>

        <!-- Contexto ingresado -->
        <div v-if="guion.contexto_video" class="bg-surface rounded-xl border border-warn-border p-5">
          <p class="text-[10px] font-semibold text-warn uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px]">lightbulb</span> Contexto ingresado
          </p>
          <p class="text-sm text-ink-2 leading-relaxed italic">{{ guion.contexto_video }}</p>
        </div>

        <!-- Transcripción -->
        <div class="bg-surface rounded-xl border border-border shadow-sm p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs font-semibold text-ink-2 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-ink-3 text-[16px]">notes</span> Transcripción Completa
            </h3>
            <button @click="showTranscript = !showTranscript" class="text-xs font-medium text-accent hover:text-accent-hover transition-colors">
              {{ showTranscript ? 'Colapsar' : 'Expandir' }}
            </button>
          </div>
          <div :class="showTranscript ? 'max-h-[600px]' : 'max-h-20'" class="overflow-hidden relative transition-all duration-400 ease-in-out">
            <div v-if="!showTranscript" class="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10 pointer-events-none"></div>
            <p class="text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">
              {{ guion.transcript || 'Video sin transcripción disponible.' }}
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../lib/api.js'
import CialdiniItem from '../components/CialdiniItem.vue'
import DataRow from '../components/DataRow.vue'

const route = useRoute()
const guion  = ref(null)
const cargando = ref(true)
const showTranscript = ref(false)

const nivelesConciencia = [
  { key: 'inconsciente' },
  { key: 'problema_consciente' },
  { key: 'solucion_consciente' },
  { key: 'producto_consciente' },
  { key: 'mas_consciente' },
]

const nivelConcienciaIndex = computed(() => {
  if (!guion.value?.nivel_consciencia) return -1
  return nivelesConciencia.findIndex(n => n.key === guion.value.nivel_consciencia)
})

const ratioColor = computed(() => {
  const map = { emocional: 'text-orange-500', logico: 'text-blue-500', equilibrado: 'text-success' }
  return map[guion.value?.ratio_emocion_logica] || 'text-ink-3'
})

const ratioIcon = computed(() => {
  const map = { emocional: 'favorite', logico: 'psychology', equilibrado: 'balance' }
  return map[guion.value?.ratio_emocion_logica] || 'help'
})

function openUrl(url) {
  if (url) window.open(url, '_blank')
}

function formatNum(n) {
  if (!n) return '—'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
  return n.toLocaleString()
}

function copiarTag(tag) {
  navigator.clipboard.writeText('#' + tag.replace(/^#/, ''))
}

function plataformaBadge(p) {
  return {
    tiktok: 'bg-red-950 text-red-400 border border-red-800',
    reels:  'bg-fuchsia-950 text-fuchsia-400 border border-fuchsia-800',
    shorts: 'bg-orange-950 text-orange-400 border border-orange-800',
  }[p] ?? 'bg-surface-muted text-ink-2 border border-border'
}

function replicabilidadBadge(r) {
  return {
    alta:  'bg-success-subtle text-success border border-success-border',
    media: 'bg-warn-subtle text-warn border border-warn-border',
    baja:  'bg-error-subtle text-error border border-error-border',
  }[r] ?? 'bg-surface-muted text-ink-3 border border-border'
}

onMounted(async () => {
  try {
    guion.value = await api.guiones.obtener(route.params.id)
  } finally {
    cargando.value = false
  }
})
</script>
