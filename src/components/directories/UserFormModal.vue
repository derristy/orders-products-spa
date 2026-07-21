<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { User } from '@/types'

const props = defineProps<{ user: User | null }>()
const emit = defineEmits<{
  (e: 'save', data: { name: string; email: string; role: string }): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()
const name = ref(props.user?.name ?? '')
const email = ref(props.user?.email ?? '')
const role = ref(props.user?.role ?? '')
const error = ref('')

function submit() {
  if (!name.value.trim()) {
    error.value = t('form.required')
    return
  }
  emit('save', { name: name.value.trim(), email: email.value.trim(), role: role.value.trim() })
}
</script>

<template>
  <div class="fmodal" @click.self="emit('cancel')">
    <form class="fmodal__dialog" @submit.prevent="submit">
      <button type="button" class="fmodal__close" @click="emit('cancel')">✕</button>
      <h3 class="fmodal__title">{{ user ? $t('dir.editUser') : $t('dir.newUser') }}</h3>

      <label class="fmodal__field">
        <span class="fmodal__label">{{ $t('dir.fio') }}</span>
        <input v-model="name" type="text" class="fmodal__input" />
      </label>
      <div class="fmodal__row">
        <label class="fmodal__field">
          <span class="fmodal__label">{{ $t('dir.email') }}</span>
          <input v-model="email" type="email" class="fmodal__input" />
        </label>
        <label class="fmodal__field">
          <span class="fmodal__label">{{ $t('dir.role') }}</span>
          <input v-model="role" type="text" class="fmodal__input" />
        </label>
      </div>

      <p v-if="error" class="fmodal__error">{{ error }}</p>

      <div class="fmodal__actions">
        <button type="button" class="fmodal__btn fmodal__btn--ghost" @click="emit('cancel')">
          {{ $t('dir.cancel') }}
        </button>
        <button type="submit" class="fmodal__btn fmodal__btn--primary">{{ $t('dir.save') }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped src="@/assets/styles/form-modal.css"></style>
