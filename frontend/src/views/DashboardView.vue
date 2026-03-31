<template>
  <div class="flex flex-col gap-8">

    <!-- Encabezado -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
      <div>
        <h1 class="text-3xl font-bold font-headline text-ink mb-1">Panel Principal</h1>
        <p class="text-sm text-ink-3">Resumen de métricas y guiones analizados</p>
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

    <!-- KPI por Niche -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.niche"
        class="bg-surface rounded-xl border border-border p-5 shadow-sm"
      >
        <p class="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-3">{{ stat.niche }}</p>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold font-headline text-ink">{{ stat.total_guiones }}</span>
          <div class="text-right">
            <p class="text-[10px] text-ink-3 mb-0.5">Puntaje prom.</p>
            <p class="text-lg font-bold text-accent">{{ (stat.avg_score || 0).toFixed(1) }}</p>
          </div>
        </div>
        <div class="mt-3 w-full bg-surface-subtle h-1 rounded-full overflow-hidden">
          <div
            class="bg-accent h-full transition-all duration-700 rounded-full"
            :style="{ width: (stat.avg_score || 0) + '%' }"
          ></div>
        </div>
      </div>

      <div
        v-if="stats.length === 0"
        class="lg:col-span-4 bg-surface border border-dashed border-border rounded-xl p-8 flex items-center justify-center text-sm text-ink-3 italic"
      >
        Conecta la base de datos para ver el rendimiento por niche.
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

      <!-- Tabla de guiones -->
      <div class="xl:col-span-8 bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 class="text-sm font-semibold text-ink">Guiones Analizados</h2>
          <div class="flex gap-2">
            <button
              class="px-3 py-1.5 bg-canvas border border-border text-[11px] font-medium text-ink-2 rounded-md hover:bg-surface-muted transition-colors disabled:opacity-40"
              @click="cambiarPagina(filtros.page - 1)"
              :disabled="filtros.page <= 1"
            >Anterior</button>
            <button
              class="px-3 py-1.5 bg-canvas border border-border text-[11px] font-medium text-ink-2 rounded-md hover:bg-surface-muted transition-colors disabled:opacity-40"
              @click="cambiarPagina(filtros.page + 1)"
              :disabled="guiones.length < filtros.limit"
            >Siguiente</button>
          </div>
        </div>

        <div class="overflow-x-auto max-h-[520px]">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 bg-surface-muted z-10">
              <tr class="border-b border-border">
                <th class="px-6 py-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">Video</th>
                <th class="px-4 py-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">Viralidad</th>
                <th class="px-4 py-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">Gancho</th>
                <th class="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="g in guiones"
                :key="g.id"
                class="group hover:bg-surface-muted/60 transition-colors cursor-pointer"
                @click="verDetalle(g.id)"
              >
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <span :class="plataformaBadge(g.plataforma)" class="platform-badge">{{ g.plataforma }}</span>
                      <span class="text-[11px] font-medium text-ink-3 uppercase tracking-wide">{{ g.niche }}</span>
                    </div>
                    <p class="text-sm font-medium text-ink leading-tight group-hover:text-accent transition-colors line-clamp-1 max-w-xs">
                      {{ g.tema_principal || 'Sin título detectado' }}
                    </p>
                    <p class="text-[10px] text-ink-3 truncate max-w-xs">{{ g.url_origen }}</p>
                  </div>
                </td>

                <td class="px-4 py-4">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex items-center gap-2 text-[11px]">
                      <span class="font-bold text-ink">{{ g.score_virabilidad || 0 }}/100</span>
                      <span class="text-success text-[10px]">{{ (g.score_engagement || 0).toFixed(1) }}%</span>
                    </div>
                    <div class="w-24 bg-surface-subtle h-1 rounded-full overflow-hidden">
                      <div
                        class="bg-accent h-full rounded-full"
                        :style="{ width: (g.score_virabilidad || 0) + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-4">
                  <div class="max-w-56">
                    <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-0.5">{{ g.gancho_tipo || 'Gancho' }}</p>
                    <p class="text-xs text-ink-2 line-clamp-2 leading-relaxed italic">"{{ g.gancho_texto }}"</p>
                  </div>
                </td>

                <td class="px-6 py-4 text-right">
                  <button class="p-1.5 rounded-lg text-ink-3 hover:text-accent hover:bg-accent-subtle transition-all opacity-0 group-hover:opacity-100">
                    <span class="material-symbols-outlined text-[18px]">open_in_new</span>
                  </button>
                </td>
              </tr>

              <tr v-if="guiones.length === 0 && !cargando">
                <td colspan="4" class="py-20 text-center">
                  <div class="flex flex-col items-center gap-2 text-ink-3">
                    <span class="material-symbols-outlined text-4xl">inbox</span>
                    <p class="text-sm font-medium">Sin guiones analizados</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mejor Guión -->
      <div class="xl:col-span-4 bg-surface rounded-xl border border-border shadow-sm p-6 flex flex-col gap-5">
        <div>
          <div class="flex items-center gap-1.5 text-success text-[11px] font-semibold uppercase tracking-wider mb-2">
            <span class="material-symbols-outlined text-sm">star</span>
            Mejor Rendimiento
          </div>
          <h2 class="text-lg font-bold font-headline text-ink">Guión Destacado</h2>
          <p class="text-xs text-ink-3 mt-0.5">Mayor puntaje de viralidad en tu biblioteca</p>
        </div>

        <div v-if="guionTop" class="flex flex-col gap-4 flex-1">
          <div class="p-4 rounded-lg bg-surface-muted border border-border">
            <p class="text-[10px] font-semibold text-success uppercase tracking-wider mb-1">
              {{ guionTop.niche }}{{ guionTop.sub_niche ? ` · ${guionTop.sub_niche}` : '' }}
            </p>
            <p class="text-sm font-semibold text-ink leading-snug">{{ guionTop.tema_principal }}</p>
          </div>

          <div>
            <p class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-1.5">Patrón narrativo</p>
            <p class="text-xs text-ink-2 leading-relaxed line-clamp-4">{{ guionTop.resumen_patron }}</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 rounded-lg bg-surface-muted border border-border text-center">
              <p class="text-[10px] text-ink-3 font-medium mb-1">Cialdini</p>
              <p class="text-xl font-bold text-ink">{{ guionTop.score_cialdini }}<span class="text-xs text-ink-3">/7</span></p>
            </div>
            <div class="p-3 rounded-lg bg-accent-subtle border border-accent-border text-center">
              <p class="text-[10px] text-accent font-medium mb-1">Viralidad</p>
              <p class="text-xl font-bold text-accent">{{ guionTop.score_virabilidad }}<span class="text-xs">%</span></p>
            </div>
          </div>

          <button
            @click="verDetalle(guionTop.id)"
            class="w-full py-2.5 bg-ink hover:bg-ink-2 text-surface rounded-lg font-semibold text-sm transition-colors mt-auto"
          >
            Ver análisis completo
          </button>
        </div>

        <div v-else class="flex flex-col items-center justify-center flex-1 py-8 text-ink-3 text-sm italic">
          Aún no hay guiones analizados.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../lib/api.js'

const router = useRouter()
const guiones = ref([])
const stats   = ref([])
const cargando = ref(true)

const filtros = ref({
  page: 1,
  limit: 20
})

const guionTop = computed(() => {
  if (guiones.value.length === 0) return null
  return [...guiones.value].sort((a,b) => (b.score_virabilidad || 0) - (a.score_virabilidad || 0))[0]
})

async function cargarDatos() {
  cargando.value = true
  try {
    const [dg, ds] = await Promise.all([
      api.guiones.listar(filtros.value),
      api.stats()
    ])
    guiones.value = dg.guiones
    stats.value   = ds
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

function plataformaBadge(p) {
  const map = {
    tiktok: 'bg-red-950 text-red-400 border border-red-800',
    reels:  'bg-fuchsia-950 text-fuchsia-400 border border-fuchsia-800',
    shorts: 'bg-orange-950 text-orange-400 border border-orange-800',
  }
  return map[p] || 'bg-surface-muted text-ink-3 border border-border'
}

onMounted(() => {
  cargarDatos()
})
</script>
