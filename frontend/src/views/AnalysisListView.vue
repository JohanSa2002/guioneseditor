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
      <div class="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
        <button
          v-for="f in filtrosEstado"
          :key="f.valor"
          @click="filtroActivo = f.valor; filtros.page = 1; cargarDatos()"
          class="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
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
          class="bg-surface border border-border rounded-lg px-3 py-2 text-xs text-ink-2 focus:outline-none focus:ring-2 focus:ring-accent/30 appearance-none"
        >
          <option value="">Todos los nichos</option>
          <option v-for="n in nichos" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 class="text-sm font-semibold text-ink">Registro completo</h2>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1.5 bg-canvas border border-border text-[11px] font-medium text-ink-2 rounded-md hover:bg-surface-muted transition-colors disabled:opacity-40"
            :disabled="filtros.page <= 1"
            @click="cambiarPagina(filtros.page - 1)"
          >Anterior</button>
          <span class="text-[11px] text-ink-3 font-medium px-2">Pág. {{ filtros.page }}</span>
          <button
            class="px-3 py-1.5 bg-canvas border border-border text-[11px] font-medium text-ink-2 rounded-md hover:bg-surface-muted transition-colors disabled:opacity-40"
            :disabled="guiones.length < filtros.limit"
            @click="cambiarPagina(filtros.page + 1)"
          >Siguiente</button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="cargando" class="py-16 flex items-center justify-center gap-3">
        <div class="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        <span class="text-sm text-ink-3">Cargando historial…</span>
      </div>

      <!-- Vacío -->
      <div v-else-if="guiones.length === 0" class="py-20 flex flex-col items-center gap-3 text-ink-3">
        <span class="material-symbols-outlined text-4xl">manage_search</span>
        <p class="text-sm font-medium">Sin registros para este filtro</p>
      </div>

      <!-- Tabla con datos -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-border bg-surface-muted/60">
              <th class="px-6 py-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">Estado</th>
              <th class="px-4 py-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">Video / Fuente</th>
              <th class="px-4 py-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">Niche</th>
              <th class="px-4 py-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">Puntajes</th>
              <th class="px-4 py-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">Fecha</th>
              <th class="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr
              v-for="g in guiones"
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
                <p v-if="!g.procesado_ok && g.error_detalle" class="text-[10px] text-error/70 mt-0.5 max-w-[140px] truncate">{{ g.error_detalle }}</p>
              </td>

              <!-- Fuente -->
              <td class="px-4 py-4">
                <div class="flex flex-col gap-1">
                  <span :class="plataformaBadge(g.plataforma)" class="platform-badge w-fit">{{ g.plataforma || '—' }}</span>
                  <p class="text-sm font-medium text-ink line-clamp-1 max-w-52">{{ g.tema_principal || g.url_origen }}</p>
                  <p class="text-[10px] text-ink-3 truncate max-w-52">{{ g.url_origen }}</p>
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
                    <p class="text-sm font-bold text-ink">{{ g.score_virabilidad || 0 }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-ink-3 font-medium">Cialdini</p>
                    <p class="text-sm font-bold text-ink">{{ g.score_cialdini || 0 }}/7</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-ink-3 font-medium">Eng.</p>
                    <p class="text-sm font-bold text-success">{{ (g.score_engagement || 0).toFixed(1) }}%</p>
                  </div>
                </div>
                <span v-else class="text-[11px] text-ink-3">—</span>
              </td>

              <!-- Fecha -->
              <td class="px-4 py-4">
                <p class="text-xs text-ink-2">{{ formatFecha(g.fecha_analisis) }}</p>
              </td>

              <!-- Acción -->
              <td class="px-6 py-4 text-right">
                <button
                  v-if="g.procesado_ok"
                  @click.stop="verDetalle(g.id)"
                  class="p-1.5 rounded-lg text-ink-3 hover:text-accent hover:bg-accent-subtle transition-all opacity-0 group-hover:opacity-100"
                >
                  <span class="material-symbols-outlined text-[18px]">open_in_new</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../lib/api.js'

const router  = useRouter()
const guiones = ref([])
const nichos  = ref([])
const cargando = ref(true)
const filtroActivo = ref('todos')

const filtros = ref({ page: 1, limit: 20, niche: '' })

const filtrosEstado = [
  { valor: 'todos',    label: 'Todos' },
  { valor: 'exitosos', label: 'Exitosos' },
  { valor: 'fallidos', label: 'Fallidos' },
]

const totalOk       = computed(() => guiones.value.filter(g => g.procesado_ok).length)
const totalFallidos = computed(() => guiones.value.filter(g => !g.procesado_ok).length)

async function cargarDatos() {
  cargando.value = true
  try {
    const params = { page: filtros.value.page, limit: filtros.value.limit }
    if (filtros.value.niche) params.niche = filtros.value.niche

    const [dg, dn] = await Promise.all([
      api.guiones.listarTodos(params),
      api.nichos(),
    ])

    let lista = dg.guiones
    if (filtroActivo.value === 'exitosos') lista = lista.filter(g => g.procesado_ok)
    if (filtroActivo.value === 'fallidos') lista = lista.filter(g => !g.procesado_ok)

    guiones.value = lista
    nichos.value  = dn
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

onMounted(cargarDatos)
</script>
