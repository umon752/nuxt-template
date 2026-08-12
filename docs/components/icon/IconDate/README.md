# IconDate

日期／日曆裝飾圖示，使用 `currentColor` 繼承父層文字顏色。

原始碼：[IconDate.vue](../../../../app/components/icon/IconDate.vue)

## 使用方式

    <button type="button" aria-label="選擇日期">
      <IconDate class="size-6" />
    </button>

元件沒有 Props、Slots 或 Events。圖示為 aria-hidden，日期選擇按鈕的外層互動元素必須提供 accessible name。
