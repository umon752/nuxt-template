# Marquee

以 Vue 3、TypeScript 與 `requestAnimationFrame` 實作的資料驅動跑馬燈。支援無縫循環、左右方向、不同寬度項目、hover／focus 暫停、Pointer Events 拖曳、父層控制及 reduced motion。

原始碼：[Marquee.vue](../../../../app/components/marquee/Marquee.vue)

## 基本使用

```vue
<script setup lang="ts">
import type { TMarqueeItem } from '~/components/marquee/Marquee.vue'

const items: TMarqueeItem[] = [
  { id: 1, title: 'Item 1' },
  { id: 2, title: 'Item 2' },
  { id: 3, title: 'Item 3' },
]

const activeIndex = ref(0)
const paused = ref(false)
</script>

<template>
  <Marquee
    v-model:active-index="activeIndex"
    v-model:paused="paused"
    :items="items"
    :speed="60"
    :gap="16"
    pause-on-hover
    draggable
  >
    <template #item="{ item, isActive }">
      <article :class="{ 'is-active': isActive }">
        {{ item.title }}
      </article>
    </template>
  </Marquee>
</template>
```

## 父層控制

`controls` slot 提供不需元件 ref 的控制函式。函式只 emit 更新，實際狀態仍由父層的 `v-model` 持有。

```vue
<Marquee v-model:active-index="activeIndex" v-model:paused="paused" :items="items">
  <template #controls="{ paused, start, stop, prev, next }">
    <button type="button" @click="prev">上一個</button>
    <button type="button" @click="paused ? start() : stop()">
      {{ paused ? '播放' : '暫停' }}
    </button>
    <button type="button" @click="next">下一個</button>
  </template>
</Marquee>
```

## Props

| Prop           | 型別             | 預設值   | 說明                                           |
| -------------- | ---------------- | -------- | ---------------------------------------------- |
| `items`        | `TMarqueeItem[]` | 必填     | 跑馬燈資料，每筆必須包含唯一 `id`。            |
| `activeIndex`  | `number`         | 必填     | Active 項目索引，使用 `v-model:active-index`。 |
| `paused`       | `boolean`        | 必填     | 播放狀態，使用 `v-model:paused`。              |
| `speed`        | `number`         | `60`     | 每秒移動像素數。                               |
| `direction`    | `left \| right`  | `left`   | 自動播放方向。                                 |
| `pauseOnHover` | `boolean`        | `false`  | hover 或內容取得焦點時暫停。                   |
| `draggable`    | `boolean`        | `false`  | 是否啟用滑鼠及觸控拖曳。                       |
| `gap`          | `number`         | `0`      | 項目間距，單位為像素。                         |
| `ariaLabel`    | `string`         | `跑馬燈` | 跑馬燈區域 accessible name。                   |
| `marqueeClass` | `ClassValue`     | `''`     | Viewport Tailwind class。                      |
| `trackClass`   | `ClassValue`     | `''`     | 位移軌道 Tailwind class。                      |
| `itemClass`    | `ClassValue`     | `''`     | 每個項目外層 Tailwind class。                  |
| `activeClass`  | `ClassValue`     | `''`     | Active 項目外層 Tailwind class。               |

## Slots

- `item`：提供 `item`、`index`、`isActive`、`isClone`。
- `controls`：提供 `paused`、`start()`、`stop()`、`prev()`、`next()`。

複製項目用於無縫循環，已標記 `aria-hidden` 與 `inert`。若 slot 內容包含 `id`，請利用 `isClone` 避免在複製項目輸出相同 ID。

## Events

- `update:activeIndex(index)`
- `update:paused(paused)`
- `start`、`stop`
- `prev(index)`、`next(index)`
- `dragStart`、`dragEnd`

## 行為說明

- 動畫速度以時間差與 `px/s` 計算，不受 60Hz／120Hz 更新率影響。
- 使用 `ResizeObserver` 監測容器與原始內容尺寸，響應式更新複製數量與位置。
- 拖曳期間會暫停動畫，放開後依原本方向繼續播放。
- hover 或內容取得鍵盤焦點時可暫停，但不會修改父層的 `paused`。
- `prefers-reduced-motion: reduce` 啟用時停止自動播放，上一個／下一個仍可操作。
- 頁面切到背景分頁時停止動畫，回到頁面後恢復。
