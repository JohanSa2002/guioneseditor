<template>
  <div class="flex items-center justify-between py-2 border-b border-border last:border-0">
    <span class="text-[10px] font-semibold text-ink-3 uppercase tracking-wider">{{ label }}</span>

    <template v-if="type === 'boolean'">
      <span
        class="text-xs font-semibold uppercase tracking-wider"
        :class="value ? 'text-success' : 'text-ink-3'"
      >{{ value ? 'Sí' : 'No' }}</span>
    </template>

    <template v-else>
      <span
        v-if="value"
        class="text-xs font-medium text-right max-w-[160px] truncate"
        :class="highlight ? 'text-ink font-semibold' : 'text-ink-2'"
      >{{ value }}</span>
      <span v-else class="text-xs text-ink-3">—</span>
    </template>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number, Boolean],
  type: {
    type: String,
    default: 'text'
  },
  highlight: Boolean
})
</script>
