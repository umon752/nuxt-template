# IconUpload

上傳裝飾圖示，使用 `currentColor` 繼承父層文字顏色。

原始碼：[IconUpload.vue](../../../../app/components/icon/IconUpload.vue)

## 使用方式

    <button type="button" aria-label="上傳檔案">
      <IconUpload class="size-6" />
    </button>

元件沒有 Props、Slots 或 Events。圖示為 aria-hidden，上傳按鈕的外層互動元素必須提供 accessible name。
