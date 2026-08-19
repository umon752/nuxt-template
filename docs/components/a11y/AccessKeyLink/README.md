# AccessKeyLink

建立網站區塊的 access key 錨點；畫面上隱藏，但保留鍵盤快捷鍵及輔助技術標籤。

原始碼：[AccessKeyLink.vue](../../../../app/components/a11y/AccessKeyLink.vue)

## 使用方式

```vue
<A11yAccessKeyLink id="AC" target="#main-content" accesskey="C" label-key="a11y.main" />
```

| Prop        | 型別     | 說明                                     |
| ----------- | -------- | ---------------------------------------- |
| `id`        | `string` | 錨點元素 ID。                            |
| `target`    | `string` | `href` 指向的區塊 ID。                   |
| `accesskey` | `string` | 瀏覽器 access key。                      |
| `labelKey`  | `string` | 用於 `aria-label`、`title` 的 i18n key。 |

## 全域開關

`app/config/features.ts` 的 `a11yConfig.accessKeyLinks` 控制預設 layout、Header 與 Footer 是否輸出網站區塊的 access key 錨點，預設為 `true`。關閉時會移除主內容、Header 與 Footer 的 access key 連結，但不會移除對應區塊本身。

這個設定只控制使用端的全域渲染；直接使用 `A11yAccessKeyLink` 時，元件仍會依傳入的 Props 輸出連結。
