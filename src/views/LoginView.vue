<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher.vue'

const store = useStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const username = ref('admin')
const password = ref('admin')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await store.dispatch('auth/login', { username: username.value, password: password.value })
    const redirect = (route.query.redirect as string) || '/orders'
    router.push(redirect)
  } catch {
    error.value = t('auth.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <div class="login__lang"><LanguageSwitcher /></div>

    <form class="login__card" @submit.prevent="submit">
      <div class="login__brand">
        <span class="login__logo">◍</span>
        <span class="login__brandtext">INVENTORY</span>
      </div>

      <h1 class="login__title">{{ $t('auth.title') }}</h1>

      <label class="login__field">
        <span class="login__label">{{ $t('auth.username') }}</span>
        <input v-model="username" type="text" class="login__input" autocomplete="username" />
      </label>

      <label class="login__field">
        <span class="login__label">{{ $t('auth.password') }}</span>
        <input
          v-model="password"
          type="password"
          class="login__input"
          autocomplete="current-password"
        />
      </label>

      <p v-if="error" class="login__error">{{ error }}</p>

      <button type="submit" class="login__submit" :disabled="loading">
        {{ $t('auth.submit') }}
      </button>

      <p class="login__hint">{{ $t('auth.hint') }}</p>
    </form>
  </div>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #eef1f5, #e2f0d0);
  padding: 24px;
  position: relative;
}
.login__lang {
  position: absolute;
  top: 20px;
  right: 24px;
}
.login__card {
  width: 100%;
  max-width: 380px;
  background: var(--c-surface);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(60, 70, 90, 0.15);
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.login__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}
.login__logo {
  color: var(--c-primary);
  font-size: 26px;
}
.login__brandtext {
  color: var(--c-primary-dark);
  font-weight: 700;
  letter-spacing: 0.08em;
}
.login__title {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: var(--c-heading);
  margin: 0 0 8px;
}
.login__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.login__label {
  font-size: 13px;
  color: var(--c-text-muted);
}
.login__input {
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  padding: 11px 14px;
  font-size: 14px;
  outline: none;
}
.login__input:focus {
  border-color: var(--c-primary);
}
.login__error {
  color: var(--c-danger);
  font-size: 13px;
  margin: 0;
}
.login__submit {
  border: none;
  background: var(--c-primary);
  color: #fff;
  font-weight: 700;
  padding: 12px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.15s ease;
}
.login__submit:hover:not(:disabled) {
  background: var(--c-primary-dark);
}
.login__submit:disabled {
  opacity: 0.6;
  cursor: default;
}
.login__hint {
  text-align: center;
  font-size: 12px;
  color: var(--c-text-muted);
  margin: 0;
}
</style>
