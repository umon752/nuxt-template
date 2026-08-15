# DesktopSingleDropdownMenu

受控的桌面單欄下拉選單，支援巢狀子選單、Escape 關閉與動態定位。

原始碼：[DesktopSingleDropdownMenu.vue](../../../../app/components/header/DesktopSingleDropdownMenu.vue)

## 使用方式

```vue
<HeaderDesktopSingleDropdownMenu
  :item="menuItem"
  panel-id="submenu-products"
  :open="open"
  @close="open = false"
/>
```

| Prop      | 型別        | 預設值              | 說明                                            |
| --------- | ----------- | ------------------- | ----------------------------------------------- |
| `item`    | `TMenuItem` | 必填                | 含 `children` 的選單項目。                      |
| `nested`  | `boolean`   | `false`             | 是否為巢狀面板。                                |
| `panelId` | `string`    | `submenu-{item.id}` | 面板 ID，需與 trigger 的 `aria-controls` 對應。 |
| `open`    | `boolean`   | `false`             | 是否開啟面板。                                  |

有子選單的項目如果有 `href`，會同時渲染父層 `NuxtLink` 與獨立的 submenu toggle button；沒有 `href` 時只渲染 toggle button。Event：`close`。按 Escape 時會觸發 `close` 並將焦點回到 `id="menu-trigger-{item.id}"` 的觸發按鈕。
