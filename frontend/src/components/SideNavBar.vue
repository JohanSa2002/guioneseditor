<template>
  <aside
    class="fixed left-0 top-0 h-full z-40 flex flex-col w-60 border-r border-border font-body transition-transform duration-300 ease-out"
    style="background: rgba(12, 12, 16, 0.95); backdrop-filter: blur(20px);"
    :class="open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >

    <!-- Logo -->
    <div class="px-6 py-8">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center shrink-0 shadow-neon-accent group cursor-pointer overflow-hidden relative">
          <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          <span class="material-symbols-outlined text-canvas text-[22px] relative z-10" style="font-variation-settings:'FILL' 1;">psychology</span>
        </div>
        <div>
          <p class="text-lg font-black text-ink leading-none font-headline tracking-tight uppercase">Guiones<span class="text-accent italic">IA</span></p>
          <p class="text-[9px] font-bold text-ink-3 mt-1 tracking-[0.2em] uppercase opacity-60">Marketing Pro Max</p>
        </div>
      </div>
    </div>

    <!-- Navegación -->
    <nav class="flex-1 px-4 py-4 space-y-1.5" role="navigation" aria-label="Navegación principal">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="relative flex items-center gap-3 px-4 py-3 rounded-xl text-ink-3 hover:bg-white/5 hover:text-ink transition-all text-xs font-bold uppercase tracking-widest group"
        active-class="bg-white/5 !text-accent is-active"
        :exact="item.exact"
        @click="$emit('close')"
      >
        <!-- Glow Indicator -->
        <div class="active-indicator absolute left-0 w-1 h-6 bg-accent rounded-full opacity-0 -translate-x-2 transition-all"></div>
        
        <span class="material-symbols-outlined text-[20px] transition-all group-hover:scale-110 group-hover:text-accent">
          {{ item.icon }}
        </span>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- CTA Nuevo Análisis -->
    <div class="px-4 pb-8 mt-auto">
      <router-link
        to="/new-analysis"
        class="btn-primary w-full py-4 text-xs tracking-widest"
        @click="$emit('close')"
      >
        <span class="material-symbols-outlined text-[18px]">bolt</span>
        NUEVO ANÁLISIS
      </router-link>
    </div>
  </aside>
</template>

<script setup>
defineProps({ open: Boolean })
defineEmits(['close'])

const navItems = [
  { to: '/', label: 'Panel', icon: 'grid_view', exact: true },
  { to: '/analysis', label: 'Historial', icon: 'history', exact: false },
  { to: '/scripts', label: 'Librería', icon: 'bookmarks', exact: false },
  { to: '/generate', label: 'Creador', icon: 'auto_awesome', exact: false },
]
</script>

<style scoped>
.is-active .active-indicator {
  opacity: 1;
  transform: translateX(0);
  box-shadow: 0 0 15px var(--accent);
}
</style>
