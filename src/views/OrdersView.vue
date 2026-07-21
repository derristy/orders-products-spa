<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import OrderList from '@/components/orders/OrderList.vue'

const store = useStore()
const count = computed<number>(() => store.getters['orders/count'])

onMounted(() => {
  if (store.state.orders.items.length === 0) store.dispatch('orders/fetch')
})
</script>

<template>
  <section class="orders">
    <header class="orders__head">
      <button class="orders__add" :title="$t('orders.add')">＋</button>
      <h1 class="page-title">
        {{ $t('orders.title') }} <span class="page-title__count">/ {{ count }}</span>
      </h1>
    </header>

    <OrderList />
  </section>
</template>

<style scoped>
.orders__head {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
}
.orders__add {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--c-primary);
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(139, 197, 63, 0.4);
}
.orders__add:hover {
  background: var(--c-primary-dark);
}
.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--c-heading);
  margin: 0;
}
.page-title__count {
  color: var(--c-text-muted);
  font-weight: 400;
}
</style>
