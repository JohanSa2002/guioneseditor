import { defineStore } from 'pinia'
import { ref } from 'vue'

const ADMIN_EMAIL    = 'admin@gmail.com'
const ADMIN_PASSWORD = 'admin123'
const STORAGE_KEY    = 'auth_session'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(!!localStorage.getItem(STORAGE_KEY))

  function login(email, password) {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, '1')
      isAuthenticated.value = true
      return true
    }
    return false
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    isAuthenticated.value = false
  }

  return { isAuthenticated, login, logout }
})
