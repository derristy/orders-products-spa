<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import TheSidebar from '@/components/layout/TheSidebar.vue'
import TopMenu from '@/components/layout/TopMenu.vue'

const { locale } = useI18n()
const route = useRoute()
const isPublic = computed(() => route.meta.public === true)
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
    <TheSidebar class="layout__sidebar" />
    <div class="layout__main">
      <TopMenu class="layout__top" />
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

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }
  .layout__sidebar {
    width: 100%;
    flex-basis: auto;
  }
  .layout__content {
    padding: 24px 16px;
  }
}
</style>
