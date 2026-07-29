# Spinner

輕量載入指示器。提供 `label` 時會成為 `role="status"`；純裝飾用途則自動設為 `aria-hidden`。

原始碼：[Spinner.vue](../../../app/components/Spinner.vue)

## 使用方式

```vue
<Spinner label="資料載入中" spinner-class="size-8 text-main-600" />
```

| Prop           | 型別         | 預設值      | 說明                         |
| -------------- | ------------ | ----------- | ---------------------------- |
| `label`        | `string`     | `undefined` | 輔助技術讀出的載入狀態文字。 |
| `spinnerClass` | `ClassValue` | `''`        | 合併至預設 spinner 樣式。    |
