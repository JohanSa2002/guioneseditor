<template>
  <aside class="fixed left-0 top-0 h-full z-40 flex flex-col p-4 w-64 border-r border-white/5 bg-[#13131a] font-['Manrope'] antialiased shadow-2xl shadow-indigo-500/10">
    <!-- Branding -->
    <div class="flex items-center gap-3 mb-10 px-2">
      <div class="w-8 h-8 rounded bg-gradient-to-br from-primary-container to-primary flex items-center justify-center">
        <span class="material-symbols-outlined text-on-primary-container text-lg" style="font-variation-settings: 'FILL' 1;">psychology</span>
      </div>
      <div>
        <h1 class="text-xl font-bold tracking-tight text-white">Guiones IA</h1>
        <p class="text-[10px] uppercase tracking-widest text-primary/60 font-bold">Marketing Pro</p>
      </div>
    </div>

    <!-- Navegación -->
    <nav class="flex-1 space-y-1">
      <router-link to="/" class="flex items-center gap-3 px-3 py-2.5 text-[#c7c4d7] hover:text-white hover:bg-white/5 transition-all duration-200 group relative" active-class="bg-white/10 !text-white rounded-lg font-semibold">
        <span class="material-symbols-outlined text-[20px]">dashboard</span>
        <span class="text-sm font-medium">Dashboard</span>
      </router-link>
      <router-link to="/analysis" class="flex items-center gap-3 px-3 py-2.5 text-[#c7c4d7] hover:text-white hover:bg-white/5 transition-all duration-200 group relative" active-class="bg-white/10 !text-white rounded-lg font-semibold">
        <span class="material-symbols-outlined text-[20px]">analytics</span>
        <span class="text-sm font-medium">Análisis</span>
      </router-link>
      <router-link to="/scripts" class="flex items-center gap-3 px-3 py-2.5 text-[#c7c4d7] hover:text-white hover:bg-white/5 transition-all duration-200 group relative" active-class="bg-white/10 !text-white rounded-lg font-semibold">
        <span class="material-symbols-outlined text-[20px]">description</span>
        <span class="text-sm font-medium">Guiones</span>
      </router-link>
      <router-link to="/generate" class="flex items-center gap-3 px-3 py-2.5 text-[#c7c4d7] hover:text-white hover:bg-white/5 transition-all duration-200 group relative" active-class="bg-white/10 !text-white rounded-lg font-semibold">
        <span class="material-symbols-outlined text-[20px]">auto_fix_high</span>
        <span class="text-sm font-medium">Generar</span>
      </router-link>
    </nav>

    <!-- Acción principal -->
    <div class="mt-auto pt-6 border-t border-white/5">
      <router-link to="/new-analysis" class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-container text-on-primary-container rounded-lg font-bold text-sm shadow-lg shadow-primary/20 scale-95 active:scale-90 transition-transform hover:brightness-110">
        <span class="material-symbols-outlined text-sm">add</span>
        Nuevo Análisis
      </router-link>
    </div>
  </aside>
</template>

<script setup>
</script>
