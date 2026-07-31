<script setup lang="ts" generic="T extends { id: string | number }">
import type { ClassValue } from 'clsx'
import { A11y as SwiperA11y } from 'swiper/modules'
import type { A11yOptions, Swiper as TSwiper, SwiperOptions } from 'swiper/types'
import { Swiper as SwiperVue, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

import { cn } from '~/utils/cn'

export type TSwiperBaseInstance = {
  previous: () => void
  next: () => void
  goTo: (index: number) => void
  goToPage: (index: number) => void
  getSwiper: () => TSwiper | undefined
}

type TSwiperVueProps = InstanceType<typeof SwiperVue>['$props']

type TSwiperBaseOptions = Omit<
  Pick<TSwiperVueProps, Extract<keyof SwiperOptions, keyof TSwiperVueProps>>,
  'a11y' | 'modules'
>

type TProps = {
  items: T[]
  options?: TSwiperBaseOptions
  modules?: NonNullable<SwiperOptions['modules']>
  a11y?: A11yOptions
  ariaLabel?: string
  previousLabel?: string
  nextLabel?: string
  paginationLabel?: string
  swiperClass?: ClassValue
  slideClass?: ClassValue
  controlsClass?: ClassValue
  buttonClass?: ClassValue
  paginationClass?: ClassValue
  bulletClass?: ClassValue
  activeBulletClass?: ClassValue
  disabledClass?: ClassValue
}

const props = withDefaults(defineProps<TProps>(), {
  options: () => ({}),
  modules: () => [],
  a11y: () => ({}),
  ariaLabel: undefined,
  previousLabel: undefined,
  nextLabel: undefined,
  paginationLabel: undefined,
  swiperClass: '',
  slideClass: '',
  controlsClass: '',
  buttonClass: '',
  paginationClass: '',
  bulletClass: '',
  activeBulletClass: '',
  disabledClass: '',
})

const emit = defineEmits<{
  ready: [swiper: TSwiper]
  change: [index: number, swiper: TSwiper]
}>()

defineSlots<{
  slide?: (props: { item: T; index: number; isActive: boolean }) => unknown
  previous?: (props: { previous: () => void; disabled: boolean }) => unknown
  pagination?: (props: {
    activeIndex: number
    activeSlideIndex: number
    count: number
    goTo: (index: number) => void
  }) => unknown
  next?: (props: { next: () => void; disabled: boolean }) => unknown
}>()

const { t } = useI18n()
const swiperInstance = shallowRef<TSwiper>()
const isInitialized = ref(false)
const activeSlideIndex = ref(0)
const activePaginationIndex = ref(0)
const paginationCount = ref(props.items.length)
const isBeginning = ref(true)
const isEnd = ref(true)

const resolvedModules = computed(() => [...new Set([SwiperA11y, ...props.modules])])
const resolvedAriaLabel = computed(() => props.ariaLabel || t('components.swiperBase.ariaLabel'))
const resolvedPreviousLabel = computed(
  () => props.previousLabel || t('components.swiperBase.previous')
)
const resolvedNextLabel = computed(() => props.nextLabel || t('components.swiperBase.next'))
const resolvedPaginationLabel = computed(
  () => props.paginationLabel || t('components.swiperBase.pagination')
)
const resolvedA11y = computed<A11yOptions>(() => ({
  containerMessage: resolvedAriaLabel.value,
  containerRoleDescriptionMessage: t('components.swiperBase.roleDescription'),
  itemRoleDescriptionMessage: t('components.swiperBase.itemRoleDescription'),
  prevSlideMessage: resolvedPreviousLabel.value,
  nextSlideMessage: resolvedNextLabel.value,
  firstSlideMessage: t('components.swiperBase.first'),
  lastSlideMessage: t('components.swiperBase.last'),
  paginationBulletMessage: t('components.swiperBase.goToSlide', {
    index: '{{index}}',
  }),
  slideLabelMessage: t('components.swiperBase.slideLabel', {
    index: '{{index}}',
    total: '{{slidesLength}}',
  }),
  ...props.a11y,
}))
const canWrap = computed(() => props.options.loop === true || props.options.rewind === true)
const isPreviousDisabled = computed(() => !canWrap.value && isBeginning.value)
const isNextDisabled = computed(() => !canWrap.value && isEnd.value)
const swiperClassName = computed(() => cn(props.swiperClass))
const slideClassName = computed(() => cn('h-[stretch]!', props.slideClass))
const controlsClassName = computed(() =>
  cn('mt-5 flex items-center justify-center gap-4', props.controlsClass)
)
const paginationClassName = computed(() =>
  cn('flex flex-wrap items-center justify-center gap-2', props.paginationClass)
)

const getButtonClassName = (disabled: boolean): string =>
  cn(
    'inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-2 text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:cursor-not-allowed disabled:opacity-50',
    props.buttonClass,
    disabled && props.disabledClass
  )

const getBulletClassName = (isActive: boolean): string =>
  cn(
    'h-3 w-3 rounded-full bg-slate-300 transition-[width,background-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500',
    props.bulletClass,
    isActive && 'bg-main-500 w-8',
    isActive && props.activeBulletClass
  )

const syncState = (swiper: TSwiper): void => {
  activeSlideIndex.value = swiper.realIndex
  activePaginationIndex.value = swiper.snapIndex
  paginationCount.value = swiper.snapGrid.length
  isBeginning.value = swiper.isBeginning
  isEnd.value = swiper.isEnd
}

const handleSwiper = (swiper: TSwiper): void => {
  swiperInstance.value = swiper
  syncState(swiper)
  isInitialized.value = true
  emit('ready', swiper)
}

const handleSlideChange = (swiper: TSwiper): void => {
  syncState(swiper)
  emit('change', swiper.realIndex, swiper)
}

const previous = (): void => {
  swiperInstance.value?.slidePrev()
}

const next = (): void => {
  swiperInstance.value?.slideNext()
}

const goTo = (index: number): void => {
  const swiper = swiperInstance.value

  if (!swiper) {
    return
  }

  if (props.options.loop) {
    swiper.slideToLoop(index)
    return
  }

  swiper.slideTo(index)
}

const goToPage = (index: number): void => {
  const swiper = swiperInstance.value

  if (!swiper) {
    return
  }

  const slidesPerGroup =
    typeof swiper.params.slidesPerGroup === 'number' ? swiper.params.slidesPerGroup : 1
  const targetIndex = index * slidesPerGroup

  if (props.options.loop) {
    swiper.slideToLoop(targetIndex)
    return
  }

  swiper.slideTo(targetIndex)
}

const getSwiper = (): TSwiper | undefined => swiperInstance.value

defineExpose<TSwiperBaseInstance>({
  previous,
  next,
  goTo,
  goToPage,
  getSwiper,
})
</script>

<template>
  <div :class="{ invisible: !isInitialized }">
    <SwiperVue
      v-bind="props.options"
      :modules="resolvedModules"
      :a11y="resolvedA11y"
      :class="swiperClassName"
      @swiper="handleSwiper"
      @slide-change="handleSlideChange"
      @breakpoint="syncState"
      @update="syncState"
    >
      <SwiperSlide v-for="(item, index) in props.items" :key="item.id" :class="slideClassName">
        <slot name="slide" :item="item" :index="index" :is-active="activeSlideIndex === index" />
      </SwiperSlide>
    </SwiperVue>

    <div :class="controlsClassName">
      <slot name="previous" :previous="previous" :disabled="isPreviousDisabled">
        <button
          type="button"
          :class="getButtonClassName(isPreviousDisabled)"
          :disabled="isPreviousDisabled"
          :aria-label="resolvedPreviousLabel"
          @click="previous"
        >
          <span aria-hidden="true">&lsaquo;</span>
        </button>
      </slot>

      <slot
        name="pagination"
        :active-index="activePaginationIndex"
        :active-slide-index="activeSlideIndex"
        :count="paginationCount"
        :go-to="goToPage"
      >
        <div :class="paginationClassName" role="group" :aria-label="resolvedPaginationLabel">
          <button
            v-for="index in paginationCount"
            :key="index"
            type="button"
            :class="getBulletClassName(activePaginationIndex === index - 1)"
            :aria-label="t('components.swiperBase.goToSlide', { index })"
            :aria-current="activePaginationIndex === index - 1 ? 'true' : undefined"
            @click="goToPage(index - 1)"
          />
        </div>
      </slot>

      <slot name="next" :next="next" :disabled="isNextDisabled">
        <button
          type="button"
          :class="getButtonClassName(isNextDisabled)"
          :disabled="isNextDisabled"
          :aria-label="resolvedNextLabel"
          @click="next"
        >
          <span aria-hidden="true">&rsaquo;</span>
        </button>
      </slot>
    </div>
  </div>
</template>
