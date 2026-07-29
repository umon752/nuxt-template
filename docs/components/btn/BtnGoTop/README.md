# BtnGoTop

依捲動位置顯示的回到頁首按鈕，由 `useGoTop()` 控制可見狀態與平滑捲動。

原始碼：[BtnGoTop.vue](../../../../app/components/btn/BtnGoTop.vue)

## 使用方式

通常放在預設 layout 最後：

```vue
<template>
  <main><slot /></main>
  <BtnGoTop />
</template>
```

元件沒有 Props、Slots 或 Events。隱藏時會移出 tab 順序並加上 `aria-hidden`；按鈕標籤取自 `components.goTop.ariaLabel`。
