<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Group } from '@/types'

const props = defineProps<{ group: Group | null }>()
const emit = defineEmits<{
  (e: 'save', data: { name: string; description: string }): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()
const name = ref(props.group?.name ?? '')
const description = ref(props.group?.description ?? '')
const error = ref('')

function submit() {
  if (!name.value.trim()) {
    error.value = t('form.required')
    return
  }
  emit('save', { name: name.value.trim(), description: description.value.trim() })
}
</script>

<template>
  <div class="fmodal" @click.self="emit('cancel')">
    <form class="fmodal__dialog" @submit.prevent="submit">
      <button type="button" class="fmodal__close" @click="emit('cancel')">✕</button>
      <h3 class="fmodal__title">{{ group ? $t('dir.editGroup') : $t('dir.newGroup') }}</h3>

      <label class="fmodal__field">
        <span class="fmodal__label">{{ $t('dir.name') }}</span>
        <input v-model="name" type="text" class="fmodal__input" />
      </label>
      <label class="fmodal__field">
        <span class="fmodal__label">{{ $t('dir.description') }}</span>
        <textarea v-model="description" rows="3" class="fmodal__input" />
      </label>

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
