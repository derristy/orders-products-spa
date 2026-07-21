<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { formatShort, formatLong } from '@/utils/date'
import { formatAmount } from '@/utils/money'

const props = defineProps<{ product: Product }>()

// Availability is not part of the dataset — derived for display variety.
const available = computed(() => props.product.id % 3 !== 0)
const defaultPrice = computed(
  () => props.product.price.find((p) => p.isDefault) ?? props.product.price[0],
)
const otherPrice = computed(() => props.product.price.find((p) => !p.isDefault))
</script>

<template>
  <article class="product-row">
    <span class="product-row__dot" :class="{ 'product-row__dot--new': product.isNew }" />

    <span class="product-row__photo" aria-hidden="true">🖥</span>

    <div class="product-row__cell product-row__cell--title">
      <span class="product-row__title">{{ product.title }}</span>
      <span class="product-row__muted">SN-{{ product.serialNumber }}</span>
    </div>

    <div class="product-row__cell product-row__status" :class="{ 'is-off': !available }">
      {{ available ? $t('product.free') : $t('product.inRepair') }}
    </div>

    <div class="product-row__cell">{{ product.isNew ? $t('product.new') : $t('product.used') }}</div>

    <div class="product-row__cell product-row__price">
      <span v-if="otherPrice" class="product-row__muted">
        {{ formatAmount(otherPrice.value) }} {{ otherPrice.symbol }}
      </span>
      <span class="product-row__strong">
        {{ formatAmount(defaultPrice.value) }} {{ defaultPrice.symbol }}
      </span>
    </div>

    <div class="product-row__cell product-row__guarantee">
      <span class="product-row__muted">
        {{ $t('product.from') }} {{ formatShort(product.guarantee.start) }} ·
        {{ formatLong(product.guarantee.start) }}
      </span>
      <span class="product-row__muted">
        {{ $t('product.to') }} {{ formatShort(product.guarantee.end) }} ·
        {{ formatLong(product.guarantee.end) }}
      </span>
    </div>

    <div class="product-row__cell product-row__order">
      {{ product.orderTitle ?? '—' }}
    </div>

    <div class="product-row__cell product-row__dates">
      <span class="product-row__muted">{{ formatShort(product.date) }}</span>
      <span>{{ formatLong(product.date) }}</span>
    </div>

    <button class="product-row__delete" :title="$t('details.deleteProduct')">🗑</button>
  </article>
</template>

<style scoped>
.product-row {
  display: flex;
  align-items: center;
  gap: 20px;
  background: var(--c-surface);
  border-bottom: 1px solid var(--c-border);
  padding: 14px 20px;
  min-width: max-content;
}
.product-row:hover {
  background: #fafbfc;
}
.product-row__dot {
  flex: 0 0 auto;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--c-text-muted);
}
.product-row__dot--new {
  background: var(--c-primary);
}
.product-row__photo {
  flex: 0 0 auto;
  font-size: 24px;
}
.product-row__cell {
  display: flex;
  flex-direction: column;
  line-height: 1.4;
  white-space: nowrap;
  color: var(--c-text);
}
.product-row__cell--title {
  flex: 0 0 320px;
  min-width: 0;
}
.product-row__title {
  color: var(--c-heading);
  overflow: hidden;
  text-overflow: ellipsis;
}
.product-row__muted {
  font-size: 12px;
  color: var(--c-text-muted);
}
.product-row__strong {
  font-weight: 600;
  color: var(--c-heading);
}
.product-row__status {
  flex: 0 0 90px;
  color: var(--c-primary-dark);
}
.product-row__status.is-off {
  color: var(--c-text-muted);
}
.product-row__price {
  flex: 0 0 150px;
}
.product-row__guarantee {
  flex: 0 0 220px;
}
.product-row__order {
  flex: 0 0 240px;
  color: var(--c-heading);
  white-space: normal;
}
.product-row__dates {
  flex: 0 0 130px;
}
.product-row__delete {
  flex: 0 0 auto;
  border: none;
  background: none;
  color: var(--c-text-muted);
  cursor: pointer;
  font-size: 15px;
}
.product-row__delete:hover {
  color: var(--c-danger);
}
</style>
