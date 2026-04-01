<template>
  <div class="flex flex-col gap-8">

    <!-- Encabezado -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
      <div>
        <h1 class="text-3xl font-bold font-headline text-ink mb-1">Biblioteca de Guiones</h1>
        <p class="text-sm text-ink-3">
          {{ totalGuiones }} guiones
          <span class="font-medium" :class="filtros.tipo === 'analizados' ? 'text-accent' : 'text-success'">
            {{ filtros.tipo }}
          </span>
          en el repositorio
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="px-4 py-2 bg-surface border border-border text-ink-2 font-medium rounded-lg text-sm hover:bg-surface-muted transition-colors"
          @click="cargarDatos"
        >
          Actualizar
        </button>
        <router-link
          to="/new-analysis"
          class="px-5 py-2 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Nuevo Análisis
        </router-link>
      </div>
    </header>

    <!-- Filtros -->
    <div class="flex flex-wrap items-center gap-3">

      <!-- Toggle Analizados / Generados -->
      <div class="flex items-center bg-surface border border-border rounded-lg p-1 gap-1">
        <button
          @click="cambiarTipo('analizados')"
          :class="filtros.tipo === 'analizados' ? 'bg-accent text-white shadow-sm' : 'text-ink-2 hover:bg-surface-muted'"
          class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-[14px]">analytics</span>
          Analizados
        </button>
        <button
          @click="cambiarTipo('generados')"
          :class="filtros.tipo === 'generados' ? 'bg-success text-white shadow-sm' : 'text-ink-2 hover:bg-surface-muted'"
          class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-[14px]">auto_fix_high</span>
          Generados
        </button>
      </div>

      <!-- Búsqueda -->
      <div class="relative flex-1 min-w-[200px] max-w-xs">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 text-[18px]">search</span>
        <input
          v-model="filtros.busqueda"
          type="text"
          placeholder="Buscar por tema, gancho…"
          class="w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all"
        />
      </div>

      <select v-model="filtros.niche" class="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-ink-2 focus:outline-none focus:ring-2 focus:ring-accent/30 appearance-none min-w-[140px]">
        <option value="">Todos los nichos</option>
        <option v-for="n in nichos" :key="n" :value="n">{{ n }}</option>
      </select>

      <select v-model="filtros.plataforma" class="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-ink-2 focus:outline-none focus:ring-2 focus:ring-accent/30 appearance-none min-w-[150px]">
        <option value="">Todas las plataformas</option>
        <option value="tiktok">TikTok</option>
        <option value="reels">Instagram Reels</option>
        <option value="shorts">YouTube Shorts</option>
      </select>

      <select v-if="filtros.tipo === 'analizados'" v-model="filtros.orden" class="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-ink-2 focus:outline-none focus:ring-2 focus:ring-accent/30 appearance-none min-w-[160px]">
        <option value="fecha_desc">Más recientes</option>
        <option value="viralidad_desc">Mayor viralidad</option>
        <option value="engagement_desc">Mayor engagement</option>
        <option value="cialdini_desc">Mayor Cialdini</option>
      </select>
      <select v-else v-model="filtros.orden" class="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-ink-2 focus:outline-none focus:ring-2 focus:ring-accent/30 appearance-none min-w-[160px]">
        <option value="fecha_desc">Más recientes</option>
        <option value="score_desc">Mayor score</option>
      </select>
    </div>

    <!-- Skeleton loading -->
    <div v-if="cargando" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div v-for="i in 6" :key="i" class="bg-surface rounded-xl border border-border h-56 animate-pulse"></div>
    </div>

    <!-- Vacío -->
    <div v-else-if="guionesFiltrados.length === 0" class="flex flex-col items-center justify-center py-24 gap-3 text-ink-3">
      <span class="material-symbols-outlined text-4xl">inventory_2</span>
      <p class="text-sm font-medium">No hay guiones que coincidan con los filtros</p>
    </div>

    <!-- Grid de Guiones -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div
        v-for="g in guionesFiltrados"
        :key="g.id"
        @click="filtros.tipo === 'analizados' ? verDetalle(g.id) : verGenerado(g.id)"
        class="bg-surface rounded-xl border border-border shadow-sm p-5 flex flex-col gap-4 cursor-pointer transition-all group hover:shadow-md"
        :class="filtros.tipo === 'analizados' ? 'hover:border-accent/30' : 'hover:border-success/30'"
      >
        <!-- Badges + Score -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span :class="plataformaBadge(g.plataforma)" class="platform-badge">{{ g.plataforma }}</span>
            <span class="text-[10px] font-semibold text-ink-3 uppercase tracking-wide">{{ g.niche }}</span>
          </div>
          <div
            class="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold border"
            :class="filtros.tipo === 'analizados'
              ? 'bg-accent-subtle border-accent-border text-accent'
              : 'bg-success-subtle border-success-border text-success'"
          >
            <span class="material-symbols-outlined text-[12px]" style="font-variation-settings:'FILL' 1;">bolt</span>
            {{ filtros.tipo === 'analizados' ? (g.score_virabilidad || 0) : (g.score_estimado || 0) }}
          </div>
        </div>

        <!-- Tema -->
        <div>
          <p
            class="text-sm font-semibold text-ink leading-snug line-clamp-2 mb-1 transition-colors"
            :class="filtros.tipo === 'analizados' ? 'group-hover:text-accent' : 'group-hover:text-success'"
          >
            {{ filtros.tipo === 'analizados' ? (g.tema_principal || 'Sin título detectado') : (g.titulo_sugerido || g.tema || 'Sin título') }}
          </p>
          <p v-if="filtros.tipo === 'analizados'" class="text-[10px] text-ink-3 truncate">{{ g.url_origen }}</p>
          <p v-else class="text-[10px] text-ink-3 truncate">{{ g.tono }} · {{ g.objetivo }}</p>
        </div>

        <!-- Gancho -->
        <div class="flex-1">
          <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-1">Gancho</p>
          <p class="text-xs text-ink-2 leading-relaxed italic line-clamp-3">
            "{{ (filtros.tipo === 'analizados' ? g.gancho_texto : g.gancho) || '—' }}"
          </p>
        </div>

        <!-- Footer con métricas -->
        <div class="flex items-center justify-between pt-3 border-t border-border">
          <template v-if="filtros.tipo === 'analizados'">
            <div class="text-center">
              <p class="text-[9px] text-ink-3 font-medium mb-0.5">Engagement</p>
              <p class="text-xs font-bold text-success">{{ (g.score_engagement || 0).toFixed(1) }}%</p>
            </div>
            <div class="text-center">
              <p class="text-[9px] text-ink-3 font-medium mb-0.5">Cialdini</p>
              <p class="text-xs font-bold text-ink">{{ g.score_cialdini || 0 }}/7</p>
            </div>
            <div class="text-center">
              <p class="text-[9px] text-ink-3 font-medium mb-1">Viralidad</p>
              <div class="w-16 bg-surface-subtle h-1 rounded-full overflow-hidden">
                <div class="bg-accent h-full rounded-full transition-all" :style="{ width: (g.score_virabilidad || 0) + '%' }"></div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="text-center">
              <p class="text-[9px] text-ink-3 font-medium mb-0.5">Score</p>
              <p class="text-xs font-bold text-success">{{ g.score_estimado || 0 }}/100</p>
            </div>
            <div class="text-center">
              <p class="text-[9px] text-ink-3 font-medium mb-0.5">Duración</p>
              <p class="text-xs font-bold text-ink">{{ g.duracion_estimada_seg || '—' }}s</p>
            </div>
            <div class="text-center">
              <p class="text-[9px] text-ink-3 font-medium mb-0.5">Estructura</p>
              <p class="text-[10px] font-semibold text-ink-2">{{ g.estructura_usada || '—' }}</p>
            </div>
          </template>

          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button class="p-1.5 rounded-lg text-ink-3 hover:text-accent hover:bg-accent-subtle transition-all">
              <span class="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>
            <button
              @click.stop="confirmarEliminar(g)"
              :disabled="eliminandoId === g.id"
              class="p-1.5 rounded-lg text-ink-3 hover:text-red-400 hover:bg-red-950/40 transition-all disabled:opacity-50"
            >
              <span v-if="eliminandoId === g.id" class="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
              <span v-else class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
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
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div class="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface rounded-xl border border-border shadow-xl flex flex-col">

          <!-- Header del modal -->
          <div class="sticky top-0 bg-surface px-6 py-5 border-b border-border flex items-start justify-between gap-4 z-10">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span :class="plataformaBadge(modalGenerado.plataforma)" class="platform-badge">{{ modalGenerado.plataforma }}</span>
                <span class="text-[10px] font-semibold text-ink-3 uppercase tracking-wide">{{ modalGenerado.niche }}</span>
                <div class="flex items-center gap-1 px-2 py-0.5 bg-success-subtle border border-success-border rounded-full">
                  <span class="material-symbols-outlined text-success text-[12px]" style="font-variation-settings:'FILL' 1;">auto_fix_high</span>
                  <span class="text-[10px] font-bold text-success">{{ modalGenerado.score_estimado }}/100</span>
                </div>
              </div>
              <h2 class="text-base font-bold font-headline text-ink leading-tight">{{ modalGenerado.titulo_sugerido }}</h2>
              <p class="text-[11px] text-ink-3 mt-0.5">{{ modalGenerado.tono }} · {{ modalGenerado.objetivo }} · {{ modalGenerado.duracion_estimada_seg }}s estimados</p>
            </div>
            <button @click="modalGenerado = null" class="p-1.5 rounded-lg text-ink-3 hover:text-ink hover:bg-surface-muted transition-colors shrink-0">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Contenido del modal -->
          <div class="p-6 space-y-5" v-if="!cargandoModal">
            <div v-if="modalGenerado.tecnicas_aplicadas?.length" class="flex flex-wrap gap-1.5">
              <span v-for="t in modalGenerado.tecnicas_aplicadas" :key="t" class="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-success-subtle border border-success-border rounded text-success">{{ t }}</span>
            </div>

            <div>
              <p class="text-[10px] font-semibold text-success uppercase tracking-wider mb-2">Gancho</p>
              <p class="text-sm text-ink leading-relaxed">{{ modalGenerado.gancho }}</p>
            </div>

            <div>
              <p class="text-[10px] font-semibold text-accent uppercase tracking-wider mb-2">Desarrollo</p>
              <p class="text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">{{ modalGenerado.desarrollo }}</p>
            </div>

            <div v-if="modalGenerado.cta">
              <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-2">Call to Action</p>
              <p class="text-sm text-ink leading-relaxed">{{ modalGenerado.cta }}</p>
            </div>

            <div v-if="modalGenerado.variantes_gancho?.length">
              <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-2 flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">shuffle</span> Variantes del Gancho
              </p>
              <div class="space-y-2">
                <div v-for="(v, i) in modalGenerado.variantes_gancho" :key="i" class="flex items-start gap-2 p-3 rounded-lg bg-surface-muted border border-border">
                  <span class="text-[9px] font-bold text-ink-3 uppercase tracking-wider pt-0.5 shrink-0">V{{ i + 1 }}</span>
                  <span class="text-xs text-ink-2 italic leading-relaxed">"{{ v }}"</span>
                </div>
              </div>
            </div>

            <div v-if="modalGenerado.notas_produccion" class="p-4 rounded-lg bg-warn-subtle border border-warn-border">
              <p class="text-[10px] font-semibold text-warn uppercase tracking-wider mb-2 flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">videocam</span> Notas de Producción
              </p>
              <p class="text-sm text-ink-2 leading-relaxed">{{ modalGenerado.notas_produccion }}</p>
            </div>

            <button
              @click="copiarGuionModal"
              class="w-full py-2.5 bg-success-subtle border border-success-border text-success font-semibold rounded-lg text-sm hover:bg-success hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-[16px]">{{ copiadoModal ? 'check' : 'content_copy' }}</span>
              {{ copiadoModal ? 'Copiado' : 'Copiar guion completo' }}
            </button>
          </div>

          <div v-else class="p-8 flex items-center justify-center">
            <div class="w-6 h-6 border-2 border-success border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Paginación -->
    <div v-if="!cargando && guionesFiltrados.length > 0" class="flex items-center justify-center gap-3 pt-2">
      <button
        class="px-5 py-2 bg-surface border border-border text-ink-2 font-medium rounded-lg text-sm hover:bg-surface-muted transition-colors disabled:opacity-40"
        :disabled="filtros.page <= 1"
        @click="cambiarPagina(filtros.page - 1)"
      >Anterior</button>
      <span class="text-sm font-medium text-ink-3">Página {{ filtros.page }}</span>
      <button
        class="px-5 py-2 bg-surface border border-border text-ink-2 font-medium rounded-lg text-sm hover:bg-surface-muted transition-colors disabled:opacity-40"
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
const eliminandoId   = ref(null)

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
      const [dg, dn] = await Promise.all([api.guiones.listar(params), api.nichos()])
      guiones.value      = dg.guiones
      totalGuiones.value = dg.total || dg.guiones.length
      nichos.value       = dn
    } else {
      const [dg, dn] = await Promise.all([api.generados.listar(params), api.nichos()])
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

async function confirmarEliminar(g) {
  const titulo = filtros.value.tipo === 'analizados'
    ? (g.tema_principal || 'este guion')
    : (g.titulo_sugerido || 'este guion')

  if (!confirm(`¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`)) return

  eliminandoId.value = g.id
  try {
    if (filtros.value.tipo === 'analizados') {
      await api.guiones.eliminar(g.id)
    } else {
      await api.generados.eliminar(g.id)
    }
    guiones.value = guiones.value.filter(x => x.id !== g.id)
    totalGuiones.value = Math.max(0, totalGuiones.value - 1)
  } catch (e) {
    console.error(e)
    alert('No se pudo eliminar: ' + e.message)
  } finally {
    eliminandoId.value = null
  }
}

function plataformaBadge(p) {
  const map = {
    tiktok: 'bg-red-950 text-red-400 border border-red-800',
    reels:  'bg-fuchsia-950 text-fuchsia-400 border border-fuchsia-800',
    shorts: 'bg-orange-950 text-orange-400 border border-orange-800',
  }
  return map[p] || 'bg-surface-muted text-ink-3 border border-border'
}

onMounted(cargarDatos)
</script>
