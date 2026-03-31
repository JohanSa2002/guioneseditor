<template>
  <div class="min-h-screen bg-canvas flex items-center justify-center px-4">
    <div class="w-full max-w-sm">

      <!-- Logo / título -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 mb-4">
          <span class="material-icons text-accent text-2xl">edit_note</span>
        </div>
        <h1 class="text-xl font-semibold text-ink">Generador de Guiones</h1>
        <p class="text-sm text-ink/40 mt-1">Inicia sesión para continuar</p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-ink/50 mb-1.5 uppercase tracking-wide">
            Correo electrónico
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="admin@gmail.com"
            autocomplete="email"
            class="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-ink placeholder-ink/25
                   focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-ink/50 mb-1.5 uppercase tracking-wide">
            Contraseña
          </label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              class="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-ink placeholder-ink/25
                     focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition pr-10"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition"
            >
              <span class="material-icons text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
        </div>

        <!-- Error -->
        <p v-if="error" class="text-red-400 text-xs text-center">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-medium
                 rounded-lg py-2.5 text-sm transition mt-2"
        >
          {{ loading ? 'Entrando…' : 'Entrar' }}
        </button>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router   = useRouter()
const auth     = useAuthStore()
const email    = ref('')
const password = ref('')
const error    = ref('')
const loading  = ref(false)
const showPassword = ref(false)

async function handleLogin() {
  error.value   = ''
  loading.value = true
  // pequeño delay para feedback visual
  await new Promise(r => setTimeout(r, 300))
  const ok = auth.login(email.value.trim(), password.value)
  loading.value = false
  if (ok) {
    router.push('/')
  } else {
    error.value = 'Correo o contraseña incorrectos.'
  }
}
</script>
