<template>
  <div class="bg-canvas min-h-screen text-ink selection:bg-accent/20 selection:text-accent">
    <SideNavBar />
    <TopAppBar />

    <!-- Área principal -->
    <main class="ml-60 pt-16 pb-12 px-8 min-h-screen">
      <div class="max-w-7xl mx-auto pt-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import SideNavBar from './components/SideNavBar.vue'
import TopAppBar from './components/TopAppBar.vue'
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
