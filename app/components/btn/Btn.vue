<script setup lang="ts">
const { text } = defineProps({
  text: {
    type: String,
    default: '按鈕',
  },
})
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center rounded-md border border-slate-900 bg-slate-900 px-3 py-2 font-medium text-white transition-colors hover:border-slate-900 hover:bg-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
  >
    {{ text }}
  </button>
</template>
