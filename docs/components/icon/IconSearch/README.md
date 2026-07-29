# IconSearch

搜尋裝飾圖示，使用 `currentColor` 繼承父層文字顏色。

原始碼：[IconSearch.vue](../../../../app/components/icon/IconSearch.vue)

## 使用方式

```vue
<button type="button" aria-label="搜尋">
  <IconSearch class="size-6" />
</button>
```

元件沒有 Props、Slots 或 Events。圖示為 `aria-hidden`，外層互動元素必須提供 accessible name。
