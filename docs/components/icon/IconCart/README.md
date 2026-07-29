# IconCart

購物車裝飾圖示，使用 `currentColor` 繼承父層文字顏色。

原始碼：[IconCart.vue](../../../../app/components/icon/IconCart.vue)

## 使用方式

```vue
<NuxtLink to="/cart" aria-label="購物車">
  <IconCart class="size-6" />
</NuxtLink>
```

元件沒有 Props、Slots 或 Events。圖示為 `aria-hidden`，外層互動元素必須提供 accessible name。
