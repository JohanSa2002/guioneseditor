<template>
  <div class="bg-surface min-h-screen text-on-surface selection:bg-primary/30">
    <SideNavBar />
    <TopAppBar />

    <!-- Main Content Canvas -->
    <main class="ml-64 pt-24 pb-12 px-8 min-h-screen relative">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
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
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
