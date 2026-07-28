<script setup lang="ts">
const { isVisible, scrollToTop } = useGoTop()
</script>

<template>
  <button
    type="button"
    class="bg-main-500 hover:bg-main-600 fixed right-4 bottom-4 z-40 inline-flex size-12 cursor-pointer items-center justify-center rounded-full text-white transition-[color,background-color,opacity,transform] duration-200 motion-reduce:transition-none sm:right-6 sm:bottom-6"
    :class="isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'"
    :aria-hidden="!isVisible"
    :aria-label="$t('components.goTop.ariaLabel')"
    :tabindex="isVisible ? undefined : -1"
    @click="scrollToTop"
  >
    <IconArrowUp />
  </button>
</template>
