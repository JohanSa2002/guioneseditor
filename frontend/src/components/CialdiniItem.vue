<template>
  <div
    class="flex items-center gap-2.5 p-2.5 rounded-lg border transition-colors"
    :class="active
      ? 'bg-accent-subtle border-accent-border'
      : 'bg-surface-muted border-border'"
  >
    <div
      class="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors"
      :class="active ? 'bg-accent text-white' : 'bg-border text-transparent'"
    >
      <span v-if="active" class="material-symbols-outlined text-[11px]" style="font-variation-settings:'FILL' 1;">check</span>
    </div>
    <span
      class="text-xs font-medium tracking-wide transition-colors"
      :class="active ? 'text-accent' : 'text-ink-3'"
    >{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  active: Boolean
})
</script>
