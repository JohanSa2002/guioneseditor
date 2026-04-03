<template>
  <header class="fixed top-0 right-0 left-0 md:left-60 h-16 flex items-center justify-between px-4 md:px-8 z-30
                 bg-surface/90 backdrop-blur-md border-b border-border">

    <!-- Hamburger (mobile only) -->
    <button
      class="flex md:hidden items-center justify-center w-8 h-8 rounded-lg text-ink-3 hover:text-ink hover:bg-surface-muted transition-all active:scale-95 mr-2"
      @click="$emit('toggle-sidebar')"
      aria-label="Abrir navegación"
    >
      <span class="material-symbols-outlined text-[22px]">menu</span>
    </button>

    <!-- Búsqueda -->
    <div class="relative w-72 hidden sm:block">
      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 text-[18px]">search</span>
      <input
        v-model="query"
        class="w-full bg-canvas border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-ink
               placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-accent/30
               focus:border-accent/40 transition-all"
        placeholder="Buscar guiones..."
        type="text"
        @keydown.enter="irABusqueda"
      />
    </div>

    <!-- Acciones -->
    <div class="flex items-center gap-4 ml-auto">
      <div class="flex items-center gap-3 pl-4 border-l border-border">
        <div class="w-8 h-8 rounded-full bg-accent-subtle border border-accent-border flex items-center justify-center">
          <span class="material-symbols-outlined text-accent text-[18px]" style="font-variation-settings:'FILL' 1;">account_circle</span>
        </div>
        <div class="text-right hidden sm:block">
          <p class="text-xs font-semibold text-ink leading-none">Marketing Pro</p>
          <p class="text-[10px] text-ink-3 mt-0.5">Administrador</p>
        </div>
        <button
          @click="handleLogout"
          title="Cerrar sesión"
          class="ml-1 text-ink-3 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-surface-muted active:scale-95"
          aria-label="Cerrar sesión"
        >
          <span class="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

defineEmits(['toggle-sidebar'])

const router = useRouter()
const auth   = useAuthStore()
const query  = ref('')

function handleLogout() {
  auth.logout()
  router.push('/login')
}

function irABusqueda() {
  if (!query.value.trim()) return
  router.push({ path: '/scripts', query: { q: query.value.trim() } })
  query.value = ''
}
</script>
