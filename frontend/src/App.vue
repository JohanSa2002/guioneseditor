<template>
  <div class="bg-canvas min-h-screen text-ink selection:bg-accent/20 selection:text-accent">

    <template v-if="isAuthenticated">
      <SideNavBar />
      <TopAppBar />
      <main class="ml-60 pt-16 pb-12 px-8 min-h-screen">
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

  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/auth.js'
import SideNavBar from './components/SideNavBar.vue'
import TopAppBar from './components/TopAppBar.vue'

const auth = useAuthStore()
const { isAuthenticated } = storeToRefs(auth)
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
