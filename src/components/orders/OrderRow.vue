<script setup lang="ts">
import { computed } from 'vue'
import type { Order } from '@/types'
import { formatShort, formatLong } from '@/utils/date'
import { orderTotals, formatAmount } from '@/utils/money'

const props = defineProps<{
  order: Order
  compact?: boolean
  active?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', id: number): void
  (e: 'delete', order: Order): void
}>()

const productsCount = computed(() => props.order.products.length)
const totals = computed(() => orderTotals(props.order))
const defaultSymbol = computed(
  () => props.order.products[0]?.price.find((p) => p.isDefault)?.symbol ?? 'UAH',
)
</script>

<template>
  <article
    class="order-row"
    :class="{ 'order-row--compact': compact, 'order-row--active': active }"
    @click="emit('select', order.id)"
  >
    <span class="order-row__icon" aria-hidden="true">☰</span>

    <h3 v-if="!compact" class="order-row__title">{{ order.title }}</h3>

    <div class="order-row__count">
      <span class="order-row__count-num">{{ productsCount }}</span>
      <span class="order-row__count-label">{{ $t('orders.productsLabel') }}</span>
    </div>

    <div class="order-row__dates">
      <span class="order-row__date-short">{{ formatShort(order.date) }}</span>
      <span class="order-row__date-long">{{ formatLong(order.date) }}</span>
    </div>

    <div v-if="!compact" class="order-row__totals">
      <span
        v-for="t in totals"
        :key="t.symbol"
        class="order-row__total"
        :class="{ 'order-row__total--default': t.symbol === defaultSymbol }"
      >
        {{ formatAmount(t.value) }} <span class="order-row__symbol">{{ t.symbol }}</span>
      </span>
    </div>

    <button
      v-if="!compact"
      class="order-row__delete"
      :title="$t('details.deleteProduct')"
      @click.stop="emit('delete', order)"
    >
      🗑
    </button>

    <span v-if="compact && active" class="order-row__arrow" aria-hidden="true">›</span>
  </article>
</template>

<style scoped>
.order-row {
  display: grid;
  grid-template-columns: 40px 1fr auto auto auto 32px;
  align-items: center;
  gap: 24px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  padding: 18px 24px;
  cursor: pointer;
  box-shadow: var(--shadow-card);
  transition:
    box-shadow 0.15s ease,
    transform 0.1s ease;
}
.order-row:hover {
  box-shadow: 0 4px 18px rgba(60, 70, 90, 0.1);
}
.order-row--compact {
  grid-template-columns: 40px auto 1fr 20px;
  gap: 16px;
  padding: 16px 20px;
}
.order-row--active {
  border-color: var(--c-primary);
}

.order-row__icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f2f4f8;
  color: var(--c-primary-dark);
  font-size: 16px;
  cursor: grab;
}
.order-row__icon:active {
  cursor: grabbing;
}
.order-row--ghost {
  opacity: 0.4;
}
.order-row__title {
  font-size: 18px;
  font-weight: 500;
  color: var(--c-heading);
  margin: 0;
  text-decoration: underline;
  text-decoration-color: var(--c-border);
  text-underline-offset: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.order-row__count {
  text-align: center;
  line-height: 1.2;
}
.order-row__count-num {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: var(--c-heading);
}
.order-row__count-label {
  font-size: 12px;
  color: var(--c-text-muted);
}
.order-row__dates {
  text-align: center;
  line-height: 1.4;
  white-space: nowrap;
}
.order-row__date-short {
  display: block;
  font-size: 11px;
  color: var(--c-text-muted);
}
.order-row__date-long {
  font-size: 13px;
  color: var(--c-text);
}
.order-row__totals {
  text-align: right;
  line-height: 1.4;
  white-space: nowrap;
}
.order-row__total {
  display: block;
  font-size: 12px;
  color: var(--c-text-muted);
}
.order-row__total--default {
  font-size: 14px;
  color: var(--c-heading);
  font-weight: 600;
}
.order-row__symbol {
  font-size: 0.85em;
  text-transform: uppercase;
}
.order-row__delete {
  border: none;
  background: none;
  color: var(--c-text-muted);
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  transition: color 0.15s ease;
}
.order-row__delete:hover {
  color: var(--c-danger);
}
.order-row__arrow {
  font-size: 24px;
  color: var(--c-text-muted);
  text-align: center;
}

@media (max-width: 600px) {
  .order-row:not(.order-row--compact) {
    grid-template-columns: 64px 1fr auto;
    grid-template-areas:
      'icon title trash'
      'count dates total';
    gap: 12px 12px;
    padding: 14px 16px;
  }
  .order-row:not(.order-row--compact) .order-row__icon {
    grid-area: icon;
  }
  .order-row:not(.order-row--compact) .order-row__title {
    grid-area: title;
    font-size: 15px;
    align-self: center;
  }
  .order-row:not(.order-row--compact) .order-row__delete {
    grid-area: trash;
  }
  .order-row:not(.order-row--compact) .order-row__count {
    grid-area: count;
    text-align: left;
  }
  .order-row:not(.order-row--compact) .order-row__count-label {
    font-size: 11px;
  }
  .order-row:not(.order-row--compact) .order-row__dates {
    grid-area: dates;
    text-align: left;
    align-self: center;
  }
  .order-row:not(.order-row--compact) .order-row__totals {
    grid-area: total;
    text-align: right;
    align-self: center;
  }
}
</style>
