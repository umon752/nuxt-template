# Header

網站共用頁首，整合 Logo、API 選單、桌面下拉選單、會員／購物車入口、全站搜尋面板及手機選單。

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
- 從 `featureConfig` 控制會員、購物車、搜尋與語系切換入口是否顯示。
- 從 `a11yConfig.accessKeyLinks` 控制根節點的 access key 錨點是否顯示，預設為啟用。
- `featureConfig.languageSwitcher` 開啟時，右側工具列包含 `HeaderLanguageSwitcher`，提供 `zh-TW`／`en` 語系切換與目前語系標示；關閉時不渲染入口，直接進入非預設語系路徑也會回傳 404。
- 有 `href` 的父層選單同時提供父層連結與獨立的子選單切換按鈕；沒有 `href` 的父層只提供切換按鈕。
- 點擊搜尋按鈕會切換 `GlobalSearchPanel` 的開／關狀態；送出後導向 `/search?q=<keyword>`。
- 語系 dropdown、搜尋面板、手機選單與桌面下拉選單互斥；route 變更時關閉所有 header overlay。
- 以 `changeBreakpoint` 的內部設定決定桌機切換點，目前為 `md`。
- mounted 後以 `ResizeObserver` 取得根 `<header>` 高度，將結果同步到 `<html>` 的 `--nav-h` CSS variable；不支援 `ResizeObserver` 時回退到 `resize` 事件。
- 元件卸載時會清理搜尋面板 focus／事件、observer、fallback listener，並移除仍由本元件設定的 `--nav-h` 值。

根節點 ID 固定為 `U`；`a11yConfig.accessKeyLinks` 啟用時，內建 `accesskey="U"` 的 access key 錨點。
