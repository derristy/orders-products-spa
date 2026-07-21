<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface NavItem {
  label: string
  to?: string
}

// Only Orders and Products are real routes per the task; the rest mirror the
// mockup's menu but are placeholders.
const items: NavItem[] = [
  { label: 'Приход', to: '/orders' },
  { label: 'Группы' },
  { label: 'Продукты', to: '/products' },
  { label: 'Пользователи' },
  { label: 'Настройки' },
]
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__profile">
      <div class="sidebar__avatar">
        <span class="sidebar__gear">⚙</span>
      </div>
    </div>

    <nav class="sidebar__nav">
      <template v-for="item in items" :key="item.label">
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="sidebar__link"
          active-class="sidebar__link--active"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else class="sidebar__link sidebar__link--disabled">
          {{ item.label }}
        </span>
      </template>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  background: var(--c-sidebar);
  min-height: 100vh;
  padding: 32px 0;
  border-right: 1px solid var(--c-border);
}
.sidebar__profile {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
.sidebar__avatar {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d7dbe6, #b9c0d0);
  border: 3px solid var(--c-surface);
  box-shadow: var(--shadow-card);
}
.sidebar__gear {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--c-surface);
  display: grid;
  place-items: center;
  font-size: 14px;
  color: var(--c-text-muted);
  box-shadow: var(--shadow-card);
}
.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
}
.sidebar__link {
  padding: 12px 8px;
  font-size: 13px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--c-text);
  font-weight: 600;
  transition: color 0.15s ease;
}
.sidebar__link:hover {
  color: var(--c-primary-dark);
}
.sidebar__link--active {
  color: var(--c-primary-dark);
  border-bottom: 2px solid var(--c-primary);
  display: inline-block;
  width: fit-content;
  margin: 0 auto;
}
.sidebar__link--disabled {
  color: var(--c-text-muted);
  cursor: default;
}
.sidebar__link--disabled:hover {
  color: var(--c-text-muted);
}
</style>
