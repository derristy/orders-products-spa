<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type { Group } from '@/types'
import GroupFormModal from '@/components/directories/GroupFormModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const store = useStore()
const { t } = useI18n()

const items = computed<Group[]>(() => store.state.groups.items)
const count = computed<number>(() => store.getters['groups/count'])

const editing = ref<Group | null>(null)
const showForm = ref(false)
const toDelete = ref<Group | null>(null)

onMounted(() => {
  if (items.value.length === 0) store.dispatch('groups/fetch')
})

function openCreate() {
  editing.value = null
  showForm.value = true
}
function openEdit(group: Group) {
  editing.value = group
  showForm.value = true
}
async function save(data: { name: string; description: string }) {
  await store.dispatch('groups/save', { id: editing.value?.id, data })
  showForm.value = false
}
async function confirmDelete() {
  if (!toDelete.value) return
  await store.dispatch('groups/remove', toDelete.value.id)
  toDelete.value = null
}
</script>

<template>
  <section>
    <header class="dir-head">
      <button class="dir-add" :title="$t('dir.addGroup')" @click="openCreate">＋</button>
      <h1 class="dir-title">
        {{ $t('dir.groupsTitle') }} <span class="dir-count">/ {{ count }}</span>
      </h1>
    </header>

    <TransitionGroup name="list" tag="div" class="dir-list">
      <article v-for="group in items" :key="group.id" class="dir-card">
        <span class="dir-card__avatar" aria-hidden="true">🗂</span>
        <div class="dir-card__main">
          <div class="dir-card__name">{{ group.name }}</div>
          <div class="dir-card__meta">{{ group.description }}</div>
        </div>
        <div class="dir-card__actions">
          <button class="dir-btn" :title="$t('dir.edit')" @click="openEdit(group)">✎</button>
          <button class="dir-btn dir-btn--danger" :title="$t('dir.delete')" @click="toDelete = group">
            🗑
          </button>
        </div>
      </article>
    </TransitionGroup>
    <p v-if="count === 0" class="dir-empty">{{ $t('dir.emptyGroups') }}</p>

    <Transition name="fade">
      <GroupFormModal v-if="showForm" :group="editing" @save="save" @cancel="showForm = false" />
    </Transition>
    <Transition name="fade">
      <ConfirmDialog
        v-if="toDelete"
        :message="t('dir.confirmDelete')"
        @confirm="confirmDelete"
        @cancel="toDelete = null"
      />
    </Transition>
  </section>
</template>

<style scoped src="@/assets/styles/directory.css"></style>
