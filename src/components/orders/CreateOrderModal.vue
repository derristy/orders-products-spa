<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'create', data: { title: string; description: string }): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()
const title = ref('')
const description = ref('')
const error = ref('')

function submit() {
  if (!title.value.trim()) {
    error.value = t('form.required')
    return
  }
  emit('create', { title: title.value.trim(), description: description.value.trim() })
}
</script>

<template>
  <div class="fmodal" @click.self="emit('cancel')">
    <form class="fmodal__dialog" @submit.prevent="submit">
      <button type="button" class="fmodal__close" @click="emit('cancel')">✕</button>
      <h3 class="fmodal__title">{{ $t('form.newOrder') }}</h3>

      <label class="fmodal__field">
        <span class="fmodal__label">{{ $t('form.name') }}</span>
        <input v-model="title" type="text" class="fmodal__input" />
      </label>
      <label class="fmodal__field">
        <span class="fmodal__label">{{ $t('form.description') }}</span>
        <textarea v-model="description" rows="3" class="fmodal__input" />
      </label>

      <p v-if="error" class="fmodal__error">{{ error }}</p>

      <div class="fmodal__actions">
        <button type="button" class="fmodal__btn fmodal__btn--ghost" @click="emit('cancel')">
          {{ $t('form.cancel') }}
        </button>
        <button type="submit" class="fmodal__btn fmodal__btn--primary">
          {{ $t('form.create') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped src="@/assets/styles/form-modal.css"></style>
