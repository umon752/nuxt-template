# DesktopMultipleDropdownMenu

桌面版多欄下拉選單，會將子項目每八筆分欄，並支援遞迴巢狀選單及視窗邊界定位。

原始碼：[DesktopMultipleDropdownMenu.vue](../../../../app/components/header/DesktopMultipleDropdownMenu.vue)

## 使用方式

```vue
<HeaderDesktopMultipleDropdownMenu :item="menuItem" />
```

| Prop     | 型別        | 預設值  | 說明                                           |
| -------- | ----------- | ------- | ---------------------------------------------- |
| `item`   | `TMenuItem` | 必填    | 含 `children` 的選單項目。沒有子項目時不渲染。 |
| `nested` | `boolean`   | `false` | 是否為下一層巢狀面板。                         |

此元件主要由 Header 類元件組合使用。顯示狀態依父層 hover／focus-within class 控制；選單資料需符合 `useMenu` 匯出的 `TMenuItem`。
