# IconEarth

地球裝飾圖示，使用 `currentColor` 繼承父層文字顏色。

原始碼：[IconEarth.vue](../../../../app/components/icon/IconEarth.vue)

## 使用方式

    <button type="button" aria-label="切換語言">
      <IconEarth class="size-6" />
    </button>

元件沒有 Props、Slots 或 Events。圖示為 aria-hidden，語言或地區選擇按鈕的外層互動元素必須提供 accessible name。
