<template>
  <div class="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
    <span class="text-[10px] font-bold text-outline uppercase tracking-wider">{{ label }}</span>
    
    <template v-if="type === 'boolean'">
      <span :class="value ? 'text-primary' : 'text-outline/40'" class="text-xs font-bold uppercase tracking-widest">
        {{ value ? 'YES' : 'NO' }}
      </span>
    </template>
    
    <template v-else>
      <span v-if="value" class="text-xs font-medium text-right max-w-[150px] truncate" :class="highlight ? 'text-white' : 'text-on-surface-variant'">
        {{ value }}
      </span>
      <span v-else class="text-gray-600 text-xs">—</span>
    </template>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number, Boolean],
  type: {
    type: String,
    default: 'text' // or 'boolean'
  },
  highlight: Boolean
})
</script>
