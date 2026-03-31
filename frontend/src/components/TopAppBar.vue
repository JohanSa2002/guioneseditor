<template>
  <header class="fixed top-0 right-0 left-60 h-16 flex items-center justify-between px-8 z-30 bg-surface border-b border-border">

    <!-- Búsqueda -->
    <div class="relative w-80">
      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 text-[18px]">search</span>
      <input
        class="w-full bg-canvas border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all"
        placeholder="Buscar guiones..."
        type="text"
      />
    </div>

    <!-- Acciones -->
    <div class="flex items-center gap-4">
      <button class="relative text-ink-3 hover:text-ink-2 transition-colors p-1.5 rounded-lg hover:bg-surface-muted">
        <span class="material-symbols-outlined text-[22px]">notifications</span>
        <span class="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full"></span>
      </button>

      <div class="flex items-center gap-3 pl-4 border-l border-border">
        <div class="w-8 h-8 rounded-full bg-accent-subtle border border-accent-border flex items-center justify-center">
          <span class="material-symbols-outlined text-accent text-[18px]" style="font-variation-settings:'FILL' 1;">account_circle</span>
        </div>
        <div class="text-right">
          <p class="text-xs font-semibold text-ink leading-none">Marketing Pro</p>
          <p class="text-[10px] text-ink-3 mt-0.5">Administrador</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
</script>
