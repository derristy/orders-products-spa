<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import ProductFilters from '@/components/products/ProductFilters.vue'
import ProductList from '@/components/products/ProductList.vue'

const store = useStore()
const count = computed<number>(() => store.getters['products/count'])

onMounted(() => {
  if (store.state.products.items.length === 0) store.dispatch('products/fetch')
})
</script>

<template>
  <section class="products">
    <h1 class="page-title">Продукты <span class="page-title__count">/ {{ count }}</span></h1>
    <ProductFilters />
    <ProductList />
  </section>
</template>

<style scoped>
.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--c-heading);
  margin: 0 0 24px;
}
.page-title__count {
  color: var(--c-text-muted);
  font-weight: 400;
}
</style>
