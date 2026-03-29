<template>
  <div class="max-w-7xl mx-auto flex flex-col gap-10">
    <!-- Encabezado -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
      <div>
        <h1 class="text-5xl font-extrabold font-headline tracking-tighter text-white mb-2 leading-tight">Biblioteca de Guiones</h1>
        <p class="text-primary text-sm font-bold flex items-center gap-2 tracking-widest uppercase">
          <span class="material-symbols-outlined text-sm">description</span>
          {{ totalGuiones }} guiones analizados en el repositorio
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

      <select v-model="filtros.orden" class="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/40 appearance-none min-w-[180px]">
        <option value="fecha_desc">Más recientes</option>
        <option value="viralidad_desc">Mayor viralidad</option>
        <option value="engagement_desc">Mayor engagement</option>
        <option value="cialdini_desc">Mayor score Cialdini</option>
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
        @click="verDetalle(g.id)"
        class="bg-surface-container rounded-3xl border border-outline-variant/10 shadow-xl p-6 flex flex-col gap-4 cursor-pointer hover:border-primary/20 hover:shadow-primary/10 transition-all group relative overflow-hidden"
      >
        <div class="absolute -bottom-8 -right-8 w-28 h-28 bg-primary/5 blur-2xl rounded-full group-hover:bg-primary/10 transition-colors"></div>

        <!-- Badges -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span :class="plataformaBadge(g.plataforma)" class="text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest">{{ g.plataforma }}</span>
            <span class="text-[10px] font-black text-outline uppercase tracking-wider">{{ g.niche }}</span>
          </div>
          <div class="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low rounded-full border border-white/5">
            <span class="material-symbols-outlined text-sm text-primary" style="font-variation-settings: 'FILL' 1;">bolt</span>
            <span class="text-[11px] font-black text-white">{{ g.score_virabilidad || 0 }}</span>
          </div>
        </div>

        <!-- Tema -->
        <div>
          <p class="text-sm font-bold text-white leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {{ g.tema_principal || 'Sin título detectado' }}
          </p>
          <p class="text-[10px] text-outline/60 italic truncate">{{ g.url_origen }}</p>
        </div>

        <!-- Gancho -->
        <div class="flex-1">
          <p class="text-[10px] text-outline font-black uppercase tracking-widest mb-1">Gancho</p>
          <p class="text-xs text-on-surface-variant leading-relaxed italic line-clamp-3">"{{ g.gancho_texto || '—' }}"</p>
        </div>

        <!-- Métricas -->
        <div class="flex items-center justify-between pt-4 border-t border-white/5">
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
      </div>
    </div>

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
const guiones  = ref([])
const nichos   = ref([])
const cargando = ref(true)
const totalGuiones = ref(0)

const filtros = ref({
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
    lista = lista.filter(g =>
      (g.tema_principal || '').toLowerCase().includes(q) ||
      (g.gancho_texto || '').toLowerCase().includes(q) ||
      (g.resumen_patron || '').toLowerCase().includes(q)
    )
  }

  switch (filtros.value.orden) {
    case 'viralidad_desc':   lista.sort((a, b) => (b.score_virabilidad || 0) - (a.score_virabilidad || 0)); break
    case 'engagement_desc':  lista.sort((a, b) => (b.score_engagement || 0) - (a.score_engagement || 0)); break
    case 'cialdini_desc':    lista.sort((a, b) => (b.score_cialdini || 0) - (a.score_cialdini || 0)); break
  }

  return lista
})

async function cargarDatos() {
  cargando.value = true
  try {
    const params = { page: filtros.value.page, limit: filtros.value.limit }
    if (filtros.value.niche)      params.niche     = filtros.value.niche
    if (filtros.value.plataforma) params.plataforma = filtros.value.plataforma

    const [dg, dn] = await Promise.all([
      api.guiones.listar(params),
      api.nichos(),
    ])
    guiones.value     = dg.guiones
    totalGuiones.value = dg.total || dg.guiones.length
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

watch([() => filtros.value.niche, () => filtros.value.plataforma], () => {
  filtros.value.page = 1
  cargarDatos()
})

function verDetalle(id) {
  router.push({ name: 'AnalysisDetail', params: { id } })
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
