<script setup lang="ts">
import type { Order } from '@/types'

defineProps<{ order: Order }>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="confirm" @click.self="emit('cancel')">
    <div class="confirm__dialog" role="dialog" aria-modal="true">
      <button class="confirm__close" :title="$t('del.close')" @click="emit('cancel')">✕</button>

      <div class="confirm__head">
        <h3 class="confirm__title">{{ $t('del.title') }}</h3>
      </div>

      <div class="confirm__body">
        <div class="confirm__preview">
          <span class="confirm__dot" />
          <span class="confirm__photo" aria-hidden="true">🖥</span>
          <div class="confirm__info">
            <span class="confirm__product">{{ order.title }}</span>
            <span class="confirm__sn">{{ $t('del.productsCount') }}: {{ order.products.length }}</span>
          </div>
        </div>
      </div>

      <div class="confirm__footer">
        <button class="confirm__btn confirm__btn--ghost" @click="emit('cancel')">
          {{ $t('del.cancel') }}
        </button>
        <button class="confirm__btn confirm__btn--danger" @click="emit('confirm')">
          🗑 {{ $t('del.confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm {
  position: fixed;
  inset: 0;
  background: rgba(60, 70, 90, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  overflow-y: auto;
}
.confirm__dialog {
  position: relative;
  width: 100%;
  max-width: 640px;
  background: var(--c-surface);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}
.confirm__close {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--c-surface);
  box-shadow: var(--shadow-card);
  color: var(--c-text-muted);
  cursor: pointer;
}
.confirm__head {
  padding: 24px 28px;
}
.confirm__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--c-heading);
  margin: 0;
}
.confirm__body {
  padding: 0 28px 24px;
}
.confirm__preview {
  display: grid;
  grid-template-columns: 12px 40px 1fr;
  align-items: center;
  gap: 16px;
}
.confirm__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--c-primary);
}
.confirm__photo {
  font-size: 22px;
}
.confirm__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.confirm__product {
  color: var(--c-heading);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.confirm__sn {
  font-size: 12px;
  color: var(--c-text-muted);
}
.confirm__footer {
  background: var(--c-primary);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  padding: 22px 28px;
}
.confirm__btn {
  border: none;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.confirm__btn--ghost {
  background: none;
  color: #fff;
}
.confirm__btn--danger {
  background: #fff;
  color: var(--c-danger);
  border-radius: 24px;
  padding: 12px 28px;
}
.confirm__btn--danger:hover {
  background: #fff5f5;
}
</style>
