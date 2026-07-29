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
