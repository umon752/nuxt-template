# IconHome

首頁裝飾圖示，使用 `currentColor` 繼承父層文字顏色。

原始碼：[IconHome.vue](../../../../app/components/icon/IconHome.vue)

## 使用方式

    <NuxtLink to="/" aria-label="首頁">
      <IconHome class="size-6" />
    </NuxtLink>

元件沒有 Props、Slots 或 Events。圖示為 aria-hidden，首頁連結的外層連結必須提供 accessible name。
