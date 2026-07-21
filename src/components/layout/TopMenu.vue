<script setup lang="ts">
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useClock } from '@/composables/useClock'
import { useSessionCounter } from '@/composables/useSessionCounter'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { weekday, date, time } = useClock()
const { count } = useSessionCounter()

const store = useStore()
const route = useRoute()
const router = useRouter()
const username = computed<string>(() => store.getters['auth/username'])

const search = computed({
  get: () => store.state.ui.search,
  set: (v: string) => store.commit('ui/setSearch', v),
})

// Reset the search box when navigating between sections.
watch(
  () => route.name,
  () => store.commit('ui/setSearch', ''),
)

function logout() {
  store.dispatch('auth/logout')
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="topmenu">
    <div class="topmenu__brand">
      <span class="topmenu__logo">◍</span>
      <span class="topmenu__title">INVENTORY</span>
    </div>

    <div class="topmenu__search">
      <input v-model="search" type="text" class="topmenu__input" :placeholder="$t('top.search')" />
    </div>

    <div class="topmenu__meta">
      <LanguageSwitcher />
      <div class="topmenu__sessions" :title="$t('top.sessions')">
        <span class="topmenu__dot" />
        {{ count }}
      </div>
      <div class="topmenu__datetime">
        <div class="topmenu__weekday">{{ weekday }}</div>
        <div class="topmenu__date">{{ date }}</div>
      </div>
      <div class="topmenu__time">
        <span class="topmenu__clock">◷</span>
        {{ time }}
      </div>

      <div class="topmenu__user">
        <span class="topmenu__username">{{ username }}</span>
        <button class="topmenu__logout" :title="$t('auth.logout')" @click="logout">⎋</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topmenu {
  height: var(--topbar-h);
  background: var(--c-surface);
  border-bottom: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 32px;
}
.topmenu__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.topmenu__logo {
  color: var(--c-primary);
  font-size: 24px;
}
.topmenu__title {
  color: var(--c-primary-dark);
  font-weight: 700;
  letter-spacing: 0.08em;
}
.topmenu__search {
  flex: 1 1 auto;
  max-width: 420px;
}
.topmenu__input {
  width: 100%;
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  padding: 10px 16px;
  font-size: 14px;
  background: #f8f9fb;
  outline: none;
}
.topmenu__input:focus {
  border-color: var(--c-primary);
}
.topmenu__meta {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 24px;
}
.topmenu__sessions {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: var(--c-heading);
}
.topmenu__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-primary);
}
.topmenu__datetime {
  text-align: right;
  line-height: 1.3;
}
.topmenu__weekday {
  color: var(--c-heading);
  font-weight: 600;
}
.topmenu__date {
  color: var(--c-heading);
  font-weight: 700;
}
.topmenu__time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-primary-dark);
  font-weight: 600;
}
.topmenu__user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 20px;
  border-left: 1px solid var(--c-border);
}
.topmenu__username {
  font-weight: 600;
  color: var(--c-heading);
}
.topmenu__logout {
  border: none;
  background: #f2f4f8;
  color: var(--c-text-muted);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 15px;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}
.topmenu__logout:hover {
  background: var(--c-danger);
  color: #fff;
}

@media (max-width: 768px) {
  .topmenu {
    flex-wrap: wrap;
    height: auto;
    padding: 12px 16px;
    gap: 12px;
  }
  .topmenu__search {
    order: 3;
    max-width: none;
    flex-basis: 100%;
  }
}
</style>
