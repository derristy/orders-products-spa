<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import type { Order } from '@/types'
import OrderRow from './OrderRow.vue'
import OrderDetails from './OrderDetails.vue'
import DeleteOrderModal from './DeleteOrderModal.vue'

const store = useStore()

const orders = computed<Order[]>(() => store.state.orders.items)
const activeId = computed<number | null>(() => store.state.orders.activeOrderId)
const activeOrder = computed<Order | null>(() => store.getters['orders/activeOrder'])
const expanded = computed(() => activeOrder.value !== null)

const orderToDelete = ref<Order | null>(null)

function select(id: number) {
  store.commit('orders/setActive', id)
}
function closeDetails() {
  store.commit('orders/setActive', null)
}
function askDelete(order: Order) {
  orderToDelete.value = order
}
async function confirmDelete() {
  if (!orderToDelete.value) return
  await store.dispatch('orders/remove', orderToDelete.value.id)
  orderToDelete.value = null
}
</script>

<template>
  <div class="order-list" :class="{ 'order-list--expanded': expanded }">
    <div class="order-list__col">
      <TransitionGroup name="list" tag="div" class="order-list__rows">
        <OrderRow
          v-for="order in orders"
          :key="order.id"
          :order="order"
          :compact="expanded"
          :active="order.id === activeId"
          @select="select"
          @delete="askDelete"
        />
      </TransitionGroup>
    </div>

    <Transition name="panel">
      <div v-if="activeOrder" class="order-list__details">
        <OrderDetails :order="activeOrder" @close="closeDetails" />
      </div>
    </Transition>

    <Transition name="fade">
      <DeleteOrderModal
        v-if="orderToDelete"
        :order="orderToDelete"
        @confirm="confirmDelete"
        @cancel="orderToDelete = null"
      />
    </Transition>
  </div>
</template>

<style scoped>
.order-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: start;
}
.order-list--expanded {
  grid-template-columns: minmax(320px, 460px) 1fr;
}
.order-list__rows {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Row list transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
.list-leave-active {
  position: absolute;
  width: 100%;
}

/* Details panel transition */
.panel-enter-active,
.panel-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .order-list--expanded {
    grid-template-columns: 1fr;
  }
}
</style>
