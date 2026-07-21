<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type { Product } from '@/types'
import ProductRow from './ProductRow.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const store = useStore()
const { t } = useI18n()
const filtered = computed<Product[]>(() => store.getters['products/filtered'])

const toDelete = ref<Product | null>(null)

async function confirmDelete() {
  if (!toDelete.value) return
  await store.dispatch('products/remove', {
    orderId: toDelete.value.order,
    productId: toDelete.value.id,
  })
  toDelete.value = null
}
</script>

<template>
  <div class="product-list">
    <div class="product-list__scroll">
      <TransitionGroup name="list" tag="div" class="product-list__rows">
        <ProductRow
          v-for="product in filtered"
          :key="product.id"
          :product="product"
          @delete="toDelete = $event"
        />
      </TransitionGroup>
    </div>
    <p v-if="filtered.length === 0" class="product-list__empty">
      {{ $t('list.empty') }}
    </p>

    <Transition name="fade">
      <ConfirmDialog
        v-if="toDelete"
        :message="t('product.confirmDelete')"
        @confirm="confirmDelete"
        @cancel="toDelete = null"
      />
    </Transition>
  </div>
</template>

<style scoped>
.product-list {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}
.product-list__scroll {
  overflow-x: auto;
}
.product-list__rows {
  display: flex;
  flex-direction: column;
}
.product-list__empty {
  padding: 24px;
  color: var(--c-text-muted);
  text-align: center;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.25s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
