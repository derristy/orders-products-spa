<script setup lang="ts">
import type { Order } from '@/types'

defineProps<{ order: Order }>()

const emit = defineEmits<{ (e: 'close'): void }>()
</script>

<template>
  <aside class="order-details">
    <button class="order-details__close" title="Закрыть" @click="emit('close')">✕</button>

    <h2 class="order-details__title">{{ order.title }}</h2>

    <button class="order-details__add">
      <span class="order-details__add-icon">＋</span> Добавить продукт
    </button>

    <ul class="order-details__list">
      <li v-for="product in order.products" :key="product.id" class="product-line">
        <span
          class="product-line__dot"
          :class="{ 'product-line__dot--new': product.isNew }"
        />
        <span class="product-line__photo" aria-hidden="true">🖥</span>
        <div class="product-line__info">
          <span class="product-line__title">{{ product.title }}</span>
          <span class="product-line__sn">SN-{{ product.serialNumber }}</span>
        </div>
        <span class="product-line__status">Свободен</span>
        <button class="product-line__delete" title="Удалить продукт">🗑</button>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.order-details {
  position: relative;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
  padding: 28px 32px;
}
.order-details__close {
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
  font-size: 14px;
}
.order-details__close:hover {
  color: var(--c-danger);
}
.order-details__title {
  font-size: 22px;
  font-weight: 600;
  color: var(--c-heading);
  margin: 0 0 16px;
}
.order-details__add {
  border: none;
  background: none;
  color: var(--c-primary-dark);
  font-weight: 600;
  cursor: pointer;
  padding: 0 0 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.order-details__add-icon {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--c-primary);
  color: #fff;
  font-size: 14px;
}
.order-details__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.product-line {
  display: grid;
  grid-template-columns: 12px 40px 1fr auto 24px;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid var(--c-border);
}
.product-line__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--c-text-muted);
}
.product-line__dot--new {
  background: var(--c-primary);
}
.product-line__photo {
  font-size: 22px;
}
.product-line__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.product-line__title {
  color: var(--c-heading);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.product-line__sn {
  font-size: 12px;
  color: var(--c-text-muted);
}
.product-line__status {
  color: var(--c-primary-dark);
  font-size: 13px;
}
.product-line__delete {
  border: none;
  background: none;
  color: var(--c-text-muted);
  cursor: pointer;
}
.product-line__delete:hover {
  color: var(--c-danger);
}
</style>
