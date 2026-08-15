<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'

import type { TLocaleCode } from '~/constants/locales'
import { useLocaleSwitcher } from '~/composables/useLocaleSwitcher'

export type TLanguageSwitcherInstance = {
  close: (restoreFocus?: boolean) => void
}

const { currentLocale, localeOptions } = useLocaleSwitcher()
const route = useRoute()
const emit = defineEmits<{
  open: []
  close: []
}>()

//----------------------------
// locale state
//----------------------------
const isOpen = ref(false)
const pendingFocusRestore = ref(false)
const rootElement = useTemplateRef<HTMLDivElement>('rootElement')
const triggerElement = useTemplateRef<HTMLButtonElement>('triggerElement')
const componentId = useId()
const triggerId = `language-switcher-trigger-${componentId}`
const menuId = `language-switcher-menu-${componentId}`

const currentLocaleLabel = computed(() => {
  return localeOptions.value.find((option) => option.code === currentLocale.value)?.label ?? ''
})

//----------------------------
// dropdown interactions
//----------------------------
const closeMenu = (restoreFocus = false): void => {
  if (!isOpen.value) {
    if (restoreFocus) {
      void nextTick(() => triggerElement.value?.focus())
    }

    return
  }

  isOpen.value = false
  emit('close')

  if (restoreFocus) {
    void nextTick(() => triggerElement.value?.focus())
  }
}

const openMenu = (): void => {
  if (isOpen.value) {
    return
  }

  isOpen.value = true
  emit('open')
}

const toggleMenu = (): void => {
  if (isOpen.value) {
    closeMenu(true)
    return
  }

  openMenu()
}

const handleLocaleSelect = (event: MouseEvent, targetLocale: TLocaleCode): void => {
  closeMenu()

  if (targetLocale === currentLocale.value) {
    event.preventDefault()
    void nextTick(() => triggerElement.value?.focus())
    return
  }

  pendingFocusRestore.value = true
}

const handleDocumentPointerdown = (event: PointerEvent): void => {
  const target = event.target

  if (target instanceof Node && rootElement.value?.contains(target)) {
    return
  }

  closeMenu()
}

//----------------------------
// lifecycle and cleanup
//----------------------------
watch(
  () => route.fullPath,
  () => {
    closeMenu()

    if (!pendingFocusRestore.value) {
      return
    }

    pendingFocusRestore.value = false
    void nextTick(() => triggerElement.value?.focus())
  }
)

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerdown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerdown)
})

defineExpose<TLanguageSwitcherInstance>({
  close: closeMenu,
})
</script>

<template>
  <div ref="rootElement" class="relative inline-flex">
    <button
      :id="triggerId"
      ref="triggerElement"
      type="button"
      :aria-controls="menuId"
      :aria-expanded="isOpen"
      :aria-label="$t('header.language.ariaLabel')"
      class="inline-flex items-center gap-1 rounded-sm text-sm hover:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
      @click="toggleMenu"
      @keydown.esc.prevent="closeMenu(true)"
    >
      <IconEarth aria-hidden="true" class="size-5 shrink-0" />
      <span>{{ currentLocaleLabel }}</span>
      <IconChevronDown
        aria-hidden="true"
        class="size-5 transition-transform duration-200 motion-reduce:transition-none"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
      enter-from-class="translate-y-1 opacity-0 motion-reduce:translate-y-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0 motion-reduce:translate-y-0"
    >
      <div
        v-if="isOpen"
        :id="menuId"
        :aria-labelledby="triggerId"
        :aria-label="$t('header.language.menuAriaLabel')"
        class="absolute top-full left-1/2 z-50 mt-2 min-w-32 -translate-x-1/2 pt-5"
      >
        <ul
          class="overflow-hidden rounded-xs bg-white text-sm shadow-lg"
          @keydown.esc.prevent="closeMenu(true)"
        >
          <li v-for="option in localeOptions" :key="option.code">
            <NuxtLink
              :to="option.to"
              :aria-current="option.isCurrent ? 'true' : undefined"
              :aria-label="$t('header.language.switchTo', { language: option.label })"
              class="block px-4 py-2 whitespace-nowrap hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none"
              :class="option.isCurrent ? 'font-semibold text-slate-900' : 'text-slate-700'"
              @click="handleLocaleSelect($event, option.code)"
            >
              {{ option.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
