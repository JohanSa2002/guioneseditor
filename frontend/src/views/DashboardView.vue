<template>
  <div class="flex flex-col gap-8">
    <!-- DEBUG: Si ves esto, el componente montó -->
    <div class="hidden">Componente Dashboard Montado</div>

    <!-- Encabezado -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
      <div>
        <h1 class="text-3xl font-bold font-headline text-ink mb-1">Panel Principal</h1>
        <p class="text-sm text-ink-3">Resumen de métricas y guiones analizados</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="btn-secondary"
          :disabled="cargando"
          @click="cargarDatos"
        >
          <span class="material-symbols-outlined text-[18px]" :class="cargando ? 'animate-spin' : ''">refresh</span>
          Actualizar
        </button>
        <router-link
          to="/new-analysis"
          class="btn-primary"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Nuevo Análisis
        </router-link>
      </div>
    </header>

    <!-- KPI por Niche -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.niche"
        class="glass-card p-5"
      >
        <p class="text-[11px] font-bold text-ink-3 uppercase tracking-widest mb-3">{{ stat.niche }}</p>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold font-headline text-ink">{{ stat.total_guiones }}</span>
          <div class="text-right">
            <p class="text-[10px] text-ink-3 mb-0.5 font-semibold">SCORE PROM.</p>
            <p class="text-lg font-bold" :class="getScoreColor(stat.avg_score)">{{ (stat.avg_score || 0).toFixed(1) }}</p>
          </div>
        </div>
        <div class="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <div
            class="h-full transition-all duration-1000 rounded-full"
            :class="getScoreBarColor(stat.avg_score)"
            :style="{ width: (stat.avg_score || 0) + '%' }"
          ></div>
        </div>
      </div>

      <div
        v-if="!cargando && stats.length === 0"
        class="lg:col-span-4 glass-panel border-dashed p-8 flex items-center justify-center text-sm text-ink-3 italic"
      >
        Analiza videos para ver el rendimiento por nicho.
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

      <!-- Tabla de guiones -->
      <div class="xl:col-span-8 glass-panel overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-border flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h2 class="text-sm font-bold text-ink uppercase tracking-wider">Análisis Recientes</h2>
            <span v-if="!cargando && totalGuiones > 0" class="text-[11px] bg-white/5 px-2 py-0.5 rounded-full text-ink-3 font-bold tabular-nums">
              {{ (filtros.page - 1) * filtros.limit + 1 }}–{{ Math.min(filtros.page * filtros.limit, totalGuiones) }} de {{ totalGuiones }}
            </span>
          </div>
          <div class="flex gap-2">
            <button
              class="p-1.5 rounded-lg border border-border hover:bg-white/5 transition-all disabled:opacity-30"
              @click="cambiarPagina(filtros.page - 1)"
              :disabled="filtros.page <= 1 || cargando"
            >
              <span class="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              class="p-1.5 rounded-lg border border-border hover:bg-white/5 transition-all disabled:opacity-30"
              @click="cambiarPagina(filtros.page + 1)"
              :disabled="guiones.length < filtros.limit || cargando"
            >
              <span class="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        <div v-if="cargando" class="divide-y divide-border">
          <div v-for="i in 5" :key="i" class="px-6 py-4 animate-pulse flex items-center gap-4">
            <div class="flex-1 space-y-2">
              <div class="flex gap-2">
                <div class="h-4 w-12 bg-white/5 rounded-md"></div>
                <div class="h-4 w-16 bg-white/5 rounded"></div>
              </div>
              <div class="h-3.5 w-48 bg-white/5 rounded"></div>
            </div>
            <div class="space-y-1.5">
              <div class="h-3.5 w-16 bg-white/5 rounded"></div>
              <div class="h-1.5 w-24 bg-white/5 rounded-full"></div>
            </div>
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table v-if="guiones.length > 0" class="w-full text-left border-collapse">
            <thead class="bg-white/5 border-b border-border">
              <tr>
                <th class="px-6 py-3 text-[10px] font-bold text-ink-3 uppercase tracking-widest">Video</th>
                <th
                  class="px-4 py-3 text-[10px] font-bold text-ink-3 uppercase tracking-widest cursor-pointer hover:text-ink transition-colors"
                  @click="toggleSort('score_virabilidad')"
                >
                  Viralidad
                </th>
                <th class="px-4 py-3 text-[10px] font-bold text-ink-3 uppercase tracking-widest">Gancho</th>
                <th class="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="g in guionesOrdenados"
                :key="g.id"
                class="group hover:bg-white/5 transition-colors cursor-pointer"
                @click="verDetalle(g.id)"
              >
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <span :class="getPlatformBadge(g.plataforma)" class="platform-badge">{{ g.plataforma }}</span>
                      <span class="text-[10px] font-bold text-ink-3 uppercase">{{ g.niche }}</span>
                    </div>
                    <p class="text-sm font-bold text-ink leading-tight group-hover:text-accent transition-colors line-clamp-1">
                      {{ g.tema_principal || 'Sin título detectado' }}
                    </p>
                    <p class="text-[10px] text-ink-3 truncate max-w-xs">{{ g.url_origen }}</p>
                  </div>
                </td>

                <td class="px-4 py-4">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex items-center gap-2 text-[11px]">
                      <span class="font-bold tabular-nums" :class="getScoreColor(g.score_virabilidad)">{{ g.score_virabilidad || 0 }}%</span>
                      <span class="text-success-hover text-[10px] font-bold tabular-nums">{{ (g.score_engagement || 0).toFixed(1) }}% ENG</span>
                    </div>
                    <div class="w-24 bg-white/5 h-1 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="getScoreBarColor(g.score_virabilidad)"
                        :style="{ width: (g.score_virabilidad || 0) + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-4">
                  <div class="max-w-xs">
                    <p class="text-[10px] font-bold text-accent uppercase tracking-widest mb-0.5">{{ g.gancho_tipo || 'HOOK' }}</p>
                    <p class="text-xs text-ink-2 line-clamp-2 leading-relaxed italic">"{{ g.gancho_texto }}"</p>
                  </div>
                </td>

                <td class="px-6 py-4 text-right">
                  <span class="material-symbols-outlined text-ink-3 group-hover:text-accent transition-colors">arrow_forward</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-else class="py-20 text-center flex flex-col items-center gap-4">
            <div class="w-16 h-16 rounded-3xl bg-white/5 border border-border flex items-center justify-center animate-float">
              <span class="material-symbols-outlined text-4xl text-ink-3">rocket_launch</span>
            </div>
            <div>
              <p class="text-base font-bold text-ink mb-1">Tu biblioteca está vacía</p>
              <p class="text-xs text-ink-3">Analiza tu primer video viral para ver métricas aquí.</p>
            </div>
            <router-link to="/new-analysis" class="btn-primary mt-2">
              Analizar mi primer video
            </router-link>
          </div>
        </div>
      </div>

      <!-- Mejor Guión -->
      <div class="xl:col-span-4 flex flex-col gap-5">
        <div v-if="guionTop" class="glass-panel p-6 flex flex-col gap-5 relative overflow-hidden group">
          <!-- Decoración fondo -->
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-success/10 blur-[100px] rounded-full group-hover:bg-success/20 transition-all duration-700"></div>
          
          <div class="relative">
            <div class="flex items-center gap-1.5 text-success text-[11px] font-bold uppercase tracking-widest mb-2">
              <span class="material-symbols-outlined text-[16px]" style="font-variation-settings:'FILL' 1;">stars</span>
              TOP PERFORMANCE
            </div>
            <h2 class="text-xl font-bold font-headline text-ink leading-tight">{{ guionTop.tema_principal }}</h2>
          </div>

          <div class="relative space-y-4 flex-1">
            <div class="p-4 rounded-2xl bg-white/5 border border-border">
              <p class="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-2">NICHE</p>
              <p class="text-sm font-bold text-ink">{{ guionTop.niche }}</p>
            </div>

            <div>
              <p class="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-2">PATRÓN GANADOR</p>
              <p class="text-xs text-ink-2 leading-relaxed line-clamp-4 italic">"{{ guionTop.resumen_patron }}"</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 rounded-2xl bg-white/5 border border-border text-center">
                <p class="text-[9px] font-bold text-ink-3 uppercase tracking-widest mb-1">CIALDINI</p>
                <p class="text-xl font-black text-ink">{{ guionTop.score_cialdini }}<span class="text-xs text-ink-3 font-normal">/7</span></p>
              </div>
              <div class="p-3 rounded-2xl border text-center" :class="getScoreBadge(guionTop.score_virabilidad)">
                <p class="text-[9px] font-bold uppercase tracking-widest mb-1">VIRALIDAD</p>
                <p class="text-xl font-black">{{ guionTop.score_virabilidad }}%</p>
              </div>
            </div>
          </div>

          <button
            @click="verDetalle(guionTop.id)"
            class="btn-primary w-full mt-2"
          >
            Ver Análisis Completo
          </button>
        </div>
        
        <!-- Info Card -->
        <div v-if="stats && stats.length > 0" class="glass-panel p-6 border-accent-border/30 bg-accent-subtle/5">
          <h3 class="text-sm font-bold text-accent uppercase tracking-widest mb-3">CONSEJO IA</h3>
          <p class="text-xs text-ink-2 leading-relaxed">
            Tus videos del nicho <span class="text-accent font-bold">{{ stats[0]?.niche || 'actual' }}</span> están rindiendo un <span class="text-accent font-bold">{{ (stats[0]?.avg_score || 0).toFixed(1) }}%</span> mejor que el promedio. Replica estos patrones para escalar.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../lib/api.js'
import { getScoreColor, getScoreBarColor, getScoreBadge } from '../utils/scores.js'
import { getPlatformBadge } from '../utils/badges.js'

const router = useRouter()
const guiones = ref([])
const stats   = ref([])
const cargando = ref(true)
const totalGuiones = ref(0)
const sortField = ref('score_virabilidad')
const sortDir   = ref('desc')

const filtros = ref({ page: 1, limit: 10 })

const guionTop = computed(() => {
  if (guiones.value.length === 0) return null
  return [...guiones.value].sort((a, b) => (b.score_virabilidad || 0) - (a.score_virabilidad || 0))[0]
})

const guionesOrdenados = computed(() => {
  const lista = [...guiones.value]
  lista.sort((a, b) => {
    const va = a[sortField.value] || 0
    const vb = b[sortField.value] || 0
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
    const [dg, ds] = await Promise.all([
      api.guiones.listar(filtros.value),
      api.stats()
    ])
    guiones.value      = dg.guiones || []
    totalGuiones.value = dg.total || (dg.guiones?.length || 0)
    // Map backend fields (virabilidad_promedio) to frontend names (avg_score)
    stats.value        = (ds || []).map(s => ({
      ...s,
      avg_score: parseFloat(s.virabilidad_promedio || 0)
    }))
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

onMounted(cargarDatos)
</script>
