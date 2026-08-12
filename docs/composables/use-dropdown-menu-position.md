# useDropdownMenuPosition 使用說明

`useDropdownMenuPosition` 負責計算桌面版下拉選單面板的位置，讓主選單面板在畫面中央顯示、靠近視窗邊界時自動對齊，巢狀子選單則在右側顯示並於右側空間不足時改從左側展開。

原始碼：[useDropdownMenuPosition.ts](../../app/composables/useDropdownMenuPosition.ts)

目前由以下元件使用：

- `app/components/header/DesktopSingleDropdownMenu.vue`
- `app/components/header/DesktopMultipleDropdownMenu.vue`

## 基本使用

composable 由 Nuxt 自動匯入。將下拉面板的 template ref 與是否為巢狀選單的 `Ref<boolean>` 傳入：

```vue
<script setup lang="ts">
const panelRef = useTemplateRef<HTMLElement>('panelRef')
const nested = ref(false)

const { panelStyle, refreshPosition } = useDropdownMenuPosition({
  panelRef,
  nested,
})
</script>

<template>
  <div ref="panelRef" :style="panelStyle" @mouseenter="refreshPosition" @focusin="refreshPosition">
    下拉選單內容
  </div>
</template>
```

`panelRef` 應指向實際的下拉面板 DOM 元素。面板顯示狀態、z-index、寬度與 transition 仍由呼叫端元件負責；這個 composable 只提供定位 inline style。

## Options

| 選項       | 型別                       | 預設值 | 說明                                    |
| ---------- | -------------------------- | ------ | --------------------------------------- |
| `panelRef` | `TemplateRef<HTMLElement>` | 必填   | 下拉面板的 template ref。               |
| `nested`   | `Ref<boolean>`             | 必填   | 是否為巢狀子選單；`true` 會以側向展開。 |

## 回傳值

| 名稱              | 型別                  | 說明                                                   |
| ----------------- | --------------------- | ------------------------------------------------------ |
| `panelStyle`      | `Ref<CSSProperties>`  | 目前定位用的 inline style。                            |
| `refreshPosition` | `() => Promise<void>` | 重新讀取面板尺寸並計算位置；可在事件或面板開啟後呼叫。 |

## 定位規則

- 一般下拉選單預設位於觸發區塊下方，水平置中。
- 一般下拉選單右側超出視窗時，改為貼齊右側；左側超出視窗時，改為貼齊左側。
- 巢狀子選單預設位於父層右側；右側空間不足時，改從父層左側展開。
- 邊界判斷會保留 `8px` 的視窗內距。
- 計算前會先套用基礎位置，再等待 `nextTick()` 讀取 `getBoundingClientRect()`，因此面板必須先完成 DOM 渲染。

## SSR、生命週期與清理

- `refreshPosition()` 在 SSR 執行時會直接返回，不讀取 DOM 或 `window`，可安全參與 SSR。
- 元件 mounted 後會自動執行一次定位，並監聽 `window.resize` 重新計算位置。
- 元件卸載時會移除 `resize` listener，不需要呼叫額外的 cleanup 方法。
- `panelRef` 尚未取得 DOM 元素時，client 端會保留對應的基礎位置；面板之後顯示時可再次呼叫 `refreshPosition()`。
- `nested` 本身不建立 watcher；若執行期間改變其值，請在面板狀態更新後手動呼叫 `refreshPosition()`。

## 注意事項與限制

- composable 不管理面板的開關狀態、focus、Escape 關閉、鍵盤導覽或 ARIA 屬性，這些行為由 header 下拉元件處理。
- `refreshPosition()` 依賴實際 DOM 的 `getBoundingClientRect()` 與當下 `window.innerWidth`，若面板內容、尺寸或可見狀態改變，應重新呼叫。
- 每個 composable instance 都會建立自己的 `resize` listener；不應在同一元件中重複建立不必要的 instance。
- resize 事件目前直接觸發重新計算，未額外加入 throttle 或 debounce。
