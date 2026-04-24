<template>
  <div class="flex flex-col gap-6">
    
    <!-- Encabezado -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold font-headline text-ink">Historial de Análisis</h1>
        <p class="text-xs text-ink-3">Gestiona y revisa todos tus videos analizados</p>
      </div>
      <router-link to="/new-analysis" class="btn-primary">
        <span class="material-symbols-outlined text-[18px]">add</span>
        Nuevo Análisis
      </router-link>
    </header>

    <!-- Filtros -->
    <div class="glass-panel p-4 flex flex-wrap items-center gap-4">
      <div class="flex-1 min-w-[200px] relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 text-[18px]">search</span>
        <input
          v-model="filtros.busqueda"
          type="text"
          placeholder="Buscar por tema o URL..."
          class="input-base pl-10 py-2"
        />
      </div>
      
      <select v-model="filtros.status" class="input-base py-2 w-auto min-w-[140px] bg-surface-muted">
        <option value="todos">Todos los estados</option>
        <option value="ok">Procesados</option>
        <option value="error">Con Error</option>
      </select>

      <select v-model="filtros.niche" class="input-base py-2 w-auto min-w-[140px] bg-surface-muted">
        <option value="todos">Todos los nichos</option>
        <option v-for="n in nichos" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>

    <!-- Tabla -->
    <div class="glass-panel overflow-hidden">
      <div v-if="cargando" class="divide-y divide-border">
        <div v-for="i in 8" :key="i" class="px-6 py-4 animate-pulse flex items-center gap-4">
          <div class="w-10 h-10 bg-white/5 rounded-xl"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 w-48 bg-white/5 rounded"></div>
            <div class="h-3 w-32 bg-white/5 rounded"></div>
          </div>
          <div class="h-4 w-24 bg-white/5 rounded"></div>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table v-if="guiones.length > 0" class="w-full text-left border-collapse">
          <thead class="bg-white/5 border-b border-border">
            <tr>
              <th class="px-6 py-3 text-[10px] font-bold text-ink-3 uppercase tracking-widest">Video / Nicho</th>
              <th class="px-4 py-3 text-[10px] font-bold text-ink-3 uppercase tracking-widest text-center">Status</th>
              <th
                class="px-4 py-3 text-[10px] font-bold text-ink-3 uppercase tracking-widest cursor-pointer hover:text-ink transition-colors"
                @click="toggleSort('score_virabilidad')"
              >
                Puntajes
              </th>
              <th
                class="px-4 py-3 text-[10px] font-bold text-ink-3 uppercase tracking-widest cursor-pointer hover:text-ink transition-colors"
                @click="toggleSort('created_at')"
              >
                Fecha
              </th>
              <th class="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr
              v-for="g in guiones"
              :key="g.id"
              class="group hover:bg-white/5 transition-colors cursor-pointer"
              :class="!g.procesado_ok ? 'opacity-60' : ''"
              @click="g.procesado_ok && verDetalle(g.id)"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-white/5 border border-border flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-ink-3">{{ g.plataforma === 'tiktok' ? 'movie' : 'video_library' }}</span>
                  </div>
                  <div class="flex flex-col gap-0.5 min-w-0">
                    <div class="flex items-center gap-2">
                      <span :class="getPlatformBadge(g.plataforma)" class="platform-badge">{{ g.plataforma }}</span>
                      <span class="text-[10px] font-bold text-ink-3 uppercase">{{ g.niche }}</span>
                    </div>
                    <p class="text-sm font-bold text-ink leading-tight truncate group-hover:text-accent transition-colors">
                      {{ g.tema_principal || 'Procesando...' }}
                    </p>
                    <p class="text-[10px] text-ink-3 truncate italic">{{ g.url_origen }}</p>
                  </div>
                </div>
              </td>

              <td class="px-4 py-4 text-center">
                <div class="flex flex-col items-center gap-1">
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="g.procesado_ok ? 'bg-success shadow-[0_0_8px_rgba(0,255,157,0.4)]' : 'bg-error shadow-[0_0_8px_rgba(255,42,95,0.4)]'"
                  ></span>
                  <span class="text-[9px] font-bold uppercase tracking-tighter" :class="g.procesado_ok ? 'text-success' : 'text-error'">
                    {{ g.procesado_ok ? 'OK' : 'ERROR' }}
                  </span>
                </div>
              </td>

              <td class="px-4 py-4">
                <div v-if="g.procesado_ok" class="flex flex-col gap-1">
                  <div class="flex items-center justify-between text-[11px] font-bold">
                    <span :class="getScoreColor(g.score_virabilidad)">{{ g.score_virabilidad }}%</span>
                    <span class="text-ink-3">{{ (g.score_engagement || 0).toFixed(1) }}%</span>
                  </div>
                  <div class="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000" :class="getScoreBarColor(g.score_virabilidad)" :style="{ width: g.score_virabilidad + '%' }"></div>
                  </div>
                </div>
                <span v-else class="text-[10px] text-ink-3 italic">—</span>
              </td>

              <td class="px-4 py-4">
                <p class="text-xs text-ink-2 font-medium">{{ formatearFecha(g.fecha_analisis) }}</p>
                <p class="text-[10px] text-ink-3 uppercase tracking-widest mt-0.5">HACE {{ tiempoRelativo(g.fecha_analisis) }}</p>
              </td>

              <td class="px-6 py-4 text-right relative" @click.stop>
                <button
                  class="p-2 rounded-lg hover:bg-white/10 text-ink-3 hover:text-ink transition-all opacity-0 group-hover:opacity-100"
                  @click="menuAbiertoId = menuAbiertoId === g.id ? null : g.id"
                  data-menu
                >
                  <span class="material-symbols-outlined text-[20px]">more_vert</span>
                </button>

                <!-- Context Menu -->
                <div
                  v-if="menuAbiertoId === g.id"
                  class="absolute right-6 top-14 w-48 bg-surface-solid border border-border shadow-2xl rounded-xl z-50 overflow-hidden backdrop-blur-xl"
                  data-menu
                >
                  <button
                    @click="verDetalle(g.id)"
                    class="w-full text-left px-4 py-3 text-xs text-ink-2 hover:bg-accent/10 hover:text-accent transition-colors flex items-center gap-2"
                  >
                    <span class="material-symbols-outlined text-[18px]">visibility</span>
                    Ver Análisis
                  </button>
                  <button
                    class="w-full text-left px-4 py-3 text-xs text-ink-2 hover:bg-accent/10 hover:text-accent transition-colors flex items-center gap-2"
                  >
                    <span class="material-symbols-outlined text-[18px]">edit</span>
                    Editar Notas
                  </button>
                  <div class="border-t border-border"></div>
                  <button
                    @click="confirmarBorrado(g.id)"
                    class="w-full text-left px-4 py-3 text-xs text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                  >
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Estado vacío -->
        <div v-else class="py-20 text-center flex flex-col items-center gap-4">
          <div class="w-16 h-16 rounded-3xl bg-white/5 border border-border flex items-center justify-center animate-float">
            <span class="material-symbols-outlined text-4xl text-ink-3">inbox</span>
          </div>
          <div>
            <p class="text-base font-bold text-ink mb-1">No se encontraron análisis</p>
            <p class="text-xs text-ink-3">Prueba con otros filtros o realiza un nuevo análisis.</p>
          </div>
          <router-link to="/new-analysis" class="btn-primary mt-2">
            Nuevo Análisis
          </router-link>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="total > filtros.limit" class="flex items-center justify-between px-2">
      <p class="text-[11px] font-bold text-ink-3 uppercase tracking-widest">
        MOSTRANDO {{ guiones.length }} DE {{ total }} RESULTADOS
      </p>
      <div class="flex gap-2">
        <button
          class="btn-secondary py-1.5 px-4 text-xs"
          :disabled="filtros.page === 1"
          @click="filtros.page--; cargarDatos()"
        >Anterior</button>
        <div class="flex items-center gap-1">
          <button
            v-for="p in paginasVisibles"
            :key="p"
            @click="filtros.page = p; cargarDatos()"
            class="w-8 h-8 rounded-lg text-xs font-bold transition-all"
            :class="p === filtros.page ? 'bg-accent text-canvas' : 'bg-white/5 text-ink-3 hover:text-ink hover:bg-white/10'"
          >{{ p }}</button>
        </div>
        <button
          class="btn-secondary py-1.5 px-4 text-xs"
          :disabled="filtros.page * filtros.limit >= total"
          @click="filtros.page++; cargarDatos()"
        >Siguiente</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../lib/api.js'
import { getScoreColor, getScoreBarColor } from '../utils/scores.js'
import { getPlatformBadge } from '../utils/badges.js'

const router = useRouter()
const guiones = ref([])
const total   = ref(0)
const nichos  = ref([])
const cargando = ref(true)
const menuAbiertoId = ref(null)

const filtros = ref({
  page: 1,
  limit: 15,
  status: 'todos',
  niche: 'todos',
  busqueda: '',
  sortField: 'created_at',
  sortDir: 'desc'
})

const paginasVisibles = computed(() => {
  const totalPaginas = Math.ceil(total.value / filtros.value.limit)
  const p = []
  for (let i = 1; i <= Math.min(totalPaginas, 5); i++) p.push(i)
  return p
})

async function cargarDatos() {
  cargando.value = true
  try {
    const [res, nList] = await Promise.all([
      api.guiones.listarTodos(filtros.value),
      api.nichos()
    ])
    guiones.value = res.guiones
    total.value   = res.total
    nichos.value  = nList
  } catch (e) {
    console.error(e)
  } finally {
    cargando.value = false
  }
}

function toggleSort(field) {
  if (filtros.value.sortField === field) {
    filtros.value.sortDir = filtros.value.sortDir === 'desc' ? 'asc' : 'desc'
  } else {
    filtros.value.sortField = field
    filtros.value.sortDir   = 'desc'
  }
  cargarDatos()
}

function formatearFecha(f) {
  if (!f) return '—'
  return new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function tiempoRelativo(f) {
  if (!f) return ''
  const diff = Date.now() - new Date(f).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} MIN`
  const horas = Math.floor(mins / 60)
  if (horas < 24) return `${horas} H`
  return `${Math.floor(horas / 24)} D`
}

function verDetalle(id) {
  router.push({ name: 'AnalysisDetail', params: { id } })
}

function confirmarBorrado(id) {
  if (confirm('¿Estás seguro de eliminar este análisis? Esta acción no se puede deshacer.')) {
    // API delete call here
    menuAbiertoId.value = null
  }
}

// Cerrar menú al hacer clic fuera
function cerrarMenu(e) {
  if (!e.target.closest('[data-menu]')) {
    menuAbiertoId.value = null
  }
}

watch([() => filtros.value.status, () => filtros.value.niche], () => {
  filtros.value.page = 1
  cargarDatos()
})

// Debounce para búsqueda
let debounceTimer = null
watch(() => filtros.value.busqueda, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    filtros.value.page = 1
    cargarDatos()
  }, 400)
})

onMounted(() => {
  cargarDatos()
  document.addEventListener('click', cerrarMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', cerrarMenu)
})
</script>
