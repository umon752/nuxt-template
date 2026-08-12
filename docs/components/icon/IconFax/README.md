# IconFax

傳真裝飾圖示，使用 `currentColor` 繼承父層文字顏色。

原始碼：[IconFax.vue](../../../../app/components/icon/IconFax.vue)

## 使用方式

    <a href="tel:02-1234-5678" aria-label="傳真 02-1234-5678">
      <IconFax class="size-6" />
    </a>

元件沒有 Props、Slots 或 Events。圖示為 aria-hidden，傳真或聯絡資訊的外層連結必須提供可辨識的 accessible name。
