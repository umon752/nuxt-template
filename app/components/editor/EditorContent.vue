<script setup lang="ts">
type TProps = {
  html: string
}

defineProps<TProps>()
</script>

<template>
  <!-- html 必須由資料來源完成消毒後再傳入。 -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="editor" v-html="html" />
</template>
