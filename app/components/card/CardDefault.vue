<script setup lang="ts">
import type { ClassValue } from 'clsx'
import { cn } from '~/utils/cn'

type TProps = {
  image: string
  title: string
  content?: string
  link?: string
  imgDefaultClass?: ClassValue
  imgLoadedClass?: ClassValue
  titleClass?: ClassValue
  contentClass?: ClassValue
}

const props = withDefaults(defineProps<TProps>(), {
  content: '',
  link: '',
  imgDefaultClass: '',
  imgLoadedClass: '',
  titleClass: '',
  contentClass: '',
})

const imgDefaultClass = computed(() => cn(props.imgDefaultClass))
const imgLoadedClass = computed(() =>
  cn(
    'rounded-xl ease-out group-hover:scale-105 group-focus-within:scale-105 motion-reduce:scale-100',
    props.imgLoadedClass
  )
)
const titleClass = computed(() => cn('line-clamp-2 font-semibold', props.titleClass))
const contentClass = computed(() => cn(props.contentClass))
</script>

<template>
  <article class="group relative flex flex-col gap-2" :class="{ 'cursor-pointer': props.link }">
    <ImageLazyLoad :src="props.image" alt="" :class="imgDefaultClass" :img-class="imgLoadedClass" />
    <div>
      <h3 :class="titleClass">
        {{ props.title }}
      </h3>
      <p v-if="props.content" :class="contentClass">{{ props.content }}</p>
    </div>
    <NuxtLink v-if="props.link" :to="props.link" :aria-label="props.title" class="u-link-range" />
  </article>
</template>
