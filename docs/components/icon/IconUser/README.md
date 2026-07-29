# IconUser

使用者裝飾圖示，使用 `currentColor` 繼承父層文字顏色。

原始碼：[IconUser.vue](../../../../app/components/icon/IconUser.vue)

## 使用方式

```vue
<NuxtLink to="/account" aria-label="會員專區">
  <IconUser class="size-6" />
</NuxtLink>
```

元件沒有 Props、Slots 或 Events。圖示為 `aria-hidden`，外層互動元素必須提供 accessible name。
