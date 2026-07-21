<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, setLocale } from '@/i18n'
import type { LocaleCode } from '@/i18n/dateNames'

const { locale } = useI18n()

function choose(code: LocaleCode) {
  setLocale(code)
}
</script>

<template>
  <div class="lang">
    <button
      v-for="l in SUPPORTED_LOCALES"
      :key="l.code"
      class="lang__btn"
      :class="{ 'lang__btn--active': locale === l.code }"
      type="button"
      @click="choose(l.code)"
    >
      {{ l.label }}
    </button>
  </div>
</template>

<style scoped>
.lang {
  display: inline-flex;
  gap: 2px;
  background: #f2f4f8;
  border-radius: 20px;
  padding: 3px;
}
.lang__btn {
  border: none;
  background: none;
  border-radius: 16px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-muted);
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}
.lang__btn:hover {
  color: var(--c-heading);
}
.lang__btn--active {
  background: var(--c-primary);
  color: #fff;
}
</style>
