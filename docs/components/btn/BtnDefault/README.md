# BtnDefault

專案通用按鈕樣式。未宣告為 Prop 的原生按鈕 attrs 與事件會由 Vue fallthrough 到根 `<button>`。

原始碼：[BtnDefault.vue](../../../../app/components/btn/BtnDefault.vue)

## 使用方式

```vue
<BtnDefault text="儲存" :disabled="saving" aria-label="儲存資料" @click="save" />
```

| Prop   | 型別     | 預設值 | 說明           |
| ------ | -------- | ------ | -------------- |
| `text` | `string` | `按鈕` | 按鈕顯示文字。 |

根元素固定使用 `type="button"`。目前沒有預設 slot；需替換內容時應擴充元件或另建按鈕元件。
