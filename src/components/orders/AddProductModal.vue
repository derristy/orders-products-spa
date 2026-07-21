<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type { NewProduct } from '@/api'

const emit = defineEmits<{
  (e: 'add', data: NewProduct): void
  (e: 'cancel'): void
}>()

const store = useStore()
const { t } = useI18n()

// Reuse the known product types for the select.
const types = computed<string[]>(() => {
  const fromStore = store.getters['products/types'] as string[]
  return fromStore.length ? fromStore : ['Monitors', 'Laptops', 'Phones', 'Keyboards']
})

const title = ref('')
const type = ref(types.value[0])
const serialNumber = ref('')
const isNew = ref(true)
const priceUsd = ref(0)
const priceUah = ref(0)
const error = ref('')

function submit() {
  if (!title.value.trim()) {
    error.value = t('form.required')
    return
  }
  emit('add', {
    title: title.value.trim(),
    type: type.value,
    serialNumber: serialNumber.value.trim() || '00.0000000',
    isNew: isNew.value,
    priceUsd: Number(priceUsd.value) || 0,
    priceUah: Number(priceUah.value) || 0,
  })
}
</script>

<template>
  <div class="fmodal" @click.self="emit('cancel')">
    <form class="fmodal__dialog" @submit.prevent="submit">
      <button type="button" class="fmodal__close" @click="emit('cancel')">✕</button>
      <h3 class="fmodal__title">{{ $t('form.newProduct') }}</h3>

      <label class="fmodal__field">
        <span class="fmodal__label">{{ $t('form.name') }}</span>
        <input v-model="title" type="text" class="fmodal__input" />
      </label>

      <div class="fmodal__row">
        <label class="fmodal__field">
          <span class="fmodal__label">{{ $t('form.type') }}</span>
          <select v-model="type" class="fmodal__input">
            <option v-for="tp in types" :key="tp" :value="tp">{{ tp }}</option>
          </select>
        </label>
        <label class="fmodal__field">
          <span class="fmodal__label">{{ $t('form.serial') }}</span>
          <input v-model="serialNumber" type="text" class="fmodal__input" />
        </label>
      </div>

      <div class="fmodal__row">
        <label class="fmodal__field">
          <span class="fmodal__label">{{ $t('form.priceUsd') }}</span>
          <input v-model="priceUsd" type="number" min="0" step="0.01" class="fmodal__input" />
        </label>
        <label class="fmodal__field">
          <span class="fmodal__label">{{ $t('form.priceUah') }}</span>
          <input v-model="priceUah" type="number" min="0" step="0.01" class="fmodal__input" />
        </label>
      </div>

      <label class="fmodal__check">
        <input v-model="isNew" type="checkbox" />
        {{ $t('form.isNew') }}
      </label>

      <p v-if="error" class="fmodal__error">{{ error }}</p>

      <div class="fmodal__actions">
        <button type="button" class="fmodal__btn fmodal__btn--ghost" @click="emit('cancel')">
          {{ $t('form.cancel') }}
        </button>
        <button type="submit" class="fmodal__btn fmodal__btn--primary">{{ $t('form.add') }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped src="@/assets/styles/form-modal.css"></style>
