<template>
  <aside
    class="fixed left-0 top-0 h-full z-40 flex flex-col w-60 bg-surface border-r border-border font-body
           transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
    :class="open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >

    <!-- Logo -->
    <div class="px-5 py-5 border-b border-border">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0 shadow-sm shadow-accent/30">
          <span class="material-symbols-outlined text-white text-[18px]" style="font-variation-settings:'FILL' 1;">psychology</span>
        </div>
        <div>
          <p class="text-[15px] font-semibold text-ink leading-none font-headline">Guiones IA</p>
          <p class="text-[10px] text-ink-3 mt-0.5">Marketing Pro</p>
        </div>
      </div>
    </div>

    <!-- Navegación -->
    <nav class="flex-1 px-3 py-4 space-y-0.5" role="navigation" aria-label="Navegación principal">
      <router-link
        to="/"
        class="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-ink-2 hover:bg-surface-muted hover:text-ink transition-all text-sm font-medium group"
        active-class="bg-accent-subtle !text-accent font-semibold is-active"
        exact
        @click="$emit('close')"
      >
        <span class="active-bar absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-full opacity-0 transition-opacity"></span>
        <span class="material-symbols-outlined text-[20px] transition-all group-hover:scale-110">dashboard</span>
        <span>Dashboard</span>
      </router-link>

      <router-link
        to="/analysis"
        class="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-ink-2 hover:bg-surface-muted hover:text-ink transition-all text-sm font-medium group"
        active-class="bg-accent-subtle !text-accent font-semibold is-active"
        @click="$emit('close')"
      >
        <span class="active-bar absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-full opacity-0 transition-opacity"></span>
        <span class="material-symbols-outlined text-[20px] transition-all group-hover:scale-110">analytics</span>
        <span>Análisis</span>
      </router-link>

      <router-link
        to="/scripts"
        class="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-ink-2 hover:bg-surface-muted hover:text-ink transition-all text-sm font-medium group"
        active-class="bg-accent-subtle !text-accent font-semibold is-active"
        @click="$emit('close')"
      >
        <span class="active-bar absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-full opacity-0 transition-opacity"></span>
        <span class="material-symbols-outlined text-[20px] transition-all group-hover:scale-110">description</span>
        <span>Guiones</span>
      </router-link>

      <router-link
        to="/generate"
        class="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-ink-2 hover:bg-surface-muted hover:text-ink transition-all text-sm font-medium group"
        active-class="bg-accent-subtle !text-accent font-semibold is-active"
        @click="$emit('close')"
      >
        <span class="active-bar absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-full opacity-0 transition-opacity"></span>
        <span class="material-symbols-outlined text-[20px] transition-all group-hover:scale-110">auto_fix_high</span>
        <span>Generar</span>
      </router-link>
    </nav>

    <!-- CTA Nuevo Análisis -->
    <div class="px-3 pb-5">
      <router-link
        to="/new-analysis"
        class="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-accent hover:bg-accent-hover
               text-white rounded-lg text-sm font-semibold transition-all shadow-sm
               active:scale-[0.97] hover:shadow-md hover:shadow-accent/20"
        @click="$emit('close')"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        Nuevo Análisis
      </router-link>
    </div>
  </aside>
</template>

<script setup>
defineProps({ open: Boolean })
defineEmits(['close'])
</script>

<style scoped>
.router-link-active.is-active .active-bar,
.router-link-exact-active.is-active .active-bar {
  opacity: 1;
}
</style>
