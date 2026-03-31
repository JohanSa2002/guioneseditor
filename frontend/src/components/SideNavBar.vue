<template>
  <aside class="fixed left-0 top-0 h-full z-40 flex flex-col w-60 bg-surface border-r border-border font-body">

    <!-- Logo -->
    <div class="px-5 py-5 border-b border-border">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-white text-[18px]" style="font-variation-settings:'FILL' 1;">psychology</span>
        </div>
        <div>
          <p class="text-[15px] font-semibold text-ink leading-none font-headline">Guiones IA</p>
          <p class="text-[10px] text-ink-3 mt-0.5">Marketing Pro</p>
        </div>
      </div>
    </div>

    <!-- Navegación -->
    <nav class="flex-1 px-3 py-4 space-y-0.5">
      <router-link
        to="/"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-ink-2 hover:bg-surface-muted hover:text-ink transition-all text-sm font-medium"
        active-class="bg-accent-subtle !text-accent font-semibold"
      >
        <span class="material-symbols-outlined text-[20px]">dashboard</span>
        <span>Dashboard</span>
      </router-link>

      <router-link
        to="/analysis"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-ink-2 hover:bg-surface-muted hover:text-ink transition-all text-sm font-medium"
        active-class="bg-accent-subtle !text-accent font-semibold"
      >
        <span class="material-symbols-outlined text-[20px]">analytics</span>
        <span>Análisis</span>
      </router-link>

      <router-link
        to="/scripts"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-ink-2 hover:bg-surface-muted hover:text-ink transition-all text-sm font-medium"
        active-class="bg-accent-subtle !text-accent font-semibold"
      >
        <span class="material-symbols-outlined text-[20px]">description</span>
        <span>Guiones</span>
      </router-link>

      <router-link
        to="/generate"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-ink-2 hover:bg-surface-muted hover:text-ink transition-all text-sm font-medium"
        active-class="bg-accent-subtle !text-accent font-semibold"
      >
        <span class="material-symbols-outlined text-[20px]">auto_fix_high</span>
        <span>Generar</span>
      </router-link>
    </nav>

    <!-- CTA Nuevo Análisis -->
    <div class="px-3 pb-5">
      <router-link
        to="/new-analysis"
        class="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        Nuevo Análisis
      </router-link>
    </div>
  </aside>
</template>

<script setup>
</script>
