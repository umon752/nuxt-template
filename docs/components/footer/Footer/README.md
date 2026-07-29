# Footer

網站共用頁尾，包含 access key 錨點與版權文字。

原始碼：[Footer.vue](../../../../app/components/footer/Footer.vue)

## 使用方式

```vue
<template>
  <div class="min-h-screen">
    <slot />
    <Footer />
  </div>
</template>
```

元件沒有 Props、Slots 或 Events。根節點 ID 固定為 `Z`，並內建 `accesskey="Z"` 的 `A11yAccessKeyLink`。
