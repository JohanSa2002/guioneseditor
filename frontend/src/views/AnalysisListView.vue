<template>
  <div class="max-w-7xl mx-auto flex flex-col gap-10">
    <!-- Encabezado -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
      <div>
        <h1 class="text-5xl font-extrabold font-headline tracking-tighter text-white mb-2 leading-tight">Historial de Análisis</h1>
        <p class="text-primary text-sm font-bold flex items-center gap-2 tracking-widest uppercase">
          <span class="material-symbols-outlined text-sm">analytics</span>
          {{ totalOk }} exitosos · {{ totalFallidos }} fallidos
        </p>
      </div>
      <div class="flex items-center gap-4">
        <button class="px-6 py-3 bg-surface-container border border-white/5 text-outline font-bold rounded-xl text-sm hover:text-white transition-colors" @click="cargarDatos">Actualizar</button>
        <router-link to="/new-analysis" class="px-8 py-3 bg-gradient-to-br from-primary-container to-primary text-on-primary-container font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm h-12 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">add</span> Nuevo Análisis
        </router-link>
      </div>
    </header>

    <!-- Filtros rápidos -->
    <div class="flex flex-wrap gap-3 items-center">
      <button
        v-for="f in filtrosEstado"
        :key="f.valor"
        @click="filtroActivo = f.valor; filtros.page = 1; cargarDatos()"
        class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all"
        :class="filtroActivo === f.valor
          ? 'bg-primary/10 border-primary/30 text-primary'
          : 'bg-surface-container border-white/5 text-outline hover:text-white hover:border-white/10'"
      >
        {{ f.label }}
      </button>

      <div class="ml-auto flex items-center gap-3">
        <select v-model="filtros.niche" @change="filtros.page = 1; cargarDatos()" class="bg-surface-container border border-white/10 rounded-xl px-4 py-2 text-xs text-on-surface-variant focus:ring-2 focus:ring-primary/40 appearance-none">
          <option value="">Todos los nichos</option>
          <option v-for="n in nichos" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <!-- Tabla de historial -->
    <div class="bg-surface-container rounded-3xl border border-outline-variant/10 shadow-2xl overflow-hidden">
      <div class="px-8 py-5 border-b border-white/5 bg-surface-container-high/50 flex items-center justify-between">
        <h3 class="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
          <span class="material-symbols-outlined text-outline text-base">history</span> Registro completo
        </h3>
        <div class="flex gap-2">
          <button class="px-4 py-1.5 bg-surface-container-low text-[10px] font-black uppercase text-outline rounded-lg hover:text-white transition-colors disabled:opacity-30" :disabled="filtros.page <= 1" @click="cambiarPagina(filtros.page - 1)">Anterior</button>
          <span class="px-3 py-1.5 text-[10px] font-black text-outline">Pág. {{ filtros.page }}</span>
          <button class="px-4 py-1.5 bg-surface-container-low text-[10px] font-black uppercase text-outline rounded-lg hover:text-white transition-colors disabled:opacity-30" :disabled="guiones.length < filtros.limit" @click="cambiarPagina(filtros.page + 1)">Siguiente</button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="cargando" class="py-16 flex items-center justify-center gap-3">
        <div class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span class="text-outline text-sm animate-pulse">Cargando historial...</span>
      </div>

      <!-- Vacío -->
      <div v-else-if="guiones.length === 0" class="py-20 flex flex-col items-center justify-center gap-3 opacity-40">
        <span class="material-symbols-outlined text-5xl">manage_search</span>
        <p class="text-sm font-bold uppercase tracking-widest text-outline">Sin registros para este filtro</p>
      </div>

      <!-- Tabla -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-black text-outline uppercase tracking-widest bg-surface-container-high/30 border-b border-white/5">
              <th class="px-8 py-4">Estado</th>
              <th class="px-6 py-4">Fuente</th>
              <th class="px-6 py-4">Niche</th>
              <th class="px-6 py-4">Puntajes</th>
              <th class="px-6 py-4">Fecha</th>
              <th class="px-8 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="g in guiones"
              :key="g.id"
              class="group hover:bg-white/[0.02] transition-colors"
              :class="g.procesado_ok ? 'cursor-pointer' : 'opacity-60'"
              @click="g.procesado_ok && verDetalle(g.id)"
            >
              <!-- Estado -->
              <td class="px-8 py-5">
                <div class="flex items-center gap-2">
                  <span
                    class="w-2 h-2 rounded-full shrink-0"
                    :class="g.procesado_ok ? 'bg-secondary' : 'bg-red-500'"
                  ></span>
                  <span class="text-[10px] font-black uppercase tracking-widest" :class="g.procesado_ok ? 'text-secondary' : 'text-red-400'">
                    {{ g.procesado_ok ? 'Completado' : 'Fallido' }}
                  </span>
                </div>
                <p v-if="!g.procesado_ok && g.error_detalle" class="text-[9px] text-red-400/60 mt-1 max-w-[160px] truncate">{{ g.error_detalle }}</p>
              </td>

              <!-- Fuente -->
              <td class="px-6 py-5">
                <div class="flex flex-col gap-1">
                  <span :class="plataformaBadge(g.plataforma)" class="text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest w-fit">{{ g.plataforma || '—' }}</span>
                  <p class="text-xs font-bold text-white leading-tight line-clamp-1 max-w-[220px]">{{ g.tema_principal || g.url_origen }}</p>
                  <p class="text-[9px] text-outline/50 truncate max-w-[220px] font-medium">{{ g.url_origen }}</p>
                </div>
              </td>

              <!-- Niche -->
              <td class="px-6 py-5">
                <span class="text-xs font-black text-on-surface-variant uppercase tracking-wider">{{ g.niche || '—' }}</span>
                <p v-if="g.sub_niche" class="text-[9px] text-outline/60 mt-0.5">{{ g.sub_niche }}</p>
              </td>

              <!-- Puntajes -->
              <td class="px-6 py-5">
                <div v-if="g.procesado_ok" class="flex items-center gap-3 font-headline">
                  <div class="text-center">
                    <p class="text-[9px] text-outline font-black uppercase">Viral</p>
                    <p class="text-sm font-black text-white">{{ g.score_virabilidad || 0 }}</p>
                  </div>
                  <div class="text-center">
                    <p class="text-[9px] text-outline font-black uppercase">Cialdini</p>
                    <p class="text-sm font-black text-white">{{ g.score_cialdini || 0 }}/7</p>
                  </div>
                  <div class="text-center">
                    <p class="text-[9px] text-outline font-black uppercase">ENG</p>
                    <p class="text-sm font-black text-secondary">{{ (g.score_engagement || 0).toFixed(1) }}%</p>
                  </div>
                </div>
                <span v-else class="text-[10px] text-outline/40 italic">—</span>
              </td>

              <!-- Fecha -->
              <td class="px-6 py-5">
                <p class="text-xs font-bold text-on-surface-variant">{{ formatFecha(g.fecha_analisis) }}</p>
              </td>

              <!-- Acción -->
              <td class="px-8 py-5 text-right">
                <button
                  v-if="g.procesado_ok"
                  @click.stop="verDetalle(g.id)"
                  class="p-2 rounded-xl bg-surface-container-low border border-white/5 text-outline hover:text-white hover:border-primary/20 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                >
                  <span class="material-symbols-outlined text-base">open_in_new</span>
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
  { valor: 'todos',      label: 'Todos' },
  { valor: 'exitosos',   label: 'Exitosos' },
  { valor: 'fallidos',   label: 'Fallidos' },
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
    tiktok: 'bg-red-500/10 text-red-500 border border-red-500/20',
    reels:  'bg-fuchsia-500/10 text-fuchsia-500 border border-fuchsia-500/20',
    shorts: 'bg-red-600/10 text-red-600 border border-red-600/20',
  }
  return map[p] || 'bg-white/5 text-outline'
}

onMounted(cargarDatos)
</script>
