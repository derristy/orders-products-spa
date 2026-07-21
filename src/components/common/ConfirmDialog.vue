<script setup lang="ts">
defineProps<{ message: string }>()
const emit = defineEmits<{ (e: 'confirm'): void; (e: 'cancel'): void }>()
</script>

<template>
  <div class="confirm-dialog" @click.self="emit('cancel')">
    <div class="confirm-dialog__box" role="dialog" aria-modal="true">
      <p class="confirm-dialog__msg">{{ message }}</p>
      <div class="confirm-dialog__actions">
        <button class="confirm-dialog__btn confirm-dialog__btn--ghost" @click="emit('cancel')">
          {{ $t('dir.cancel') }}
        </button>
        <button class="confirm-dialog__btn confirm-dialog__btn--danger" @click="emit('confirm')">
          {{ $t('dir.delete') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-dialog {
  position: fixed;
  inset: 0;
  background: rgba(60, 70, 90, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  overflow-y: auto;
}
.confirm-dialog__box {
  background: var(--c-surface);
  border-radius: 10px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  padding: 28px 30px;
  max-width: 420px;
  width: 100%;
}
.confirm-dialog__msg {
  font-size: 16px;
  font-weight: 600;
  color: var(--c-heading);
  margin: 0 0 20px;
}
.confirm-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.confirm-dialog__btn {
  border: none;
  cursor: pointer;
  font-weight: 700;
  border-radius: var(--radius);
  padding: 10px 22px;
}
.confirm-dialog__btn--ghost {
  background: #f2f4f8;
  color: var(--c-text);
}
.confirm-dialog__btn--danger {
  background: var(--c-danger);
  color: #fff;
}
</style>
