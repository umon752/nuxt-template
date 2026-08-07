# Header

網站共用頁首，整合 Logo、API 選單、桌面下拉選單、會員／購物車／搜尋連結及手機選單。

原始碼：[Header.vue](../../../../app/components/header/Header.vue)

延伸閱讀：[Header 選單開發與使用說明](header-menu-guide.md)

## 使用方式

```vue
<template>
  <A11ySkipLink />
  <Header />
  <main id="main-content"><slot /></main>
</template>
```

元件沒有 Props、Slots 或 Events。它會：

- 從 `useMenu()` 取得 `/api/menu` 資料。
- 從 `siteConfig.logo` 取得 Logo。
- 使用 i18n 的 `header.*` 文字作為導覽及圖示連結標籤。
- 在 route 變更時關閉桌面與手機選單。
- 以 `changeBreakpoint` 的內部設定決定桌機切換點，目前為 `md`。
- mounted 後以 `ResizeObserver` 取得根 `<header>` 高度，將結果同步到 `<html>` 的 `--nav-h` CSS variable；不支援 `ResizeObserver` 時回退到 `resize` 事件。
- 元件卸載時會清理 observer、fallback listener，並移除仍由本元件設定的 `--nav-h` 值。

根節點 ID 固定為 `U`，並內建 `accesskey="U"` 的 access key 錨點。
