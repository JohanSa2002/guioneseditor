<template>
  <div class="max-w-7xl mx-auto flex flex-col gap-10">
    <!-- Encabezado -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
      <div>
        <h1 class="text-5xl font-extrabold font-headline tracking-tighter text-white mb-2 leading-tight">Panel Principal</h1>
        <p class="text-primary text-sm font-bold flex items-center gap-2 tracking-widest uppercase">
          <span class="material-symbols-outlined text-sm">terminal</span>
          Resumen del sistema y métricas de rendimiento
        </p>
      </div>
      <div class="flex items-center gap-4">
        <button class="px-6 py-3 bg-surface-container border border-white/5 text-outline font-bold rounded-xl text-sm hover:text-white transition-colors" @click="cargarDatos">Actualizar</button>
        <router-link to="/new-analysis" class="px-8 py-3 bg-gradient-to-br from-primary-container to-primary text-on-primary-container font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm h-12 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">add</span> Nuevo Análisis
        </router-link>
      </div>
    </header>

    <!-- KPI por Niche -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.niche" class="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl relative overflow-hidden group">
        <div class="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 blur-2xl rounded-full group-hover:bg-primary/10 transition-colors"></div>
        <p class="text-[10px] text-outline uppercase tracking-widest font-black mb-1">{{ stat.niche }}</p>
        <div class="flex items-end justify-between">
          <h2 class="text-3xl font-black font-headline text-white tracking-tighter">{{ stat.total_guiones }}</h2>
          <div class="text-right">
            <p class="text-[10px] text-primary font-bold uppercase tracking-tighter">Puntaje Prom.</p>
            <p class="text-lg font-black text-primary leading-none">{{ (stat.avg_score || 0).toFixed(1) }}</p>
          </div>
        </div>
        <div class="mt-4 w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
          <div class="bg-primary h-full transition-all duration-1000" :style="{ width: (stat.avg_score || 0) + '%' }"></div>
        </div>
      </div>

      <!-- Placeholder sin datos -->
      <div v-if="stats.length === 0" class="lg:col-span-4 bg-surface-container/50 border border-dashed border-white/5 p-8 rounded-3xl flex items-center justify-center italic text-outline text-sm">
        Conecta la base de datos para ver el rendimiento por niche.
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Tabla de Guiones -->
      <div class="lg:col-span-12 xl:col-span-8 bg-surface-container rounded-3xl border border-outline-variant/10 shadow-2xl overflow-hidden flex flex-col">
        <div class="px-8 py-6 border-b border-white/5 bg-surface-container-high/50 flex items-center justify-between">
          <h3 class="text-sm font-headline font-black text-white uppercase tracking-widest flex items-center gap-2">
            <span class="material-symbols-outlined text-outline text-lg">database</span> Guiones Analizados
          </h3>
          <div class="flex gap-2">
             <button class="px-4 py-2 bg-surface-container-low text-[10px] font-black uppercase text-outline rounded hover:text-white transition-colors" @click="cambiarPagina(filtros.page - 1)" :disabled="filtros.page <= 1">Anterior</button>
             <button class="px-4 py-2 bg-surface-container-low text-[10px] font-black uppercase text-outline rounded hover:text-white transition-colors" @click="cambiarPagina(filtros.page + 1)" :disabled="guiones.length < filtros.limit">Siguiente</button>
          </div>
        </div>

        <div class="overflow-x-auto flex-1 max-h-[600px] scrollbar-custom">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 bg-surface-container z-10 border-b border-white/5">
              <tr class="text-[10px] font-black text-outline uppercase tracking-widest bg-surface-container-high/30">
                <th class="px-8 py-4">Contexto</th>
                <th class="px-6 py-4">Puntaje Viral</th>
                <th class="px-6 py-4">Patrón Neurométrico</th>
                <th class="px-8 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="g in guiones" :key="g.id" class="group hover:bg-white/[0.02] transition-colors cursor-pointer" @click="verDetalle(g.id)">
                <td class="px-8 py-6">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex items-center gap-2">
                      <span :class="plataformaBadge(g.plataforma)" class="text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">{{ g.plataforma }}</span>
                      <span class="text-[10px] text-outline font-bold uppercase tracking-wider">{{ g.niche }}</span>
                    </div>
                    <p class="text-sm font-bold text-white leading-tight group-hover:text-primary transition-colors line-clamp-2 max-w-sm">{{ g.tema_principal || 'Sin título detectado' }}</p>
                    <p class="text-[10px] text-outline/60 italic font-medium truncate max-w-xs">{{ g.url_origen }}</p>
                  </div>
                </td>
                <td class="px-6 py-6 font-headline">
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between text-[11px] font-black tracking-tighter">
                      <span class="text-white">{{ g.score_virabilidad || 0 }}/100</span>
                      <span class="text-primary">{{ (g.score_engagement || 0).toFixed(1) }}% ENG</span>
                    </div>
                    <div class="w-32 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                      <div class="bg-gradient-to-r from-primary/50 to-primary h-full" :style="{ width: (g.score_virabilidad || 0) + '%' }"></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-6">
                  <div class="max-w-xs">
                    <p class="text-[11px] text-outline font-bold uppercase tracking-widest mb-1">{{ g.gancho_tipo || 'Gancho' }}</p>
                    <p class="text-xs text-on-surface-variant line-clamp-2 leading-relaxed italic">"{{ g.gancho_texto }}"</p>
                  </div>
                </td>
                <td class="px-8 py-6 text-right">
                  <button class="p-2.5 rounded-xl bg-surface-container-low border border-white/5 text-outline hover:text-white hover:border-primary/20 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                    <span class="material-symbols-outlined text-xl">open_in_new</span>
                  </button>
                </td>
              </tr>

              <tr v-if="guiones.length === 0 && !cargando">
                <td colspan="4" class="py-24 text-center">
                  <div class="flex flex-col items-center gap-2 opacity-30">
                    <span class="material-symbols-outlined text-5xl">inventory_2</span>
                    <p class="text-sm font-bold uppercase tracking-widest">Repositorio vacío</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Columna derecha: Mejor Guión -->
      <div class="lg:col-span-12 xl:col-span-4 flex flex-col gap-8">
        <div class="bg-surface-container p-8 rounded-[40px] border border-secondary/20 shadow-3xl relative overflow-hidden flex-1 flex flex-col gap-8 group">
          <div class="absolute -top-12 -right-12 w-48 h-48 bg-secondary/5 blur-3xl rounded-full group-hover:bg-secondary/10 transition-colors"></div>

          <div>
            <div class="flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-[0.2em] mb-3">
              <span class="material-symbols-outlined text-sm animate-pulse">new_releases</span> Selección del Editor
            </div>
            <h3 class="text-3xl font-headline font-black text-white tracking-widest leading-none mb-2">GUIÓN MAESTRO</h3>
            <p class="text-xs text-outline font-bold">Patrón de neuromarketing con mayor rendimiento</p>
          </div>

          <div v-if="guionTop" class="space-y-6 flex-1 flex flex-col">
            <div class="p-4 rounded-2xl bg-surface-container-low border border-white/5 flex flex-col gap-2">
               <p class="text-[10px] text-secondary font-bold uppercase tracking-widest">{{ guionTop.niche }} • {{ guionTop.sub_niche }}</p>
               <p class="text-lg font-black text-white leading-tight font-headline">{{ guionTop.tema_principal }}</p>
            </div>

            <div class="flex-1 space-y-4">
               <div>
                 <p class="text-[10px] text-outline font-black uppercase tracking-widest mb-2">Núcleo Narrativo</p>
                 <p class="text-sm text-on-surface-variant leading-relaxed line-clamp-4">{{ guionTop.resumen_patron }}</p>
               </div>
               <div class="grid grid-cols-2 gap-4">
                 <div class="p-3 rounded-xl bg-surface-container-low border border-white/5">
                    <p class="text-[10px] text-outline font-bold uppercase mb-1">Cialdini</p>
                    <p class="text-xl font-black text-white">{{ guionTop.score_cialdini }}/7</p>
                 </div>
                 <div class="p-3 rounded-xl bg-surface-container-low border border-white/5">
                    <p class="text-[10px] text-outline font-bold uppercase mb-1">Viralidad</p>
                    <p class="text-xl font-black text-white">{{ guionTop.score_virabilidad }}%</p>
                 </div>
               </div>
            </div>

            <button @click="verDetalle(guionTop.id)" class="w-full py-4 bg-white text-surface rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-white transition-all transform active:scale-95 shadow-xl shadow-white/5">Ver Análisis Completo</button>
          </div>

          <div v-else class="flex flex-col items-center justify-center flex-1 italic text-outline text-xs opacity-50">
            Aún no hay patrones analizados.
          </div>
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
    tiktok: 'bg-red-500/10 text-red-500 border border-red-500/20',
    reels: 'bg-fuchsia-500/10 text-fuchsia-500 border border-fuchsia-500/20',
    shorts: 'bg-red-600/10 text-red-600 border border-red-600/20'
  }
  return map[p] || 'bg-white/5 text-outline'
}

onMounted(() => {
  cargarDatos()
})
</script>
