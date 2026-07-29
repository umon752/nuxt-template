# Accordion

可展開與收合內容的手風琴元件，支援單項或多項同時展開、客製 slot，以及透過元件 `ref` 控制狀態。

原始碼：[Accordion.vue](../../../app/components/Accordion.vue)

## 基本使用

```vue
<script setup lang="ts">
const items = [
  { title: '項目一', content: '內容一' },
  { title: '項目二', content: '內容二' },
]
</script>

<template>
  <Accordion :items="items" @toggle="(index, active) => console.log(index, active)" />
</template>
```

## API

| Prop             | 型別               | 預設值 | 說明                                                                |
| ---------------- | ------------------ | ------ | ------------------------------------------------------------------- |
| `items`          | `TAccordionItem[]` | 必填   | 項目資料；內建顯示 `title`、`content`，亦可帶自訂欄位供 slot 使用。 |
| `collapseOthers` | `boolean`          | `true` | 展開項目時是否收合其他項目。                                        |
| `defaultActive`  | `number[]`         | `[]`   | 初始展開項目的索引。                                                |
| `accordionClass` | `ClassValue`       | `''`   | 每個項目外層 class。                                                |
| `titleClass`     | `ClassValue`       | `''`   | 標題按鈕 class。                                                    |
| `contentClass`   | `ClassValue`       | `''`   | 內容區 class。                                                      |

Slots：`title` 提供 `item`、`index`、`isActive`；`content` 提供 `item`、`index`。事件 `toggle` 回傳 `index` 與新狀態。

公開方法：`expand(index)`、`collapse(index)`、`expandAll()`、`collapseAll()`；`activeItems` 可讀取目前展開索引。
