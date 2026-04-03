<template>
  <Teleport to="body">
    <div class="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none" aria-live="polite">
      <TransitionGroup
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-2 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-1 scale-95"
      >
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3
                 bg-surface-muted border border-border rounded-xl shadow-2xl shadow-black/40
                 min-w-[260px] max-w-[360px]"
        >
          <span
            class="material-symbols-outlined text-[18px] shrink-0"
            :class="{
              'text-success': t.type === 'success',
              'text-error':   t.type === 'error',
              'text-accent':  t.type === 'info',
              'text-warn':    t.type === 'warn',
              'text-ink-2':   t.type === 'default',
            }"
            style="font-variation-settings:'FILL' 1;"
          >
            {{ iconForType(t.type) }}
          </span>
          <p class="text-sm text-ink font-medium leading-snug">{{ t.message }}</p>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '../composables/useToast.js'

const { toasts } = useToast()

function iconForType(type) {
  const map = {
    success: 'check_circle',
    error:   'error',
    info:    'info',
    warn:    'warning',
    default: 'notifications',
  }
  return map[type] ?? map.default
}
</script>
