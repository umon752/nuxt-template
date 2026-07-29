# SkipLink

提供鍵盤使用者直接跳至 `#main-content` 的略過導覽連結。

原始碼：[SkipLink.vue](../../../../app/components/a11y/SkipLink.vue)

## 使用方式

```vue
<template>
  <A11ySkipLink />
  <Header />
  <main id="main-content" tabindex="-1">
    <slot />
  </main>
</template>
```

元件沒有 Props、Slots 或 Events。連結文字取自 `a11y.skipLink`，目標頁面必須存在 `id="main-content"`。
