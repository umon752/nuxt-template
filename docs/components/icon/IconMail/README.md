# IconMail

電子郵件裝飾圖示，使用 `currentColor` 繼承父層文字顏色。

原始碼：[IconMail.vue](../../../../app/components/icon/IconMail.vue)

## 使用方式

    <a href="mailto:hello@example.com" aria-label="寄送電子郵件">
      <IconMail class="size-6" />
    </a>

元件沒有 Props、Slots 或 Events。圖示為 aria-hidden，電子郵件連結的外層連結必須提供 accessible name。
