<script setup lang="ts">
import EditorContent from './EditorContent.vue'

export type TEditorImage = {
  src: string
  alt?: string
}

type TEditorTextModule = {
  id: string
  type: 'text'
  html: string
}

type TEditorImageTextModule = {
  id: string
  type: 'image-left' | 'image-right'
  html: string
  image: TEditorImage
}

type TEditorSingleImageModule = {
  id: string
  type: 'image'
  image: TEditorImage
}

type TEditorCodeModule = {
  id: string
  type: 'code'
  code: string
}

type TEditorImagesModule = {
  id: string
  type: 'images'
  images: TEditorImage[]
}

export type TEditorModule =
  | TEditorTextModule
  | TEditorImageTextModule
  | TEditorSingleImageModule
  | TEditorCodeModule
  | TEditorImagesModule

type TProps = {
  modules: TEditorModule[]
}

defineProps<TProps>()
</script>

<template>
  <div class="space-y-4">
    <template v-for="module in modules" :key="module.id">
      <!-- 文字段落 -->
      <div v-if="module.type === 'text'" :id="module.id">
        <div class="flex w-full flex-wrap justify-center">
          <EditorContent :html="module.html" />
        </div>
      </div>

      <!-- 左圖右文 -->
      <div v-else-if="module.type === 'image-left'" :id="module.id">
        <div class="flex w-full flex-wrap gap-4 md:flex-nowrap">
          <div class="w-full md:w-1/2">
            <img :src="module.image.src" :alt="module.image.alt ?? ''" />
          </div>
          <div class="w-full md:w-1/2">
            <EditorContent :html="module.html" />
          </div>
        </div>
      </div>

      <!-- 右圖左文 -->
      <div v-else-if="module.type === 'image-right'" :id="module.id">
        <div class="flex w-full flex-wrap gap-4 md:flex-nowrap">
          <div class="w-full md:order-2 md:w-1/2">
            <img :src="module.image.src" :alt="module.image.alt ?? ''" />
          </div>
          <div class="w-full md:w-1/2">
            <EditorContent :html="module.html" />
          </div>
        </div>
      </div>

      <!-- 單張圖片 -->
      <div v-else-if="module.type === 'image'" :id="module.id">
        <div class="flex w-full flex-wrap">
          <div class="w-full">
            <img :src="module.image.src" :alt="module.image.alt ?? ''" />
          </div>
        </div>
      </div>

      <!-- 程式碼 -->
      <div v-else-if="module.type === 'code'" :id="module.id">
        <pre class="w-full"><code>{{ module.code }}</code></pre>
      </div>

      <!-- 左圖右圖 -->
      <div v-else-if="module.type === 'images'" :id="module.id">
        <div class="flex w-full flex-wrap gap-4 md:flex-nowrap">
          <div v-for="(image, index) in module.images" :key="index" class="w-full md:w-1/2">
            <img :src="image.src" :alt="image.alt ?? ''" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
