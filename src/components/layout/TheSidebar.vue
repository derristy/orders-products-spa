<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useStore } from 'vuex'

interface NavItem {
  key: string
  to?: string
}

// Only Orders and Products are real routes per the task; the rest mirror the
// mockup's menu but are placeholders.
const items: NavItem[] = [
  { key: 'nav.orders', to: '/orders' },
  { key: 'nav.groups', to: '/groups' },
  { key: 'nav.products', to: '/products' },
  { key: 'nav.users', to: '/users' },
  { key: 'nav.settings', to: '/settings' },
]

const store = useStore()
const username = computed<string>(() => store.getters['auth/username'] || 'guest')
// Deterministic male portrait per user (falls back to the gradient if it can't load).
const avatarIndex = computed(() => {
  let hash = 0
  for (const ch of username.value) hash = (hash + ch.charCodeAt(0)) % 100
  return hash
})
const avatarUrl = computed(
  () => `https://randomuser.me/api/portraits/men/${avatarIndex.value}.jpg`,
)
const avatarFailed = ref(false)
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__profile">
      <div class="sidebar__avatar">
        <img
          v-if="!avatarFailed"
          class="sidebar__avatar-img"
          :src="avatarUrl"
          alt=""
          @error="avatarFailed = true"
        />
        <RouterLink to="/settings" class="sidebar__gear" :title="$t('nav.settings')">⚙</RouterLink>
      </div>
    </div>

    <nav class="sidebar__nav">
      <template v-for="item in items" :key="item.key">
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="sidebar__link"
          active-class="sidebar__link--active"
        >
          {{ $t(item.key) }}
        </RouterLink>
        <span v-else class="sidebar__link sidebar__link--disabled">
          {{ $t(item.key) }}
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
.sidebar__avatar-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
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
