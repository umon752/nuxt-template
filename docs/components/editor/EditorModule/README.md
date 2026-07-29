# EditorModule

依模組資料渲染文字、圖文、單圖、程式碼及雙圖內容版型。

原始碼：[EditorModule.vue](../../../../app/components/editor/EditorModule.vue)

## 使用方式

```vue
<script setup lang="ts">
import type { TEditorModule } from '~/components/editor/EditorModule.vue'

const modules: TEditorModule[] = [
  { id: 'intro', type: 'text', html: '<p>文章內容</p>' },
  {
    id: 'feature',
    type: 'image-left',
    html: '<p>圖文內容</p>',
    image: { src: '/images/demo/test-img.jpg', alt: '示意圖' },
  },
  { id: 'code', type: 'code', code: "console.log('Hello')" },
]
</script>

<template><EditorModule :modules="modules" /></template>
```

| Prop      | 型別              | 說明                           |
| --------- | ----------------- | ------------------------------ |
| `modules` | `TEditorModule[]` | 模組陣列，每筆 `id` 必須唯一。 |

支援的 `type`：`text`、`image-left`、`image-right`、`image`、`code`、`images`。文字模組最終交由 `EditorContent` 輸出，因此 HTML 也必須先完成消毒。
