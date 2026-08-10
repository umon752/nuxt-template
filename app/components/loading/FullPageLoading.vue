<script setup lang="ts">
const { t } = useI18n()
const { isLoading, label } = useFullPageLoading()

const resolvedLabel = computed(() => label.value || t('components.loading.defaultLabel'))

let previousBodyOverflow: string | undefined

const restoreBodyOverflow = (): void => {
  if (!import.meta.client || previousBodyOverflow === undefined) {
    return
  }

  document.body.style.overflow = previousBodyOverflow
  previousBodyOverflow = undefined
}

watch(
  isLoading,
  (loading) => {
    if (!import.meta.client) {
      return
    }

    if (loading) {
      previousBodyOverflow ??= document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return
    }

    restoreBodyOverflow()
  },
  { immediate: true }
)

onBeforeUnmount(restoreBodyOverflow)
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-150"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[99999] flex h-full w-full items-center justify-center bg-slate-950/65 px-5 text-white backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      :aria-label="resolvedLabel"
    >
      <slot :label="resolvedLabel">
        <LoadingSpinner spinner-class="text-white" />
      </slot>
    </div>
  </Transition>
</template>
