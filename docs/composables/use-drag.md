# useDrag 使用說明

`useDrag` 將可水平捲動的元素轉換成可按住拖曳的區域，適合卡片列表、分類導覽或其他橫向內容。它使用 Pointer Events，並在拖曳結束時清理事件及恢復互動元素狀態。

原始碼：[useDrag.ts](../../app/composables/useDrag.ts)

## 基本使用

建立捲動容器的 template ref，並傳給 `useDrag`：

```vue
<script setup lang="ts">
const dragTarget = useTemplateRef<HTMLElement>('dragTarget')

const { isDragging } = useDrag({
  target: dragTarget,
})
</script>

<template>
  <div
    ref="dragTarget"
    class="touch-pan-y overflow-x-auto select-none"
    :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
  >
    <div class="flex w-max gap-4">
      <article v-for="index in 8" :key="index" class="w-64 shrink-0">項目 {{ index }}</article>
    </div>
  </div>
</template>
```

容器必須允許水平捲動，例如使用 `overflow-x-auto`。內容寬度也必須超過容器，可使用 `w-max`、固定寬度或其他版面配置達成。

觸控裝置建議加入 `touch-action: pan-y`，在保留垂直原生捲動的同時，讓 composable 處理水平拖曳。Tailwind 對應 class 為 `touch-pan-y`。

## 防止拖曳時誤點

如果橫向項目包含按鈕或連結，可透過 `interactiveElements` 傳入這些元素的 template ref：

```vue
<script setup lang="ts">
const dragTarget = useTemplateRef<HTMLElement>('dragTarget')
const dragButtons = useTemplateRef<HTMLElement[]>('dragButtons')

const { isDragging } = useDrag({
  target: dragTarget,
  interactiveElements: dragButtons,
  dragThreshold: 3,
})
</script>

<template>
  <div ref="dragTarget" class="touch-pan-y overflow-x-auto">
    <div class="flex w-max gap-4">
      <button v-for="index in 8" :key="index" ref="dragButtons" type="button" class="w-64 shrink-0">
        項目 {{ index }}
      </button>
    </div>
  </div>
</template>
```

超過拖曳門檻後，composable 才會暫時停用指定元素的 `pointer-events` 並 capture pointer；結束時恢復原本的 inline style，並阻止該次拖曳產生的 click。未超過拖曳門檻的一般點擊不受影響。

## Options

| 選項                  | 型別                                                         | 預設值      | 說明                                                   |
| --------------------- | ------------------------------------------------------------ | ----------- | ------------------------------------------------------ |
| `target`              | `Readonly<Ref<HTMLElement \| null \| undefined>>`            | 必填        | 要綁定拖曳事件的水平捲動容器                           |
| `interactiveElements` | `Readonly<Ref<readonly HTMLElement[] \| null \| undefined>>` | `undefined` | 拖曳時暫停互動的按鈕、連結或其他元素                   |
| `dragThreshold`       | `number`                                                     | `3`         | 指標水平移動多少像素後才視為拖曳；負值會被正規化為 `0` |

## 回傳值

| 名稱         | 型別                     | 說明                           |
| ------------ | ------------------------ | ------------------------------ |
| `isDragging` | `Readonly<Ref<boolean>>` | 是否已超過門檻且正在拖曳       |
| `stop`       | `() => void`             | 手動停止目前拖曳並恢復互動元素 |

## 注意事項

- `useDrag` 只會在 client 端綁定 DOM 事件，可安全用於 Nuxt SSR。
- 容器 ref 改變時會自動移除舊事件並綁定新元素。
- 元件卸載時會自動停止拖曳並清除事件，不需要手動呼叫 `stop()`。
- `interactiveElements` 應指向實際 DOM 元素；若使用自訂 Vue 元件，請確認 template ref 取得的是公開元件實例還是 HTMLElement。
- 完整頁面範例位於 `app/pages/sample.vue` 的「useDrag 水平拖曳捲動」區塊。
