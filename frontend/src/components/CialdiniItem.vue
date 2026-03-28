<template>
  <div class="flex items-center gap-3 p-2.5 rounded-xl border transition-colors" :class="active ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-surface-container-lowest border-white/5'">
    <div class="w-4 h-4 rounded-full flex items-center justify-center shrink-0" :class="active ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-transparent'">
      <span v-if="active" class="material-symbols-outlined text-[12px] font-bold">check</span>
    </div>
    <span class="text-xs font-bold tracking-wide" :class="active ? 'text-white' : 'text-outline'">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  active: Boolean
})
</script>
