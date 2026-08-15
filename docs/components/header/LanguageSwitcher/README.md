# LanguageSwitcher

Header 使用的語系切換下拉選單，提供繁體中文與英文路由切換、目前語系標示、鍵盤操作與 focus 還原。

原始碼：[LanguageSwitcher.vue](../../../../app/components/header/LanguageSwitcher.vue)

## 使用方式

Nuxt 會自動匯入此元件；Header 內的自動匯入名稱為 `HeaderLanguageSwitcher`：

```vue
<HeaderLanguageSwitcher @open="closeOtherHeaderOverlays" />
```

元件沒有 Props。它會：

- 使用 `useLocaleSwitcher` 提供目前語系、語系選項與 localized route。
- 使用 `IconEarth`、目前語系名稱與 `IconChevronDown` 渲染 trigger。
- 提供 `中文` 與 `English` 選項，使用 `@nuxtjs/i18n` 的 localized `NuxtLink`。
- 使用 `switchLocalePath()` 保留目前 route、query 與 hash；找不到對應路由時回退到目標語系首頁。
- 透過 `aria-expanded`、`aria-controls`、`aria-current` 與 translated accessible name 描述互動。
- 支援 click outside、Escape、Tab、Enter／Space 與 focus-visible 樣式。
- 選擇新語系後關閉 dropdown，route 完成後將 focus 還原至 trigger；選擇目前語系只關閉 dropdown。

## Emits

| Event   | Payload | 說明                                    |
| ------- | ------- | --------------------------------------- |
| `open`  | none    | dropdown 開啟，可用來關閉其他 overlay。 |
| `close` | none    | dropdown 關閉。                         |

## 公開方法

元件透過 template ref expose `close(restoreFocus?: boolean)`：

```ts
type TLanguageSwitcherInstance = {
  close: (restoreFocus?: boolean) => void
}
```

Header 用它在搜尋面板或手機選單開啟前關閉語系 dropdown。

## i18n 與 locale

目前支援 `zh-TW` 與 `en`。語系名稱、trigger accessible name、選單標籤與切換提示位於 `header.language.*`。`@nuxtjs/i18n` 以 `i18n_redirected` cookie 記住使用者明確選擇；首次造訪不依瀏覽器 `Accept-Language` 自動切換。

`server/middleware/i18n-default-locale.ts` 會在沒有 cookie 的根路徑請求先固定 `zh-TW`，`app/plugins/i18n-default-locale.ts` 則避免 hydration 階段被瀏覽器語系覆寫；明確進入 `/en` 仍會使用英文。

## SSR、cleanup 與限制

- 元件只在 `onMounted` 後註冊 `document` 的 `pointerdown` listener，可安全 SSR 與 hydration。
- 元件卸載時會移除 listener；不使用 timer、observer 或額外 browser API。
- 下拉選項使用一般導航連結，不使用 `role="menu"`；`ul` 保留一般列表語意，鍵盤依瀏覽器原生 Tab／Enter 行為操作。
- locale route 是否存在由 `@nuxtjs/i18n` route resolver 判斷；無法解析時只回退首頁，不會替不存在的頁面建立 route。
