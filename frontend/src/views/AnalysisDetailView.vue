<template>
  <div v-if="cargando" class="flex flex-col items-center justify-center py-24 gap-4 min-h-[50vh]">
    <div class="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p class="text-outline text-sm animate-pulse">Cargando datos neuro-semánticos...</p>
  </div>

  <div v-else-if="guion" class="max-w-6xl mx-auto relative flex flex-col gap-8 pb-12">
    <!-- Encabezado -->
    <header class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <router-link to="/analysis" class="flex items-center gap-2 text-outline hover:text-white transition-colors text-sm font-bold uppercase tracking-widest mb-6 w-fit">
          <span class="material-symbols-outlined text-lg">west</span> Volver al Historial
        </router-link>
        <div class="flex items-center gap-3 mb-3 flex-wrap">
          <span class="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-[11px] font-black rounded uppercase tracking-widest">{{ guion.niche }}</span>
          <span v-if="guion.sub_niche" class="px-3 py-1 bg-surface-container-low border border-outline-variant/20 text-outline text-[11px] font-bold rounded">{{ guion.sub_niche }}</span>
          <span :class="plataformaBadge(guion.plataforma)" class="px-3 py-1 text-[11px] font-black rounded uppercase tracking-widest">{{ guion.plataforma }}</span>
          <span v-if="guion.replicabilidad" :class="replicabilidadBadge(guion.replicabilidad)" class="px-3 py-1 text-[11px] font-black rounded uppercase tracking-widest">
            Replicabilidad {{ guion.replicabilidad }}
          </span>
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
        <button class="px-6 py-3 bg-gradient-to-br from-primary-container to-primary text-on-primary-container font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm h-12 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">auto_fix_high</span> Generar Guion
        </button>
      </div>
    </header>

    <!-- Cuadrícula principal -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
      <!-- Columna izquierda -->
      <div class="xl:col-span-4 flex flex-col gap-6">

        <!-- Métricas Sociales -->
        <div v-if="guion.vistas || guion.likes || guion.compartidos" class="bg-surface-container p-5 rounded-3xl border border-outline-variant/10 shadow-xl">
          <h3 class="text-xs font-headline font-bold text-white mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-outline text-base">bar_chart</span> Métricas del Video
          </h3>
          <div class="grid grid-cols-3 gap-3">
            <div class="text-center p-3 rounded-2xl bg-surface-container-low border border-white/5">
              <span class="material-symbols-outlined text-blue-400 text-lg block mb-1">visibility</span>
              <p class="text-[9px] text-outline font-black uppercase tracking-widest mb-1">Vistas</p>
              <p class="text-base font-black text-white font-headline">{{ formatNum(guion.vistas) }}</p>
            </div>
            <div class="text-center p-3 rounded-2xl bg-surface-container-low border border-white/5">
              <span class="material-symbols-outlined text-red-400 text-lg block mb-1" style="font-variation-settings:'FILL' 1;">favorite</span>
              <p class="text-[9px] text-outline font-black uppercase tracking-widest mb-1">Likes</p>
              <p class="text-base font-black text-white font-headline">{{ formatNum(guion.likes) }}</p>
            </div>
            <div class="text-center p-3 rounded-2xl bg-surface-container-low border border-white/5">
              <span class="material-symbols-outlined text-secondary text-lg block mb-1">share</span>
              <p class="text-[9px] text-outline font-black uppercase tracking-widest mb-1">Compartidos</p>
              <p class="text-base font-black text-white font-headline">{{ formatNum(guion.compartidos) }}</p>
            </div>
          </div>
          <div v-if="guion.score_engagement" class="mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container-lowest border border-white/5">
            <span class="text-[10px] text-outline font-black uppercase tracking-widest">Engagement Rate</span>
            <span class="text-sm font-black text-secondary">{{ (guion.score_engagement * 1).toFixed(2) }}%</span>
          </div>
        </div>

        <!-- Puntaje -->
        <div class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-2xl relative overflow-hidden group">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors pointer-events-none"></div>
          <h3 class="text-sm font-headline font-bold text-white mb-8 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">analytics</span> Puntaje Neuro-Engagement
          </h3>
          <div class="flex justify-center mb-6 relative">
            <svg class="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="8" />
              <circle cx="50" cy="50" r="45" fill="none" class="stroke-primary transition-all duration-1000 ease-out" stroke-width="8" :stroke-dasharray="`${(guion.score_virabilidad || 0)/100 * 283} 283`" stroke-linecap="round" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-6xl font-black font-headline text-white tracking-tighter">{{ guion.score_virabilidad || 0 }}</span>
              <span class="text-xs font-bold text-primary uppercase tracking-widest mt-1">/ 100</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
            <div class="text-center">
              <p class="text-[9px] text-outline uppercase tracking-widest font-bold mb-1">Cialdini</p>
              <p class="text-xl font-bold text-white">{{ guion.score_cialdini ?? 0 }}<span class="text-sm text-outline">/7</span></p>
            </div>
            <div class="text-center">
              <p class="text-[9px] text-outline uppercase tracking-widest font-bold mb-1">Intensidad</p>
              <p class="text-xl font-bold text-orange-400">{{ guion.intensidad_emocional || 0 }}<span class="text-sm text-outline">/10</span></p>
            </div>
          </div>
        </div>

        <!-- Ganchos semánticos -->
        <div class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl">
          <h3 class="text-sm font-headline font-bold text-white mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary">psychology_alt</span> Ganchos Semánticos
          </h3>
          <div class="space-y-4">
            <div>
              <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-2">Estructura Narrativa</p>
              <div class="p-3 rounded-lg border border-white/5 bg-surface-container-low">
                <span class="text-sm font-bold text-on-surface">{{ guion.estructura_narrativa || 'No detectada' }}</span>
              </div>
            </div>
            <div>
              <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-2 flex justify-between">
                <span>Gancho Principal</span>
                <span class="text-secondary">{{ guion.gancho_duracion_seg ? guion.gancho_duracion_seg + 's' : '' }}</span>
              </p>
              <div class="p-4 rounded-xl border border-secondary/20 bg-surface-container-low relative">
                <div class="absolute top-0 right-0 p-2"><span class="w-1.5 h-1.5 rounded-full bg-secondary block"></span></div>
                <p class="text-xs text-secondary font-bold uppercase tracking-wider mb-2">{{ guion.gancho_tipo || 'Gancho Estándar' }}</p>
                <p class="text-sm text-white font-medium leading-relaxed italic">"{{ guion.gancho_texto || '—' }}"</p>
              </div>
            </div>
            <div>
              <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-2">Técnica de Retención</p>
              <div class="p-3 rounded-lg border border-primary/20 bg-primary/5 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-base">repeat</span>
                <span class="text-sm font-bold text-primary">{{ guion.tecnica_retencion || '—' }}</span>
                <span v-if="guion.momento_pico_seg" class="ml-auto text-[10px] text-outline font-bold">Pico: {{ guion.momento_pico_seg }}s</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Avatar y Consciencia -->
        <div class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl">
          <h3 class="text-sm font-headline font-bold text-white mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-tertiary">person_search</span> Avatar & Copywriting
          </h3>
          <div class="space-y-4">
            <div>
              <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-2">Nivel de Consciencia</p>
              <div class="relative">
                <div class="flex gap-1">
                  <div v-for="(nivel, i) in nivelesConciencia" :key="nivel.key"
                    class="flex-1 h-2 rounded-full transition-all"
                    :class="nivelConcienciaIndex >= i ? 'bg-primary' : 'bg-surface-container-highest'"
                  ></div>
                </div>
                <p class="text-xs font-bold text-primary mt-2">{{ guion.nivel_consciencia?.replace(/_/g,' ') || '—' }}</p>
              </div>
            </div>
            <div>
              <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-2">Avatar Objetivo</p>
              <p class="text-xs text-on-surface-variant leading-relaxed">{{ guion.avatar_descripcion || '—' }}</p>
            </div>
            <div v-if="guion.objecion_principal">
              <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-2">Objeción Principal</p>
              <div class="p-3 rounded-xl border border-red-500/20 bg-red-500/5">
                <p class="text-xs text-red-400 leading-relaxed italic">"{{ guion.objecion_principal }}"</p>
              </div>
            </div>
            <div>
              <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-2">Balance Emoción / Lógica</p>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base" :class="ratioColor">{{ ratioIcon }}</span>
                <span class="text-sm font-bold" :class="ratioColor">{{ guion.ratio_emocion_logica || '—' }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Columna derecha -->
      <div class="xl:col-span-8 flex flex-col gap-6">

        <!-- Patrón ganador -->
        <div class="bg-surface-container p-8 rounded-3xl border border-primary/20 shadow-2xl relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
          <p class="text-xs text-primary font-bold uppercase tracking-widest mb-4">Síntesis del Patrón Ganador</p>
          <p class="text-lg md:text-xl text-white font-medium leading-relaxed max-w-3xl relative z-10">{{ guion.resumen_patron }}</p>
        </div>

        <!-- Apertura y Cierre -->
        <div v-if="guion.apertura_exacta || guion.cierre_exacto" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-surface-container p-5 rounded-2xl border border-secondary/20">
            <p class="text-[10px] text-secondary font-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">play_arrow</span> Apertura Exacta
            </p>
            <p class="text-sm text-white font-medium leading-relaxed italic">"{{ guion.apertura_exacta }}"</p>
          </div>
          <div class="bg-surface-container p-5 rounded-2xl border border-tertiary/20">
            <p class="text-[10px] text-tertiary font-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">stop</span> Cierre Exacto
            </p>
            <p class="text-sm text-white font-medium leading-relaxed italic">"{{ guion.cierre_exacto }}"</p>
          </div>
        </div>

        <!-- Ingredientes clave -->
        <div v-if="guion.ingredientes_clave?.length" class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl">
          <h3 class="text-sm font-headline font-bold text-white mb-5 flex items-center gap-2">
            <span class="material-symbols-outlined text-yellow-400">key</span> Ingredientes Clave para Replicar
          </h3>
          <div class="space-y-2">
            <div v-for="(ing, i) in guion.ingredientes_clave" :key="i" class="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-white/5">
              <span class="w-5 h-5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{{ i + 1 }}</span>
              <p class="text-sm text-on-surface-variant leading-relaxed">{{ ing }}</p>
            </div>
          </div>
        </div>

        <!-- Emocional + Cialdini -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl">
            <h3 class="text-sm font-headline font-bold text-white mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-orange-400">local_fire_department</span> Resonancia Emocional
            </h3>
            <div class="mb-5">
              <div class="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                <span class="text-outline">Intensidad</span>
                <span class="text-orange-400">{{ guion.intensidad_emocional || 0 }}/10</span>
              </div>
              <div class="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-orange-500/50 to-orange-400 h-full" :style="{ width: ((guion.intensidad_emocional||0)*10) + '%' }"></div>
              </div>
            </div>
            <div class="space-y-3">
              <DataRow label="Trigger Principal"  :value="guion.trigger_emocional" highlight />
              <DataRow label="Arco Emocional"     :value="guion.arco_emocional" />
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

        <!-- Neuromarketing + Entrega -->
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
              <DataRow label="Micro Compromisos"   :value="guion.micro_compromisos"    type="boolean" />
            </div>
          </div>

          <div class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl flex flex-col">
            <h3 class="text-sm font-headline font-bold text-white mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-cyan-400">record_voice_over</span> Entrega y Alcance
            </h3>
            <div class="space-y-3 mb-5">
              <DataRow label="Tono"              :value="guion.tono"                highlight />
              <DataRow label="Perspectiva"       :value="guion.persona_narradora"   highlight />
              <DataRow label="Especificidad"     :value="guion.nivel_especificidad" highlight />
              <DataRow label="Velocidad"         :value="guion.velocidad_locucion" />
              <DataRow label="CTA"               :value="guion.cta_tipo"            highlight />
            </div>
            <div v-if="guion.cta_texto" class="p-3 rounded-xl bg-surface-container-low border border-white/5">
              <p class="text-[9px] text-outline font-black uppercase tracking-widest mb-1">Texto del CTA</p>
              <p class="text-xs text-on-surface-variant italic">"{{ guion.cta_texto }}"</p>
            </div>
            <div class="mt-3">
              <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-2">Palabras Clave</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="kw in guion.palabras_clave" :key="kw" class="px-2 py-1 bg-surface-container-lowest border border-white/5 rounded text-[10px] font-bold text-on-surface-variant">{{ kw }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Promesa + Conflicto -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-surface-container p-5 rounded-2xl border border-outline-variant/10">
            <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-2">Promesa Explícita</p>
            <p class="text-sm text-white leading-relaxed">{{ guion.promesa_explicita || '—' }}</p>
          </div>
          <div class="bg-surface-container p-5 rounded-2xl border border-outline-variant/10">
            <p class="text-[10px] text-outline uppercase tracking-widest font-bold mb-2">Conflicto → Resolución</p>
            <p class="text-xs text-on-surface-variant leading-relaxed">{{ guion.conflicto_central || '—' }}</p>
            <p v-if="guion.resolucion" class="text-xs text-secondary mt-2 leading-relaxed">→ {{ guion.resolucion }}</p>
          </div>
        </div>

        <!-- Diagnóstico: Fortalezas / Debilidades / Sugerencias -->
        <div v-if="guion.fortalezas?.length || guion.debilidades?.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-surface-container p-6 rounded-3xl border border-secondary/10 shadow-xl">
            <h3 class="text-sm font-headline font-bold text-white mb-5 flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary text-base" style="font-variation-settings:'FILL' 1;">thumb_up</span> Fortalezas
            </h3>
            <div class="space-y-2">
              <div v-for="(f, i) in guion.fortalezas" :key="i" class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0"></span>
                <p class="text-xs text-on-surface-variant leading-relaxed">{{ f }}</p>
              </div>
            </div>
          </div>
          <div class="bg-surface-container p-6 rounded-3xl border border-red-500/10 shadow-xl">
            <h3 class="text-sm font-headline font-bold text-white mb-5 flex items-center gap-2">
              <span class="material-symbols-outlined text-red-400 text-base">build</span> Áreas de Mejora
            </h3>
            <div class="space-y-2 mb-5">
              <div v-for="(d, i) in guion.debilidades" :key="i" class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                <p class="text-xs text-on-surface-variant leading-relaxed">{{ d }}</p>
              </div>
            </div>
            <div v-if="guion.sugerencias_mejora?.length">
              <p class="text-[9px] text-outline font-black uppercase tracking-widest mb-2">Sugerencias</p>
              <div class="space-y-1.5">
                <div v-for="(s, i) in guion.sugerencias_mejora" :key="i" class="flex items-start gap-2">
                  <span class="text-[9px] font-black text-tertiary shrink-0 mt-0.5">{{ i + 1 }}.</span>
                  <p class="text-xs text-on-surface-variant leading-relaxed">{{ s }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hashtags sugeridos -->
        <div v-if="guion.hashtags_sugeridos?.length" class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl">
          <h3 class="text-sm font-headline font-bold text-white mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-outline text-base">tag</span> Hashtags Sugeridos
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in guion.hashtags_sugeridos"
              :key="tag"
              class="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary cursor-pointer hover:bg-primary/20 transition-colors"
              @click="copiarTag(tag)"
            >#{{ tag.replace(/^#/, '') }}</span>
          </div>
          <p class="text-[9px] text-outline/50 mt-3 italic">Haz clic en un hashtag para copiarlo</p>
        </div>

        <!-- Contexto original del usuario -->
        <div v-if="guion.contexto_video" class="bg-surface-container p-5 rounded-2xl border border-tertiary/10">
          <p class="text-[10px] text-tertiary font-black uppercase tracking-widest mb-2 flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">lightbulb</span> Contexto ingresado
          </p>
          <p class="text-sm text-on-surface-variant leading-relaxed italic">{{ guion.contexto_video }}</p>
        </div>

        <!-- Transcripción -->
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
  const map = { emocional: 'text-orange-400', logico: 'text-blue-400', equilibrado: 'text-secondary' }
  return map[guion.value?.ratio_emocion_logica] || 'text-outline'
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
    tiktok: 'bg-red-500/20 text-red-400',
    reels:  'bg-fuchsia-500/20 text-fuchsia-400',
    shorts: 'bg-red-600/20 text-red-500',
  }[p] ?? 'bg-white/5 text-on-surface-variant'
}

function replicabilidadBadge(r) {
  return {
    alta:  'bg-secondary/10 text-secondary border border-secondary/20',
    media: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    baja:  'bg-red-500/10 text-red-400 border border-red-500/20',
  }[r] ?? 'bg-white/5 text-outline'
}

onMounted(async () => {
  try {
    guion.value = await api.guiones.obtener(route.params.id)
  } finally {
    cargando.value = false
  }
})
</script>
