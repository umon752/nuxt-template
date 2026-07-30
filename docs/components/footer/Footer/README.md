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

版權起始年固定為 2026，網站名稱取自 `site.name`。目前年份仍為 2026 時顯示 `© 2026 網站名稱`；自 2027 年起則自動顯示年份範圍，例如 `© 2026–2027 網站名稱`。完整文字由 `components.footer.copyright` 組合 `{year}` 與 `{name}`。
