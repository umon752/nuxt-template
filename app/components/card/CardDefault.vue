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

const {
  image,
  title,
  content = '',
  link = '',
  imgDefaultClass: imgDefaultClassProp = '',
  imgLoadedClass: imgLoadedClassProp = '',
  titleClass: titleClassProp = '',
  contentClass: contentClassProp = '',
} = defineProps<TProps>()

const imgDefaultClass = computed(() => cn(imgDefaultClassProp))
const imgLoadedClass = computed(() =>
  cn(
    'rounded-xl ease-out group-hover:scale-105 group-focus-within:scale-105 motion-reduce:scale-100',
    imgLoadedClassProp
  )
)
const titleClass = computed(() => cn('line-clamp-2 font-semibold', titleClassProp))
const contentClass = computed(() => cn(contentClassProp))
</script>

<template>
  <article class="group relative flex flex-col gap-2" :class="{ 'cursor-pointer': link }">
    <ImageLazyLoad :src="image" alt="" :class="imgDefaultClass" :img-class="imgLoadedClass" />
    <div>
      <h3 :class="titleClass">
        {{ title }}
      </h3>
      <p v-if="content" :class="contentClass">{{ content }}</p>
    </div>
    <NuxtLink v-if="link" :to="link" :aria-label="title" class="u-link-range" />
  </article>
</template>
