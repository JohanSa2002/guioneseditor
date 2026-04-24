<template>
  <div class="relative" ref="container">
    <div class="relative">
      <span v-if="icon" class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 text-[18px]">
        {{ icon }}
      </span>
      <input
        :value="modelValue"
        @input="onInput"
        @focus="isOpen = true"
        type="text"
        :placeholder="placeholder"
        class="input-base"
        :class="[icon ? 'pl-10' : '', error ? 'border-error/50 focus:ring-error/20' : '']"
        :disabled="disabled"
      />
      <button
        v-if="modelValue"
        @click="clear"
        type="button"
        class="absolute right-10 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink transition-colors"
      >
        <span class="material-symbols-outlined text-[18px]">close</span>
      </button>
      <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none transition-transform"
            :class="isOpen ? 'rotate-180' : ''">
        expand_more
      </span>
    </div>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen && filteredOptions.length > 0"
        class="absolute z-50 w-full mt-2 bg-surface-solid border border-border shadow-2xl rounded-xl overflow-hidden max-h-60 overflow-y-auto backdrop-blur-xl"
      >
        <button
          v-for="opt in filteredOptions"
          :key="opt"
          @click="select(opt)"
          type="button"
          class="w-full text-left px-4 py-2.5 text-sm text-ink-2 hover:bg-accent/10 hover:text-accent transition-colors flex items-center justify-between group"
        >
          {{ opt }}
          <span v-if="opt === modelValue" class="material-symbols-outlined text-accent text-[16px]">check</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: String,
  options: Array,
  placeholder: String,
  icon: String,
  disabled: Boolean,
  error: Boolean
})

const emit = defineEmits(['update:modelValue'])

const container = ref(null)
const isOpen = ref(false)

const filteredOptions = computed(() => {
  if (!props.modelValue) return props.options
  const q = props.modelValue.toLowerCase()
  return props.options.filter(o => o.toLowerCase().includes(q))
})

function onInput(e) {
  emit('update:modelValue', e.target.value)
  isOpen.value = true
}

function select(val) {
  emit('update:modelValue', val)
  isOpen.value = false
}

function clear() {
  emit('update:modelValue', '')
  isOpen.value = false
}

function handleClickOutside(e) {
  if (container.value && !container.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
