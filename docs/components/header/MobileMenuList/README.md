# MobileMenuList

遞迴渲染手機版選單；有子項目的節點使用 Accordion，葉節點則輸出 NuxtLink 或純文字。

原始碼：[MobileMenuList.vue](../../../../app/components/header/MobileMenuList.vue)

## 使用方式

```vue
<HeaderMobileMenuList :items="menuItems" />
```

| Prop    | 型別          | 預設值 | 說明                                         |
| ------- | ------------- | ------ | -------------------------------------------- |
| `items` | `TMenuItem[]` | 必填   | 要顯示的選單樹。                             |
| `level` | `number`      | `0`    | 目前層級，用於計算左側縮排；遞迴時自動增加。 |

通常由 `Header` 使用，不需要手動傳入 `level`。資料需符合 `useMenu` 匯出的 `TMenuItem`。
