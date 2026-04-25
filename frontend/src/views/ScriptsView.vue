<template>
  <div class="flex flex-col gap-8">
    
    <!-- Encabezado -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold font-headline text-ink mb-1">Mis Guiones Generados</h1>
        <p class="text-sm text-ink-3">Biblioteca de contenido optimizado por IA</p>
      </div>
      <router-link to="/generate" class="btn-primary">
        <span class="material-symbols-outlined text-[18px]">add</span>
        Nuevo Guion
      </router-link>
    </header>

    <!-- Barra de Búsqueda y Filtros -->
    <div class="glass-panel p-4 flex flex-wrap items-center gap-4">
      <div class="flex-1 min-w-[280px] relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 text-[20px]">search</span>
        <input
          v-model="filtros.busqueda"
          type="text"
          placeholder="Buscar por título, gancho o nicho..."
          class="input-base pl-11 py-3 text-sm"
        />
        <div v-if="buscando" class="absolute right-3 top-1/2 -translate-y-1/2">
          <div class="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin"></div>
        </div>
      </div>
      
      <select v-model="filtros.platform" class="input-base py-3 w-auto min-w-[160px] bg-white/5">
        <option value="">Todas las plataformas</option>
        <option value="tiktok">TikTok</option>
        <option value="reels">Instagram Reels</option>
        <option value="shorts">YouTube Shorts</option>
      </select>

      <div class="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-border">
        <button
          v-for="v in ['grid', 'list']" :key="v"
          @click="vista = v"
          class="p-2 rounded-lg transition-all"
          :class="vista === v ? 'bg-accent text-canvas shadow-neon-accent' : 'text-ink-3 hover:text-ink'"
        >
          <span class="material-symbols-outlined text-[18px]">{{ v === 'grid' ? 'grid_view' : 'format_list_bulleted' }}</span>
        </button>
      </div>
    </div>

    <!-- Contenido -->
    <div v-if="cargando && !guiones.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="h-64 bg-white/5 rounded-3xl animate-pulse border border-border"></div>
    </div>

    <div v-else-if="guiones.length > 0" :class="vista === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'">
      <div
        v-for="s in guiones"
        :key="s.id"
        class="glass-panel group hover:border-accent/40 transition-all cursor-pointer overflow-hidden flex flex-col"
        @click="verDetalle(s.id)"
      >
        <!-- Card Header -->
        <div class="p-6 pb-4">
          <div class="flex items-start justify-between mb-3">
            <span :class="getPlatformBadge(s.plataforma)" class="platform-badge">{{ s.plataforma }}</span>
            <span class="text-[9px] font-bold text-ink-3 uppercase tracking-widest">{{ tiempoRelativo(s.fecha_generacion) }}</span>
          </div>
          <h3 class="text-base font-bold text-ink group-hover:text-accent transition-colors line-clamp-2 leading-tight mb-2">
            {{ s.titulo_sugerido || s.tema || 'Sin título' }}
          </h3>
          <p class="text-[10px] font-bold text-ink-3 uppercase tracking-tighter">{{ s.niche }}</p>
        </div>

        <!-- Script Preview -->
        <div class="px-6 py-4 bg-white/2 border-y border-white/5 flex-1">
          <p class="text-xs text-ink-2 italic line-clamp-3 leading-relaxed">
            {{ s.tema ? '"' + s.tema + '"' : 'Vista previa no disponible' }}
          </p>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-white/5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex flex-col">
              <span class="text-[9px] font-bold text-ink-3 uppercase leading-none">SCORE</span>
              <span class="text-sm font-black text-ink leading-none mt-1">{{ s.score_estimado || 0 }}%</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click.stop="copiarGuion(s)"
              class="p-2 rounded-lg hover:bg-white/10 text-ink-3 hover:text-ink transition-all"
              title="Copiar guion"
            >
              <span class="material-symbols-outlined text-[18px]">content_copy</span>
            </button>
            <button
              @click.stop="eliminar(s.id)"
              class="p-2 rounded-lg hover:bg-error/10 text-ink-3 hover:text-error transition-all"
              title="Eliminar guion"
            >
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
            <button
              @click.stop="verDetalle(s.id)"
              class="p-2 rounded-lg hover:bg-white/10 text-ink-3 hover:text-ink transition-all"
            >
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado Vacío -->
    <div v-else class="py-24 text-center flex flex-col items-center gap-4">
      <div class="w-16 h-16 rounded-3xl bg-white/5 border border-border flex items-center justify-center animate-float">
        <span class="material-symbols-outlined text-4xl text-ink-3">description</span>
      </div>
      <div>
        <p class="text-lg font-bold text-ink mb-1">Tu biblioteca está vacía</p>
        <p class="text-sm text-ink-3">Genera tu primer guion optimizado para viralizar.</p>
      </div>
      <router-link to="/generate" class="btn-primary mt-4">
        Empezar a Crear
      </router-link>
    </div>

    <!-- Paginación -->
    <div v-if="total > filtros.limit" class="flex items-center justify-center gap-4 mt-8">
      <button
        class="btn-secondary px-4 py-2"
        :disabled="filtros.page === 1"
        @click="filtros.page--; cargarDatos()"
      >Anterior</button>
      <span class="text-sm font-bold text-ink-3 uppercase tracking-widest tabular-nums">PÁGINA {{ filtros.page }}</span>
      <button
        class="btn-secondary px-4 py-2"
        :disabled="filtros.page * filtros.limit >= total"
        @click="filtros.page++; cargarDatos()"
      >Siguiente</button>
    </div>

    <!-- Toast -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-10 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
    >
      <div v-if="toastVisible" class="fixed bottom-8 right-8 z-50">
        <div class="px-6 py-3 rounded-2xl bg-success text-canvas font-bold text-sm shadow-2xl flex items-center gap-3">
          <span class="material-symbols-outlined">check_circle</span>
          Guion copiado al portapapeles
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../lib/api.js'
import { getPlatformBadge } from '../utils/badges.js'

const router = useRouter()
const guiones = ref([])
const total = ref(0)
const cargando = ref(true)
const buscando = ref(false)
const vista = ref('grid')
const toastVisible = ref(false)

const filtros = ref({
  page: 1,
  limit: 12,
  busqueda: '',
  platform: ''
})

async function cargarDatos() {
  if (filtros.value.busqueda) buscando.value = true
  else cargando.value = true
  
  try {
    const res = await api.generados.listar(filtros.value)
    guiones.value = res.generados
    total.value = res.total
  } catch (e) {
    console.error(e)
  } finally {
    cargando.value = false
    buscando.value = false
  }
}

function verDetalle(id) {
  router.push({ name: 'ScriptDetail', params: { id } })
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este guion? Esta acción no se puede deshacer.')) return
  try {
    await api.generados.eliminar(id)
    guiones.value = guiones.value.filter(g => g.id !== id)
    total.value--
  } catch (e) {
    console.error(e)
  }
}

function tiempoRelativo(f) {
  if (!f) return ''
  const diff = Date.now() - new Date(f).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}M`
  const horas = Math.floor(mins / 60)
  if (horas < 24) return `${horas}H`
  return `${Math.floor(horas / 24)}D`
}

function copiarGuion(s) {
  const text = [
    'TÍTULO: '    + (s.titulo_sugerido || s.tema || ''),
    'TEMA: '      + (s.tema || ''),
    'NICHO: '     + (s.niche || ''),
    'PLATAFORMA: '+ (s.plataforma || ''),
    'SCORE: '     + (s.score_estimado || 0) + '%',
  ].join('\n')
  navigator.clipboard.writeText(text)
  toastVisible.value = true
  setTimeout(() => toastVisible.value = false, 3000)
}

// Watchers con debounce para búsqueda
let debounceTimer = null
watch(() => filtros.value.busqueda, () => {
  buscando.value = true
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    filtros.value.page = 1
    cargarDatos()
  }, 350)
})

watch(() => filtros.value.platform, () => {
  filtros.value.page = 1
  cargarDatos()
})

onMounted(cargarDatos)
</script>
