<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, setLocale } from '@/i18n'
import type { LocaleCode } from '@/i18n/dateNames'
import { ACCENTS, setAccent, currentAccentName } from '@/utils/theme'

const store = useStore()
const router = useRouter()
const { locale } = useI18n()

const accent = ref(currentAccentName())
const username = store.getters['auth/username']

function chooseLocale(code: LocaleCode) {
  setLocale(code)
}
function chooseAccent(name: string) {
  accent.value = name
  setAccent(name)
}
function logout() {
  store.dispatch('auth/logout')
  router.push({ name: 'login' })
}
</script>

<template>
  <section class="settings">
    <h1 class="settings__title">{{ $t('settings.title') }}</h1>

    <div class="settings__card">
      <h2 class="settings__section">{{ $t('settings.language') }}</h2>
      <div class="settings__options">
        <button
          v-for="l in SUPPORTED_LOCALES"
          :key="l.code"
          class="settings__pill"
          :class="{ 'settings__pill--active': locale === l.code }"
          @click="chooseLocale(l.code)"
        >
          {{ l.label }}
        </button>
      </div>
    </div>

    <div class="settings__card">
      <h2 class="settings__section">{{ $t('settings.accent') }}</h2>
      <div class="settings__options">
        <button
          v-for="a in ACCENTS"
          :key="a.name"
          class="settings__swatch"
          :class="{ 'settings__swatch--active': accent === a.name }"
          :style="{ background: a.primary }"
          :title="a.name"
          @click="chooseAccent(a.name)"
        />
      </div>
    </div>

    <div class="settings__card">
      <h2 class="settings__section">{{ $t('settings.profile') }}</h2>
      <div class="settings__profile">
        <span class="settings__account">{{ $t('settings.account') }}:</span>
        <strong class="settings__username">{{ username }}</strong>
        <button class="settings__logout" @click="logout">{{ $t('settings.logout') }}</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.settings__title {
  font-size: 28px;
  font-weight: 700;
  color: var(--c-heading);
  margin: 0 0 28px;
}
.settings__card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
  padding: 22px 26px;
  margin-bottom: 16px;
  max-width: 620px;
}
.settings__section {
  font-size: 15px;
  font-weight: 600;
  color: var(--c-heading);
  margin: 0 0 16px;
}
.settings__options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.settings__pill {
  border: 1px solid var(--c-border);
  background: var(--c-surface);
  border-radius: 20px;
  padding: 8px 18px;
  font-weight: 600;
  color: var(--c-text-muted);
  cursor: pointer;
}
.settings__pill--active {
  background: var(--c-primary);
  border-color: var(--c-primary);
  color: #fff;
}
.settings__swatch {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  outline: 1px solid var(--c-border);
}
.settings__swatch--active {
  border-color: var(--c-surface);
  outline: 2px solid var(--c-heading);
}
.settings__profile {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.settings__account {
  color: var(--c-text-muted);
}
.settings__username {
  color: var(--c-heading);
}
.settings__logout {
  margin-left: auto;
  border: none;
  background: #f2f4f8;
  color: var(--c-danger);
  font-weight: 700;
  border-radius: var(--radius);
  padding: 9px 20px;
  cursor: pointer;
}
.settings__logout:hover {
  background: var(--c-danger);
  color: #fff;
}
</style>
