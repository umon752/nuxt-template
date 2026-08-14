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

傳入的 `class` 會與內建的 `inline-block size-6 fill-current stroke-current stroke-0 transition-colors duration-300` 透過 `cn()` 合併，因此可用 `size-*`、`text-*` 等 Tailwind utility 覆寫預設圖示樣式，而不會殘留衝突的 class。
