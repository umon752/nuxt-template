# Tooltip

以 `Teleport` 呈現的提示文字元件，支援滑鼠、鍵盤焦點、Escape 關閉、顯示延遲、四向定位、視窗邊界翻轉及 `aria-describedby` 關聯。

原始碼：[Tooltip.vue](../../../../app/components/tooltip/Tooltip.vue)

## 基本使用

```vue
<Tooltip text="查看詳細資料" placement="top">
  <BtnDefault text="詳細資料" />
</Tooltip>
```

Trigger 應使用可聚焦元素，例如 `button` 或 `a`。元件會將 Tooltip ID 加入第一個 trigger 元素的 `aria-describedby`，關閉時只移除自身 ID，不會覆蓋原有關聯。

## 自訂內容

```vue
<Tooltip placement="right" tooltip-class="bg-primary-700">
  <BtnDefault text="查看說明" />

  <template #content>
    <span class="font-semibold">自訂提示內容</span>
  </template>
</Tooltip>
```

## Props

| Prop           | 型別                             | 預設值  | 說明                          |
| -------------- | -------------------------------- | ------- | ----------------------------- |
| `text`         | `string`                         | `''`    | 提示文字。                    |
| `placement`    | `top \| right \| bottom \| left` | `top`   | 優先顯示方向。                |
| `disabled`     | `boolean`                        | `false` | 是否停用。                    |
| `showDelay`    | `number`                         | `150`   | 顯示延遲，單位為毫秒。        |
| `hideDelay`    | `number`                         | `100`   | 隱藏延遲，單位為毫秒。        |
| `tooltipClass` | `ClassValue`                     | `''`    | Tooltip 外層 Tailwind class。 |

Slots：預設 slot 為 trigger；`content` 可取代 `text`。

Events：`show`、`hide`。

## 行為說明

- Tooltip 顯示狀態是元件內的暫時 UI 狀態，不會修改父層資料。
- 滑鼠移入或 trigger 取得焦點時顯示，滑鼠移出或失焦時隱藏。
- 按下 Escape 可立即關閉。
- 顯示期間會在 resize、任一捲動容器 scroll 時重新計算位置。
- 空間不足時依候選順序選擇方向：
  - `right`：右 → 上 → 下
  - `left`：左 → 上 → 下
  - `top`：上 → 下
  - `bottom`：下 → 上
- 所有候選方向都放不下時，會保留原始方向並限制在 viewport 內。
