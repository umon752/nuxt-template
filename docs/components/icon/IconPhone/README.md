# IconPhone

電話裝飾圖示，使用 `currentColor` 繼承父層文字顏色。

原始碼：[IconPhone.vue](../../../../app/components/icon/IconPhone.vue)

## 使用方式

    <a href="tel:02-1234-5678" aria-label="電話 02-1234-5678">
      <IconPhone class="size-6" />
    </a>

元件沒有 Props、Slots 或 Events。圖示為 aria-hidden，電話連結的外層連結必須提供 accessible name。
