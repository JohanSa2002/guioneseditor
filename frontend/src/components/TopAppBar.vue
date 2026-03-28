<template>
  <header class="fixed top-0 right-0 left-64 h-16 flex items-center justify-between px-8 z-30 bg-[#13131a]/80 backdrop-blur-xl font-['Manrope'] text-sm">
    <div class="relative w-96 group">
      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">search</span>
      <input class="w-full bg-surface-container-lowest border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline/50 transition-all font-medium" placeholder="Search analyzed scripts..." type="text"/>
    </div>
    <div class="flex items-center gap-6">
      <button class="relative text-[#c7c4d7] hover:text-white transition-opacity">
        <span class="material-symbols-outlined">notifications</span>
        <span class="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full border-2 border-[#13131a]"></span>
      </button>
      <div class="flex items-center gap-3 pl-6 border-l border-white/5">
        <div class="text-right">
          <p class="text-xs font-bold text-white leading-none">Alex Rivera</p>
          <p class="text-[10px] text-outline font-medium">Growth Lead</p>
        </div>
        <div class="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest flex items-center justify-center">
          <span class="material-symbols-outlined text-outline">account_circle</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
</script>
