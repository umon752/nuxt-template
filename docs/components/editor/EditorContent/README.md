# EditorContent

渲染後台編輯器提供的 HTML，並套用全域 `.editor` 排版樣式。

原始碼：[EditorContent.vue](../../../../app/components/editor/EditorContent.vue)

## 使用方式

```vue
<EditorContent :html="sanitizedHtml" />
```

| Prop   | 型別     | 說明            |
| ------ | -------- | --------------- |
| `html` | `string` | 要輸出的 HTML。 |

此元件使用 `v-html`，不會自行消毒內容。傳入前必須在可信任的後端或消毒流程中移除 script、事件屬性及危險 URL。
