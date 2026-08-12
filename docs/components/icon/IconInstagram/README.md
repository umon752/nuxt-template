# IconInstagram

Instagram 品牌裝飾圖示，使用 `currentColor` 繼承父層文字顏色。

原始碼：[IconInstagram.vue](../../../../app/components/icon/IconInstagram.vue)

## 使用方式

    <NuxtLink to="https://www.instagram.com/" aria-label="Instagram">
      <IconInstagram class="size-6" />
    </NuxtLink>

元件沒有 Props、Slots 或 Events。圖示為 aria-hidden，社群連結的外層連結必須提供 accessible name。
