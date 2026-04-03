import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

export function useToast() {
  function add(message, { type = 'default', duration = 3500 } = {}) {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  return {
    toasts,
    success: (msg) => add(msg, { type: 'success' }),
    error:   (msg) => add(msg, { type: 'error', duration: 5000 }),
    info:    (msg) => add(msg, { type: 'info' }),
    warn:    (msg) => add(msg, { type: 'warn' }),
  }
}
