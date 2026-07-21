<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import OrderList from '@/components/orders/OrderList.vue'
import CreateOrderModal from '@/components/orders/CreateOrderModal.vue'

const store = useStore()
const count = computed<number>(() => store.getters['orders/count'])
const showCreate = ref(false)

onMounted(() => {
  if (store.state.orders.items.length === 0) store.dispatch('orders/fetch')
})

async function create(data: { title: string; description: string }) {
  await store.dispatch('orders/create', data)
  showCreate.value = false
}
</script>

<template>
  <section class="orders">
    <header class="orders__head">
      <button class="orders__add" :title="$t('orders.add')" @click="showCreate = true">＋</button>
      <h1 class="page-title">
        {{ $t('orders.title') }} <span class="page-title__count">/ {{ count }}</span>
      </h1>
    </header>

    <OrderList />

    <Transition name="fade">
      <CreateOrderModal v-if="showCreate" @create="create" @cancel="showCreate = false" />
    </Transition>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
