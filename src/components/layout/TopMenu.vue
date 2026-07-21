<script setup lang="ts">
import { useClock } from '@/composables/useClock'
import { useSessionCounter } from '@/composables/useSessionCounter'

const { weekday, date, time } = useClock()
const { count } = useSessionCounter()
</script>

<template>
  <header class="topmenu">
    <div class="topmenu__brand">
      <span class="topmenu__logo">◍</span>
      <span class="topmenu__title">INVENTORY</span>
    </div>

    <div class="topmenu__search">
      <input type="text" class="topmenu__input" placeholder="Поиск" />
    </div>

    <div class="topmenu__meta">
      <div class="topmenu__sessions" title="Активных сессий приложения">
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
