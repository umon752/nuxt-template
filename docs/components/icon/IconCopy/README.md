# IconCopy

複製裝飾圖示，使用 `currentColor` 繼承父層文字顏色。

原始碼：[IconCopy.vue](../../../../app/components/icon/IconCopy.vue)

## 使用方式

    <button type="button" aria-label="複製內容">
      <IconCopy class="size-6" />
    </button>

元件沒有 Props、Slots 或 Events。圖示為 aria-hidden，複製按鈕的外層互動元素必須提供 accessible name。
