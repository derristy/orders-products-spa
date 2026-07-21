<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const types = computed<string[]>(() => store.getters['products/types'])
const specs = computed<string[]>(() => store.getters['products/specifications'])
const typeFilter = computed<string | null>(() => store.state.products.typeFilter)
const specFilter = computed<string | null>(() => store.state.products.specFilter)

function onType(e: Event) {
  const v = (e.target as HTMLSelectElement).value
  store.commit('products/setTypeFilter', v || null)
}
function onSpec(e: Event) {
  const v = (e.target as HTMLSelectElement).value
  store.commit('products/setSpecFilter', v || null)
}
</script>

<template>
  <div class="filters">
    <label class="filters__field">
      <span class="filters__label">{{ $t('filters.type') }}:</span>
      <select class="filters__select" :value="typeFilter ?? ''" @change="onType">
        <option value="">{{ $t('filters.allTypes') }}</option>
        <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
      </select>
    </label>

    <label class="filters__field">
      <span class="filters__label">{{ $t('filters.spec') }}:</span>
      <select class="filters__select" :value="specFilter ?? ''" @change="onSpec">
        <option value="">{{ $t('filters.all') }}</option>
        <option v-for="s in specs" :key="s" :value="s">{{ s }}</option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.filters__field {
  display: flex;
  align-items: center;
  gap: 10px;
}
.filters__label {
  color: var(--c-text-muted);
  font-size: 13px;
}
.filters__select {
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  padding: 8px 14px;
  font-size: 14px;
  background: var(--c-surface);
  color: var(--c-heading);
  min-width: 180px;
  cursor: pointer;
  outline: none;
}
.filters__select:focus {
  border-color: var(--c-primary);
}
</style>
