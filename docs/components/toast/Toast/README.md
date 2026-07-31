# Toast

單一通知元件，支援自動關閉、定位、slots、無障礙 live region，以及 `alertdialog` 的焦點陷阱與焦點還原。

原始碼：[Toast.vue](../../../../app/components/toast/Toast.vue)

## 基本使用

```vue
<script setup lang="ts">
const visible = ref(false)
</script>

<template>
  <BtnDefault text="顯示通知" @click="visible = true" />
  <Toast v-model="visible" text="資料儲存成功" :duration="2500" />
</template>
```

## Alertdialog

```vue
<Toast
  v-model="errorVisible"
  text="請先修正表單錯誤"
  :auto-hide="false"
  role="alertdialog"
  aria-live="assertive"
  aria-label="表單錯誤"
>
  <template #actions="{ hide }">
    <BtnDefault text="返回修改" @click="hide" />
  </template>
</Toast>
```

`alertdialog` 顯示時會聚焦元件、限制 Tab 焦點於內部，關閉後回到原觸發元素。務必提供 `ariaLabel`，並至少提供一個可完成或取消操作的控制項。

## Props

| Prop              | 型別                             | 預設值      | 說明                                                  |
| ----------------- | -------------------------------- | ----------- | ----------------------------------------------------- |
| `modelValue`      | `boolean`                        | `false`     | 顯示狀態，使用 `v-model`。                            |
| `text`            | `string`                         | `''`        | 通知文字；`<br>` 會安全轉為換行，不會當作 HTML 執行。 |
| `autoHide`        | `boolean`                        | `true`      | 是否定時關閉。                                        |
| `duration`        | `number`                         | `3000`      | 顯示毫秒數。                                          |
| `role`            | `status \| alert \| alertdialog` | `status`    | 通知語意。                                            |
| `ariaLive`        | `off \| polite \| assertive`     | `polite`    | live region 優先度。                                  |
| `ariaLabel`       | `string`                         | `undefined` | 通知 accessible name，`alertdialog` 應提供。          |
| `position`        | `fixed \| absolute \| relative`  | `fixed`     | CSS 定位方式。                                        |
| `x` / `y`         | `string`                         | `undefined` | CSS `left` / `top`。                                  |
| `toastClass`      | `ClassValue`                     | `''`        | 合併至通知外層 class。                                |
| `showCloseButton` | `boolean`                        | `true`      | 是否顯示預設關閉按鈕。                                |
| `closeLabel`      | `string`                         | 翻譯值      | 關閉按鈕文字。                                        |
| `removeOnHide`    | `boolean`                        | `false`     | 離場動畫後是否觸發 `kill`。                           |

Slots：`text` 提供 `{ text }`；`actions` 提供 `{ hide }`。Events：`update:modelValue`、`show`、`hide`、`kill`。透過元件 ref 可呼叫 `show()`、`hide()`、`kill()`。

## 動畫行為

顯示與隱藏使用 300ms 的位移及透明度 transition。元件初次掛載時若 `modelValue` 已為 `true`，也會執行進場動畫，因此透過 `ToastStack` 動態建立且立即顯示的通知具有相同行為。使用者啟用 `prefers-reduced-motion: reduce` 時會停用 transition。
