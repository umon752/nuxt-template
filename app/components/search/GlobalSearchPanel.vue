<script setup lang="ts">
import { nextTick, onBeforeUnmount, watch } from 'vue'

import { searchConfig } from '~/config/search'

type TProps = {
  open: boolean
  suggestions?: readonly string[]
  initialQuery?: string
  panelId?: string
}

defineOptions({ name: 'GlobalSearchPanel' })

const {
  open,
  suggestions = [],
  initialQuery = '',
  panelId = 'global-search-panel',
} = defineProps<TProps>()

const emit = defineEmits<{
  close: []
  submit: [query: string]
}>()

const query = ref(initialQuery)
const panelElement = useTemplateRef<HTMLElement>('panelElement')
const inputElement = useTemplateRef<HTMLInputElement>('inputElement')
const inputId = `${panelId}-input`
const suggestionsTitleId = `${panelId}-suggestions-title`

const removeDocumentListeners = (): void => {
  if (!import.meta.client) {
    return
  }

  document.removeEventListener('keydown', handleDocumentKeydown)
  document.removeEventListener('pointerdown', handleDocumentPointerdown)
}

const focusInput = async (): Promise<void> => {
  await nextTick()

  if (!open) {
    return
  }

  inputElement.value?.focus()
}

const handleDocumentKeydown = (event: KeyboardEvent): void => {
  if (event.key !== 'Escape') {
    return
  }

  event.preventDefault()
  emit('close')
}

const handleDocumentPointerdown = (event: PointerEvent): void => {
  const target = event.target

  if (!(target instanceof Node) || panelElement.value?.contains(target)) {
    return
  }

  emit('close')
}

watch(
  () => open,
  async (isOpen, _previousOpen, onCleanup) => {
    removeDocumentListeners()

    if (!isOpen || !import.meta.client) {
      return
    }

    query.value = initialQuery
    await focusInput()

    if (!open) {
      return
    }

    document.addEventListener('keydown', handleDocumentKeydown)
    document.addEventListener('pointerdown', handleDocumentPointerdown)
    onCleanup(removeDocumentListeners)
  },
  { immediate: true }
)

watch(
  () => initialQuery,
  (value) => {
    if (!open) {
      query.value = value
    }
  }
)

onBeforeUnmount(removeDocumentListeners)

const submitSearch = (): void => {
  const normalizedQuery = query.value.trim().replace(/\s+/g, ' ')

  if (!normalizedQuery) {
    void focusInput()
    return
  }

  emit('submit', normalizedQuery)
}

const selectSuggestion = (suggestion: string): void => {
  query.value = suggestion
  emit('submit', suggestion)
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
    enter-from-class="-translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-2 opacity-0"
  >
    <div v-if="open" class="absolute top-full left-0 z-50 w-full">
      <div class="fixed inset-0 top-[var(--nav-h)] bg-slate-950/25" aria-hidden="true" />

      <section
        :id="panelId"
        ref="panelElement"
        :aria-describedby="suggestions.length ? suggestionsTitleId : undefined"
        class="relative max-h-[calc(100dvh-var(--nav-h))] overflow-y-auto bg-[#202126] text-white shadow-2xl"
      >
        <div class="container max-w-5xl py-7 sm:py-8">
          <div class="flex items-start gap-4">
            <form class="min-w-0 flex-1" role="search" @submit.prevent="submitSearch">
              <label :for="inputId" class="sr-only">
                {{ $t('search.panel.inputLabel') }}
              </label>
              <div class="relative border-b border-white/80">
                <input
                  :id="inputId"
                  ref="inputElement"
                  v-model="query"
                  type="search"
                  :maxlength="searchConfig.maxQueryLength"
                  autocomplete="off"
                  :placeholder="$t('search.panel.placeholder')"
                  class="w-full bg-transparent py-2 pr-10 text-base text-white outline-none placeholder:text-white/70"
                />
                <button
                  type="submit"
                  :aria-label="$t('search.panel.submit')"
                  class="absolute right-0 bottom-1 inline-flex size-9 items-center justify-center rounded-full text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <IconSearch />
                </button>
              </div>
            </form>

            <button
              type="button"
              :aria-label="$t('search.panel.close')"
              class="absolute top-7 right-7 inline-flex shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              @click="emit('close')"
            >
              <IconClose />
            </button>
          </div>

          <div v-if="suggestions.length" class="mt-7">
            <h2 :id="suggestionsTitleId" class="sr-only">
              {{ $t('search.panel.suggestionsTitle') }}
            </h2>
            <ul class="flex flex-wrap gap-2">
              <li v-for="suggestion in suggestions" :key="suggestion">
                <BtnDefault
                  type="button"
                  btn-class="hover:bg-main-500 hover:border-main-500 border border-white/75 bg-transparent"
                  :text="suggestion"
                  @click="selectSuggestion(suggestion)"
                />
                <!-- <button
                  type="button"
                  class="rounded-sm border border-white/75 px-3 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
                  @click="selectSuggestion(suggestion)"
                >
                  {{ suggestion }}
                </button> -->
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </Transition>
</template>
