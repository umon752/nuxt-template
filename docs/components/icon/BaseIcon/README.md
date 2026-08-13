# BaseIcon

專案 SVG 圖示基底，統一套用內嵌 Tailwind class 並將圖示設為裝飾性內容。

原始碼：[BaseIcon.vue](../../../../app/components/icon/BaseIcon.vue)

## 使用方式

```vue
<IconBaseIcon view-box="0 0 24 24" class="text-primary-500 size-6">
  <path fill="currentColor" d="..." />
</IconBaseIcon>
```

| Prop      | 型別     | 說明          |
| --------- | -------- | ------------- |
| `viewBox` | `string` | SVG viewBox。 |

預設 slot 放入 SVG 圖形節點。元件固定使用 `aria-hidden="true"`；若圖示本身承載意義，應由外層按鈕或連結提供 `aria-label` 或可見文字。
