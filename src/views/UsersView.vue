<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type { User } from '@/types'
import UserFormModal from '@/components/directories/UserFormModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const store = useStore()
const { t } = useI18n()

const items = computed<User[]>(() => store.state.users.items)
const count = computed<number>(() => store.getters['users/count'])

const editing = ref<User | null>(null)
const showForm = ref(false)
const toDelete = ref<User | null>(null)

onMounted(() => {
  if (items.value.length === 0) store.dispatch('users/fetch')
})

function openCreate() {
  editing.value = null
  showForm.value = true
}
function openEdit(user: User) {
  editing.value = user
  showForm.value = true
}
async function save(data: { name: string; email: string; role: string }) {
  await store.dispatch('users/save', { id: editing.value?.id, data })
  showForm.value = false
}
async function confirmDelete() {
  if (!toDelete.value) return
  await store.dispatch('users/remove', toDelete.value.id)
  toDelete.value = null
}

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
</script>

<template>
  <section>
    <header class="dir-head">
      <button class="dir-add" :title="$t('dir.addUser')" @click="openCreate">＋</button>
      <h1 class="dir-title">
        {{ $t('dir.usersTitle') }} <span class="dir-count">/ {{ count }}</span>
      </h1>
    </header>

    <TransitionGroup name="list" tag="div" class="dir-list">
      <article v-for="user in items" :key="user.id" class="dir-card">
        <span class="dir-card__avatar">{{ initials(user.name) }}</span>
        <div class="dir-card__main">
          <div class="dir-card__name">{{ user.name }}</div>
          <div class="dir-card__meta">{{ user.email }}</div>
        </div>
        <span class="dir-card__role">{{ user.role }}</span>
        <div class="dir-card__actions">
          <button class="dir-btn" :title="$t('dir.edit')" @click="openEdit(user)">✎</button>
          <button class="dir-btn dir-btn--danger" :title="$t('dir.delete')" @click="toDelete = user">
            🗑
          </button>
        </div>
      </article>
    </TransitionGroup>
    <p v-if="count === 0" class="dir-empty">{{ $t('dir.emptyUsers') }}</p>

    <Transition name="fade">
      <UserFormModal v-if="showForm" :user="editing" @save="save" @cancel="showForm = false" />
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
