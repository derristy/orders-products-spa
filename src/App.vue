<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import TheSidebar from '@/components/layout/TheSidebar.vue'
import TopMenu from '@/components/layout/TopMenu.vue'

const { locale } = useI18n()
const route = useRoute()
const isPublic = computed(() => route.meta.public === true)

// Mobile navigation drawer state.
const navOpen = ref(false)
watch(
  () => route.fullPath,
  () => (navOpen.value = false),
)
</script>

<template>
  <!-- Public pages (login) render without the app chrome -->
  <RouterView v-if="isPublic" v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>

  <!-- Authenticated app layout -->
  <div v-else class="layout">
    <TheSidebar class="layout__sidebar" :class="{ 'layout__sidebar--open': navOpen }" />
    <div v-if="navOpen" class="layout__overlay" @click="navOpen = false" />
    <div class="layout__main">
      <TopMenu class="layout__top" @toggle-nav="navOpen = !navOpen" />
      <main class="layout__content">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" :key="locale" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}
.layout__sidebar {
  width: var(--sidebar-w);
  flex: 0 0 var(--sidebar-w);
}
.layout__main {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.layout__content {
  flex: 1 1 auto;
  padding: 40px 48px;
}
.layout__overlay {
  display: none;
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }
  /* Sidebar becomes a slide-in drawer */
  .layout__sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 240px;
    z-index: 1100;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    overflow-y: auto;
  }
  .layout__sidebar--open {
    transform: translateX(0);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.18);
  }
  .layout__overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(40, 48, 62, 0.45);
    z-index: 1050;
  }
  .layout__content {
    padding: 20px 16px;
  }
}

@media (max-width: 480px) {
  .layout__content {
    padding: 16px 12px;
  }
}
</style>
