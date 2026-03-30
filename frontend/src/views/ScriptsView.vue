<template>
  <div class="max-w-7xl mx-auto flex flex-col gap-10">
    <!-- Encabezado -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
      <div>
        <h1 class="text-5xl font-extrabold font-headline tracking-tighter text-white mb-2 leading-tight">Biblioteca de Guiones</h1>
        <p class="text-sm font-bold flex items-center gap-2 tracking-widest uppercase" :class="filtros.tipo === 'analizados' ? 'text-primary' : 'text-secondary'">
          <span class="material-symbols-outlined text-sm">{{ filtros.tipo === 'analizados' ? 'description' : 'auto_fix_high' }}</span>
          {{ totalGuiones }} guiones {{ filtros.tipo }} en el repositorio
        </p>
      </div>
      <div class="flex items-center gap-4">
        <button class="px-6 py-3 bg-surface-container border border-white/5 text-outline font-bold rounded-xl text-sm hover:text-white transition-colors" @click="cargarDatos">Actualizar</button>
        <router-link to="/new-analysis" class="px-8 py-3 bg-gradient-to-br from-primary-container to-primary text-on-primary-container font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm h-12 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">add</span> Nuevo Análisis
        </router-link>
      </div>
    </header>

    <!-- Filtros -->
    <div class="flex flex-wrap gap-4 items-center">
      <!-- Toggle Analizados / Generados -->
      <div class="flex items-center bg-surface-container border border-white/10 rounded-xl p-1 gap-1">
        <button
          @click="cambiarTipo('analizados')"
          :class="filtros.tipo === 'analizados'
            ? 'bg-primary/20 text-primary border-primary/30'
            : 'text-outline hover:text-white border-transparent'"
          class="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">analytics</span>
          Analizados
        </button>
        <button
          @click="cambiarTipo('generados')"
          :class="filtros.tipo === 'generados'
            ? 'bg-secondary/20 text-secondary border-secondary/30'
            : 'text-outline hover:text-white border-transparent'"
          class="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">auto_fix_high</span>
          Generados
        </button>
      </div>

      <div class="relative flex-1 min-w-[200px] max-w-sm">
        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
        <input
          v-model="filtros.busqueda"
          type="text"
          placeholder="Buscar por tema, gancho..."
          class="w-full bg-surface-container border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-outline/40 focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
        />
      </div>

      <select v-model="filtros.niche" class="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/40 appearance-none min-w-[150px]">
        <option value="">Todos los nichos</option>
        <option v-for="n in nichos" :key="n" :value="n">{{ n }}</option>
      </select>

      <select v-model="filtros.plataforma" class="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/40 appearance-none min-w-[150px]">
        <option value="">Todas las plataformas</option>
        <option value="tiktok">TikTok</option>
        <option value="reels">Instagram Reels</option>
        <option value="shorts">YouTube Shorts</option>
      </select>

      <select v-if="filtros.tipo === 'analizados'" v-model="filtros.orden" class="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/40 appearance-none min-w-[180px]">
        <option value="fecha_desc">Más recientes</option>
        <option value="viralidad_desc">Mayor viralidad</option>
        <option value="engagement_desc">Mayor engagement</option>
        <option value="cialdini_desc">Mayor score Cialdini</option>
      </select>
      <select v-else v-model="filtros.orden" class="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/40 appearance-none min-w-[180px]">
        <option value="fecha_desc">Más recientes</option>
        <option value="score_desc">Mayor score</option>
      </select>
    </div>

    <!-- Grid de Guiones -->
    <div v-if="cargando" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-surface-container rounded-3xl border border-white/5 p-6 animate-pulse h-64"></div>
    </div>

    <div v-else-if="guionesFiltrados.length === 0" class="flex flex-col items-center justify-center py-24 gap-4 opacity-40">
      <span class="material-symbols-outlined text-6xl">inventory_2</span>
      <p class="text-sm font-bold uppercase tracking-widest text-outline">No hay guiones que coincidan con los filtros</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="g in guionesFiltrados"
        :key="g.id"
        @click="filtros.tipo === 'analizados' ? verDetalle(g.id) : verGenerado(g.id)"
        class="bg-surface-container rounded-3xl border border-outline-variant/10 shadow-xl p-6 flex flex-col gap-4 cursor-pointer transition-all group relative overflow-hidden"
        :class="filtros.tipo === 'analizados'
          ? 'hover:border-primary/20 hover:shadow-primary/10'
          : 'hover:border-secondary/20 hover:shadow-secondary/10'"
      >
        <div
          class="absolute -bottom-8 -right-8 w-28 h-28 blur-2xl rounded-full transition-colors"
          :class="filtros.tipo === 'analizados' ? 'bg-primary/5 group-hover:bg-primary/10' : 'bg-secondary/5 group-hover:bg-secondary/10'"
        ></div>

        <!-- Badges -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span :class="plataformaBadge(g.plataforma)" class="text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest">{{ g.plataforma }}</span>
            <span class="text-[10px] font-black text-outline uppercase tracking-wider">{{ g.niche }}</span>
          </div>
          <div class="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low rounded-full border border-white/5">
            <span
              class="material-symbols-outlined text-sm"
              :class="filtros.tipo === 'analizados' ? 'text-primary' : 'text-secondary'"
              style="font-variation-settings: 'FILL' 1;"
            >{{ filtros.tipo === 'analizados' ? 'bolt' : 'auto_fix_high' }}</span>
            <span class="text-[11px] font-black text-white">
              {{ filtros.tipo === 'analizados' ? (g.score_virabilidad || 0) : (g.score_estimado || 0) }}
            </span>
          </div>
        </div>

        <!-- Tema -->
        <div>
          <p
            class="text-sm font-bold text-white leading-snug line-clamp-2 mb-1 transition-colors"
            :class="filtros.tipo === 'analizados' ? 'group-hover:text-primary' : 'group-hover:text-secondary'"
          >
            {{ filtros.tipo === 'analizados' ? (g.tema_principal || 'Sin título detectado') : (g.titulo_sugerido || g.tema || 'Sin título') }}
          </p>
          <p v-if="filtros.tipo === 'analizados'" class="text-[10px] text-outline/60 italic truncate">{{ g.url_origen }}</p>
          <p v-else class="text-[10px] text-outline/60 italic truncate">{{ g.tono }} · {{ g.objetivo }}</p>
        </div>

        <!-- Gancho -->
        <div class="flex-1">
          <p class="text-[10px] text-outline font-black uppercase tracking-widest mb-1">Gancho</p>
          <p class="text-xs text-on-surface-variant leading-relaxed italic line-clamp-3">
            "{{ (filtros.tipo === 'analizados' ? g.gancho_texto : g.gancho) || '—' }}"
          </p>
        </div>

        <!-- Métricas analizados -->
        <div v-if="filtros.tipo === 'analizados'" class="flex items-center justify-between pt-4 border-t border-white/5">
          <div class="text-center">
            <p class="text-[9px] text-outline font-black uppercase tracking-widest">Engagement</p>
            <p class="text-sm font-black text-secondary">{{ (g.score_engagement || 0).toFixed(1) }}%</p>
          </div>
          <div class="text-center">
            <p class="text-[9px] text-outline font-black uppercase tracking-widest">Cialdini</p>
            <p class="text-sm font-black text-white">{{ g.score_cialdini || 0 }}/7</p>
          </div>
          <div class="text-center">
            <p class="text-[9px] text-outline font-black uppercase tracking-widest">Viralidad</p>
            <div class="w-16 bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-1">
              <div class="bg-primary h-full transition-all duration-1000" :style="{ width: (g.score_virabilidad || 0) + '%' }"></div>
            </div>
          </div>
          <button class="p-2 rounded-xl bg-surface-container-low border border-white/5 text-outline hover:text-white hover:border-primary/20 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
            <span class="material-symbols-outlined text-base">open_in_new</span>
          </button>
        </div>

        <!-- Métricas generados -->
        <div v-else class="flex items-center justify-between pt-4 border-t border-white/5">
          <div class="text-center">
            <p class="text-[9px] text-outline font-black uppercase tracking-widest">Score</p>
            <p class="text-sm font-black text-secondary">{{ g.score_estimado || 0 }}/100</p>
          </div>
          <div class="text-center">
            <p class="text-[9px] text-outline font-black uppercase tracking-widest">Duración</p>
            <p class="text-sm font-black text-white">{{ g.duracion_estimada_seg || '—' }}s</p>
          </div>
          <div class="text-center">
            <p class="text-[9px] text-outline font-black uppercase tracking-widest">Estructura</p>
            <p class="text-xs font-black text-outline">{{ g.estructura_usada || '—' }}</p>
          </div>
          <button class="p-2 rounded-xl bg-surface-container-low border border-white/5 text-outline hover:text-white hover:border-secondary/20 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
            <span class="material-symbols-outlined text-base">open_in_new</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Guion Generado -->
    <Teleport to="body">
      <div
        v-if="modalGenerado"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="modalGenerado = null"
      >
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div class="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface rounded-3xl border border-secondary/20 shadow-2xl shadow-secondary/10 flex flex-col">
          <!-- Header -->
          <div class="sticky top-0 bg-surface px-8 py-6 border-b border-white/5 flex items-start justify-between gap-4 z-10">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span :class="plataformaBadge(modalGenerado.plataforma)" class="text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest">{{ modalGenerado.plataforma }}</span>
                <span class="text-[10px] font-black text-outline uppercase tracking-wider">{{ modalGenerado.niche }}</span>
                <div class="flex items-center gap-1 px-2 py-0.5 bg-secondary/10 rounded-full border border-secondary/20">
                  <span class="material-symbols-outlined text-secondary text-xs" style="font-variation-settings:'FILL' 1;">auto_fix_high</span>
                  <span class="text-[10px] font-black text-secondary">{{ modalGenerado.score_estimado }}/100</span>
                </div>
              </div>
              <h2 class="text-lg font-headline font-black text-white leading-tight">{{ modalGenerado.titulo_sugerido }}</h2>
              <p class="text-[10px] text-outline/60 mt-1">{{ modalGenerado.tono }} · {{ modalGenerado.objetivo }} · {{ modalGenerado.duracion_estimada_seg }}s estimados</p>
            </div>
            <button @click="modalGenerado = null" class="p-2 rounded-xl bg-surface-container border border-white/5 text-outline hover:text-white transition-colors shrink-0">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <!-- Contenido -->
          <div class="p-8 space-y-6" v-if="!cargandoModal">
            <!-- Técnicas -->
            <div v-if="modalGenerado.tecnicas_aplicadas?.length" class="flex flex-wrap gap-2">
              <span v-for="t in modalGenerado.tecnicas_aplicadas" :key="t" class="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-secondary/10 border border-secondary/20 rounded text-secondary">{{ t }}</span>
            </div>

            <!-- Gancho -->
            <div>
              <p class="text-[10px] text-secondary font-black uppercase tracking-widest mb-2">Gancho</p>
              <p class="text-sm text-white leading-relaxed font-medium">{{ modalGenerado.gancho }}</p>
            </div>

            <!-- Desarrollo -->
            <div>
              <p class="text-[10px] text-primary font-black uppercase tracking-widest mb-2">Desarrollo</p>
              <p class="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">{{ modalGenerado.desarrollo }}</p>
            </div>

            <!-- CTA -->
            <div v-if="modalGenerado.cta">
              <p class="text-[10px] text-outline font-black uppercase tracking-widest mb-2">Call to Action</p>
              <p class="text-sm text-white leading-relaxed font-medium">{{ modalGenerado.cta }}</p>
            </div>

            <!-- Variantes del gancho -->
            <div v-if="modalGenerado.variantes_gancho?.length">
              <p class="text-[10px] text-outline font-black uppercase tracking-widest mb-3 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">shuffle</span> Variantes del Gancho
              </p>
              <div class="space-y-2">
                <div v-for="(v, i) in modalGenerado.variantes_gancho" :key="i" class="p-3 rounded-xl bg-surface-container border border-white/5">
                  <span class="text-[9px] text-outline font-black uppercase tracking-widest mr-2">V{{ i + 1 }}</span>
                  <span class="text-xs text-on-surface-variant italic">"{{ v }}"</span>
                </div>
              </div>
            </div>

            <!-- Notas de producción -->
            <div v-if="modalGenerado.notas_produccion" class="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
              <p class="text-[10px] text-yellow-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">videocam</span> Notas de Producción
              </p>
              <p class="text-xs text-on-surface-variant leading-relaxed">{{ modalGenerado.notas_produccion }}</p>
            </div>

            <!-- Botón copiar -->
            <button @click="copiarGuionModal" class="w-full py-3 bg-secondary/10 border border-secondary/20 text-secondary font-bold rounded-xl text-sm hover:bg-secondary/20 transition-colors flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-sm">{{ copiadoModal ? 'check' : 'content_copy' }}</span>
              {{ copiadoModal ? 'Copiado' : 'Copiar guion completo' }}
            </button>
          </div>

          <div v-else class="p-8 flex items-center justify-center">
            <span class="material-symbols-outlined animate-spin text-secondary text-2xl">hourglass_top</span>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Paginación -->
    <div v-if="!cargando && guionesFiltrados.length > 0" class="flex items-center justify-center gap-4 pt-4">
      <button
        class="px-6 py-2.5 bg-surface-container border border-white/5 text-outline font-bold rounded-xl text-sm hover:text-white hover:border-primary/20 transition-colors disabled:opacity-30"
        :disabled="filtros.page <= 1"
        @click="cambiarPagina(filtros.page - 1)"
      >Anterior</button>
      <span class="text-[11px] font-black text-outline uppercase tracking-widest">Página {{ filtros.page }}</span>
      <button
        class="px-6 py-2.5 bg-surface-container border border-white/5 text-outline font-bold rounded-xl text-sm hover:text-white hover:border-primary/20 transition-colors disabled:opacity-30"
        :disabled="guiones.length < filtros.limit"
        @click="cambiarPagina(filtros.page + 1)"
      >Siguiente</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../lib/api.js'

const router = useRouter()
const guiones      = ref([])
const nichos       = ref([])
const cargando     = ref(true)
const totalGuiones = ref(0)
const modalGenerado  = ref(null)
const cargandoModal  = ref(false)
const copiadoModal   = ref(false)

const filtros = ref({
  tipo: 'analizados',
  page: 1,
  limit: 18,
  niche: '',
  plataforma: '',
  busqueda: '',
  orden: 'fecha_desc',
})

const guionesFiltrados = computed(() => {
  let lista = [...guiones.value]

  if (filtros.value.busqueda.trim()) {
    const q = filtros.value.busqueda.toLowerCase()
    if (filtros.value.tipo === 'analizados') {
      lista = lista.filter(g =>
        (g.tema_principal || '').toLowerCase().includes(q) ||
        (g.gancho_texto || '').toLowerCase().includes(q) ||
        (g.resumen_patron || '').toLowerCase().includes(q)
      )
    } else {
      lista = lista.filter(g =>
        (g.titulo_sugerido || '').toLowerCase().includes(q) ||
        (g.tema || '').toLowerCase().includes(q) ||
        (g.gancho || '').toLowerCase().includes(q)
      )
    }
  }

  switch (filtros.value.orden) {
    case 'viralidad_desc':   lista.sort((a, b) => (b.score_virabilidad || 0) - (a.score_virabilidad || 0)); break
    case 'engagement_desc':  lista.sort((a, b) => (b.score_engagement || 0) - (a.score_engagement || 0)); break
    case 'cialdini_desc':    lista.sort((a, b) => (b.score_cialdini || 0) - (a.score_cialdini || 0)); break
    case 'score_desc':       lista.sort((a, b) => (b.score_estimado || 0) - (a.score_estimado || 0)); break
  }

  return lista
})

async function cargarDatos() {
  cargando.value = true
  try {
    const params = { page: filtros.value.page, limit: filtros.value.limit }
    if (filtros.value.niche)      params.niche      = filtros.value.niche
    if (filtros.value.plataforma) params.plataforma  = filtros.value.plataforma

    if (filtros.value.tipo === 'analizados') {
      const [dg, dn] = await Promise.all([
        api.guiones.listar(params),
        api.nichos(),
      ])
      guiones.value      = dg.guiones
      totalGuiones.value = dg.total || dg.guiones.length
      nichos.value       = dn
    } else {
      const [dg, dn] = await Promise.all([
        api.generados.listar(params),
        api.nichos(),
      ])
      guiones.value      = dg.generados
      totalGuiones.value = dg.total || dg.generados.length
      nichos.value       = dn
    }
  } catch (e) {
    console.error(e)
  } finally {
    cargando.value = false
  }
}

function cambiarTipo(tipo) {
  filtros.value.tipo  = tipo
  filtros.value.page  = 1
  filtros.value.orden = 'fecha_desc'
  cargarDatos()
}

function cambiarPagina(p) {
  if (p < 1) return
  filtros.value.page = p
  cargarDatos()
}

watch([() => filtros.value.niche, () => filtros.value.plataforma], () => {
  filtros.value.page = 1
  cargarDatos()
})

function verDetalle(id) {
  router.push({ name: 'AnalysisDetail', params: { id } })
}

async function verGenerado(id) {
  cargandoModal.value = true
  modalGenerado.value = guiones.value.find(g => g.id === id) || {}
  try {
    const { generado } = await api.generados.obtener(id)
    modalGenerado.value = generado
  } catch (e) {
    console.error(e)
  } finally {
    cargandoModal.value = false
  }
}

async function copiarGuionModal() {
  const texto = modalGenerado.value?.guion_completo
  if (!texto) return
  await navigator.clipboard.writeText(texto)
  copiadoModal.value = true
  setTimeout(() => { copiadoModal.value = false }, 2000)
}

function plataformaBadge(p) {
  const map = {
    tiktok: 'bg-red-500/10 text-red-500 border border-red-500/20',
    reels:  'bg-fuchsia-500/10 text-fuchsia-500 border border-fuchsia-500/20',
    shorts: 'bg-red-600/10 text-red-600 border border-red-600/20',
  }
  return map[p] || 'bg-white/5 text-outline'
}

onMounted(cargarDatos)
</script>
