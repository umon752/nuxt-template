# Accordion

可展開與收合內容的受控手風琴元件，支援單項或多項同時展開及客製 slot。展開狀態由父層持有，元件透過事件請求更新。

原始碼：[Accordion.vue](../../../app/components/Accordion.vue)

## 基本使用

```vue
<script setup lang="ts">
const items = [
  { title: '項目一', content: '內容一' },
  { title: '項目二', content: '內容二' },
]

const activeItems = ref<number[]>([])
</script>

<template>
  <Accordion
    v-model:active-items="activeItems"
    :items="items"
    @toggle="(index, active) => console.log(index, active)"
  />
</template>
```

## API

| Prop             | 型別               | 預設值 | 說明                                                                |
| ---------------- | ------------------ | ------ | ------------------------------------------------------------------- |
| `items`          | `TAccordionItem[]` | 必填   | 項目資料；內建顯示 `title`、`content`，亦可帶自訂欄位供 slot 使用。 |
| `activeItems`    | `number[]`         | 必填   | 目前展開項目的索引；可使用 `v-model:active-items`。                 |
| `collapseOthers` | `boolean`          | `true` | 展開項目時是否收合其他項目。                                        |
| `accordionClass` | `ClassValue`       | `''`   | 每個項目外層 class。                                                |
| `titleClass`     | `ClassValue`       | `''`   | 標題按鈕 class。                                                    |
| `contentClass`   | `ClassValue`       | `''`   | 內容區 class。                                                      |

Slots：`title` 提供 `item`、`index`、`isActive`；`content` 提供 `item`、`index`。

事件：

- `update:activeItems`：回傳下一組展開索引，供 `v-model:active-items` 更新父層狀態。
- `toggle`：回傳操作的 `index` 與更新後的展開狀態。
