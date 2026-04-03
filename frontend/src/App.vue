<template>
  <div class="bg-canvas min-h-screen text-ink selection:bg-accent/20 selection:text-accent">

    <template v-if="isAuthenticated">
      <SideNavBar :open="sidebarOpen" @close="sidebarOpen = false" />
      <!-- Mobile backdrop -->
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-black/50 md:hidden"
        @click="sidebarOpen = false"
      />
      <TopAppBar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="md:ml-60 pt-16 pb-12 px-4 md:px-8 min-h-screen">
        <div class="max-w-7xl mx-auto pt-8">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </template>

    <template v-else>
      <router-view />
    </template>

    <ToastContainer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/auth.js'
import SideNavBar from './components/SideNavBar.vue'
import TopAppBar from './components/TopAppBar.vue'
import ToastContainer from './components/ToastContainer.vue'

const auth = useAuthStore()
const { isAuthenticated } = storeToRefs(auth)
const sidebarOpen = ref(false)
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s cubic-bezier(0.23, 1, 0.32, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
