<template>
  <div class="flex flex-col gap-8">

    <!-- Encabezado -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
      <div>
        <h1 class="text-3xl font-bold font-headline text-ink mb-1">Historial de Análisis</h1>
        <p class="text-sm text-ink-3">
          <span class="text-success font-medium">{{ totalOk }} exitosos</span>
          <span class="mx-1 text-border-strong">·</span>
          <span class="text-error font-medium">{{ totalFallidos }} fallidos</span>
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="px-4 py-2 bg-surface border border-border text-ink-2 font-medium rounded-lg text-sm
                 hover:bg-surface-muted transition-all active:scale-[0.97] flex items-center gap-2 disabled:opacity-40"
          :disabled="cargando"
          @click="cargarDatos"
        >
          <span class="material-symbols-outlined text-[16px]" :class="cargando ? 'animate-spin' : ''">refresh</span>
          Actualizar
        </button>
        <router-link
          to="/new-analysis"
          class="px-5 py-2 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg text-sm
                 flex items-center gap-2 transition-all shadow-sm active:scale-[0.97]"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Nuevo Análisis
        </router-link>
      </div>
    </header>

    <!-- Filtros -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
        <button
          v-for="f in filtrosEstado"
          :key="f.valor"
          @click="filtroActivo = f.valor; filtros.page = 1; cargarDatos()"
          class="px-3 py-1.5 rounded-md text-xs font-medium transition-all active:scale-[0.97]"
          :class="filtroActivo === f.valor
            ? 'bg-accent text-white shadow-sm'
            : 'text-ink-2 hover:bg-surface-muted'"
        >
          {{ f.label }}
        </button>
      </div>

      <div class="ml-auto">
        <select
          v-model="filtros.niche"
          @change="filtros.page = 1; cargarDatos()"
          class="bg-surface border border-border rounded-lg px-3 py-2 text-xs text-ink-2
                 focus:outline-none focus:ring-2 focus:ring-accent/30 appearance-none"
        >
          <option value="">Todos los nichos</option>
          <option v-for="n in nichos" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
      <!-- Header tabla -->
      <div class="px-6 py-4 border-b border-border flex items-center justify-between bg-surface/90 backdrop-blur-sm">
        <div class="flex items-center gap-3">
          <h2 class="text-sm font-semibold text-ink">Registro completo</h2>
          <span v-if="!cargando && totalGuiones > 0" class="text-[11px] text-ink-3 font-medium tabular-nums">
            {{ (filtros.page - 1) * filtros.limit + 1 }}–{{ Math.min(filtros.page * filtros.limit, totalGuiones) }} de {{ totalGuiones }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1.5 bg-canvas border border-border text-[11px] font-medium text-ink-2 rounded-md
                   hover:bg-surface-muted transition-all disabled:opacity-40 active:scale-[0.97]"
            :disabled="filtros.page <= 1 || cargando"
            @click="cambiarPagina(filtros.page - 1)"
          >Anterior</button>
          <span class="text-[11px] text-ink-3 font-medium px-2 tabular-nums">Pág. {{ filtros.page }}</span>
          <button
            class="px-3 py-1.5 bg-canvas border border-border text-[11px] font-medium text-ink-2 rounded-md
                   hover:bg-surface-muted transition-all disabled:opacity-40 active:scale-[0.97]"
            :disabled="guiones.length < filtros.limit || cargando"
            @click="cambiarPagina(filtros.page + 1)"
          >Siguiente</button>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="cargando" class="divide-y divide-border">
        <div v-for="i in 8" :key="i" class="px-6 py-4 animate-pulse flex items-center gap-6">
          <div class="w-20 space-y-1.5">
            <div class="h-3 w-3 rounded-full bg-surface-subtle"></div>
          </div>
          <div class="flex-1 space-y-2">
            <div class="h-4 w-14 bg-surface-subtle rounded"></div>
            <div class="h-3.5 w-40 bg-surface-subtle rounded"></div>
          </div>
          <div class="w-20 h-3 bg-surface-subtle rounded"></div>
          <div class="flex gap-4">
            <div class="space-y-1"><div class="h-3 w-8 bg-surface-subtle rounded"></div><div class="h-4 w-6 bg-surface-subtle rounded"></div></div>
            <div class="space-y-1"><div class="h-3 w-12 bg-surface-subtle rounded"></div><div class="h-4 w-8 bg-surface-subtle rounded"></div></div>
          </div>
        </div>
      </div>

      <!-- Vacío -->
      <div v-else-if="guiones.length === 0" class="py-24 flex flex-col items-center gap-4 text-center">
        <div class="w-14 h-14 rounded-2xl bg-surface-muted border border-border flex items-center justify-center">
          <span class="material-symbols-outlined text-3xl text-ink-3">manage_search</span>
        </div>
        <div>
          <p class="text-sm font-semibold text-ink mb-1">Sin registros para este filtro</p>
          <p class="text-xs text-ink-3">Prueba cambiando el filtro o el nicho seleccionado.</p>
        </div>
        <button
          @click="filtroActivo = 'todos'; filtros.niche = ''; filtros.page = 1; cargarDatos()"
          class="px-4 py-2 bg-surface border border-border text-ink-2 font-medium rounded-lg text-sm hover:bg-surface-muted transition-colors"
        >
          Limpiar filtros
        </button>
      </div>

      <!-- Tabla con datos -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="sticky top-0 bg-surface/90 backdrop-blur-sm border-b border-border z-10">
            <tr>
              <th class="px-6 py-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">Estado</th>
              <th class="px-4 py-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">Video / Fuente</th>
              <th class="px-4 py-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">Niche</th>
              <!-- Columna Viralidad: ordenable -->
              <th
                class="px-4 py-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider cursor-pointer hover:text-ink-2 select-none group"
                @click="toggleSort('score_virabilidad')"
              >
                <div class="flex items-center gap-1">
                  Puntajes
                  <span class="material-symbols-outlined text-[14px] transition-colors"
                    :class="sortField === 'score_virabilidad' ? 'text-accent' : 'text-border-strong group-hover:text-ink-3'">
                    {{ sortField === 'score_virabilidad' ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more' }}
                  </span>
                </div>
              </th>
              <!-- Columna Fecha: ordenable -->
              <th
                class="px-4 py-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider cursor-pointer hover:text-ink-2 select-none group"
                @click="toggleSort('fecha_analisis')"
              >
                <div class="flex items-center gap-1">
                  Fecha
                  <span class="material-symbols-outlined text-[14px] transition-colors"
                    :class="sortField === 'fecha_analisis' ? 'text-accent' : 'text-border-strong group-hover:text-ink-3'">
                    {{ sortField === 'fecha_analisis' ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more' }}
                  </span>
                </div>
              </th>
              <th class="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr
              v-for="g in guionesOrdenados"
              :key="g.id"
              class="group hover:bg-surface-muted/60 transition-colors"
              :class="g.procesado_ok ? 'cursor-pointer' : 'opacity-60'"
              @click="g.procesado_ok && verDetalle(g.id)"
            >
              <!-- Estado -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full shrink-0" :class="g.procesado_ok ? 'bg-success' : 'bg-error'"></span>
                  <span class="text-xs font-medium" :class="g.procesado_ok ? 'text-success' : 'text-error'">
                    {{ g.procesado_ok ? 'Completado' : 'Fallido' }}
                  </span>
                </div>
                <p
                  v-if="!g.procesado_ok && g.error_detalle"
                  class="text-[10px] text-error/70 mt-1 max-w-[180px] leading-snug"
                  :title="g.error_detalle"
                >{{ g.error_detalle.substring(0, 80) }}{{ g.error_detalle.length > 80 ? '…' : '' }}</p>
              </td>

              <!-- Fuente -->
              <td class="px-4 py-4">
                <div class="flex flex-col gap-1">
                  <span :class="plataformaBadge(g.plataforma)" class="platform-badge w-fit">{{ g.plataforma || '—' }}</span>
                  <p class="text-sm font-medium text-ink line-clamp-1 max-w-52">{{ g.tema_principal || g.url_origen }}</p>
                  <p class="text-[10px] text-ink-3 truncate max-w-52" :title="g.url_origen">{{ g.url_origen }}</p>
                </div>
              </td>

              <!-- Niche -->
              <td class="px-4 py-4">
                <p class="text-sm font-medium text-ink-2">{{ g.niche || '—' }}</p>
                <p v-if="g.sub_niche" class="text-[10px] text-ink-3 mt-0.5">{{ g.sub_niche }}</p>
              </td>

              <!-- Puntajes -->
              <td class="px-4 py-4">
                <div v-if="g.procesado_ok" class="flex items-center gap-4">
                  <div>
                    <p class="text-[10px] text-ink-3 font-medium">Viral</p>
                    <p class="text-sm font-bold tabular-nums" :class="scoreColor(g.score_virabilidad)">{{ g.score_virabilidad || 0 }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-ink-3 font-medium">Cialdini</p>
                    <p class="text-sm font-bold text-ink tabular-nums">{{ g.score_cialdini || 0 }}/7</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-ink-3 font-medium">Eng.</p>
                    <p class="text-sm font-bold text-success tabular-nums">{{ (g.score_engagement || 0).toFixed(1) }}%</p>
                  </div>
                </div>
                <span v-else class="text-[11px] text-ink-3">—</span>
              </td>

              <!-- Fecha -->
              <td class="px-4 py-4">
                <p class="text-xs text-ink-2">{{ formatFecha(g.fecha_analisis) }}</p>
              </td>

              <!-- Acción -->
              <td class="px-6 py-4 text-right" @click.stop>
                <div class="relative" v-if="g.procesado_ok">
                  <button
                    @click="menuAbierto = menuAbierto === g.id ? null : g.id"
                    class="p-1.5 rounded-lg text-ink-3 hover:text-ink hover:bg-surface-muted transition-all
                           opacity-0 group-hover:opacity-100 active:scale-95"
                    aria-label="Acciones"
                  >
                    <span class="material-symbols-outlined text-[18px]">more_horiz</span>
                  </button>
                  <div
                    v-if="menuAbierto === g.id"
                    class="absolute right-0 top-9 z-30 w-44 bg-surface-muted border border-border rounded-xl shadow-xl py-1 overflow-hidden"
                  >
                    <button
                      @click="verDetalle(g.id); menuAbierto = null"
                      class="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-ink-2 hover:bg-surface-subtle hover:text-ink transition-colors text-left"
                    >
                      <span class="material-symbols-outlined text-[16px]">open_in_new</span>
                      Ver análisis
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../lib/api.js'

const router  = useRouter()
const guiones = ref([])
const nichos  = ref([])
const cargando = ref(true)
const filtroActivo = ref('todos')
const menuAbierto  = ref(null)
const sortField    = ref('fecha_analisis')
const sortDir      = ref('desc')
const totalGuiones = ref(0)

const filtros = ref({ page: 1, limit: 20, niche: '' })

const filtrosEstado = [
  { valor: 'todos',    label: 'Todos' },
  { valor: 'exitosos', label: 'Exitosos' },
  { valor: 'fallidos', label: 'Fallidos' },
]

const totalOk       = ref(0)
const totalFallidos = ref(0)

const guionesOrdenados = computed(() => {
  const lista = [...guiones.value]
  lista.sort((a, b) => {
    const va = sortField.value === 'fecha_analisis'
      ? new Date(a[sortField.value] || 0).getTime()
      : (a[sortField.value] || 0)
    const vb = sortField.value === 'fecha_analisis'
      ? new Date(b[sortField.value] || 0).getTime()
      : (b[sortField.value] || 0)
    return sortDir.value === 'desc' ? vb - va : va - vb
  })
  return lista
})

function toggleSort(field) {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortField.value = field
    sortDir.value   = 'desc'
  }
}

async function cargarDatos() {
  cargando.value = true
  try {
    const params = { page: filtros.value.page, limit: filtros.value.limit }
    if (filtros.value.niche) params.niche = filtros.value.niche
    if (filtroActivo.value === 'exitosos') params.procesado_ok = true
    if (filtroActivo.value === 'fallidos') params.procesado_ok = false

    const [dg, dn, okReq, allReq] = await Promise.all([
      api.guiones.listarTodos(params),
      api.nichos(),
      api.guiones.listar({ limit: 1, ...(params.niche ? { niche: params.niche } : {}) }),
      api.guiones.listarTodos({ limit: 1, ...(params.niche ? { niche: params.niche } : {}) }),
    ])

    totalOk.value       = okReq.total || 0
    totalFallidos.value = (allReq.total || 0) - (okReq.total || 0)

    let lista = dg.guiones
    if (filtroActivo.value === 'exitosos') lista = lista.filter(g => g.procesado_ok)
    if (filtroActivo.value === 'fallidos') lista = lista.filter(g => !g.procesado_ok)

    guiones.value      = lista
    totalGuiones.value = dg.total || lista.length
    nichos.value       = dn
  } catch (e) {
    console.error(e)
  } finally {
    cargando.value = false
  }
}

function cambiarPagina(p) {
  if (p < 1) return
  filtros.value.page = p
  cargarDatos()
}

function verDetalle(id) {
  router.push({ name: 'AnalysisDetail', params: { id } })
}

function formatFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

function plataformaBadge(p) {
  const map = {
    tiktok: 'bg-red-950 text-red-400 border border-red-800',
    reels:  'bg-fuchsia-950 text-fuchsia-400 border border-fuchsia-800',
    shorts: 'bg-orange-950 text-orange-400 border border-orange-800',
  }
  return map[p] || 'bg-surface-muted text-ink-3 border border-border'
}

function scoreColor(score) {
  if (!score) return 'text-ink-3'
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-accent'
  if (score >= 40) return 'text-warn'
  return 'text-error'
}

function cerrarMenu(e) {
  if (!e.target.closest('[data-menu]')) menuAbierto.value = null
}

onMounted(() => {
  cargarDatos()
  document.addEventListener('click', cerrarMenu)
})
onUnmounted(() => document.removeEventListener('click', cerrarMenu))
</script>
