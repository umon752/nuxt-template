# Modal

以原生 `<dialog>` 實作的通用 Modal，支援 top layer、背景 inert、focus trap、初始焦點、焦點還原、捲動鎖定與關閉原因。關閉時會在離場動畫完成後移除 `<dialog>`，未使用時不會讓空結構長駐 DOM。

原始碼：[Modal.vue](../../../../app/components/modal/Modal.vue)

## 基本使用

```vue
<script setup lang="ts">
const visible = ref(false)
</script>

<template>
  <BtnDefault text="開啟 Modal" @click="visible = true" />

  <Modal v-model="visible" title="確認操作">
    <p>確定要儲存目前資料嗎？</p>

    <template #footer="{ close }">
      <BtnDefault text="取消" @click="close" />
      <BtnDefault text="確認" autofocus @click="close" />
    </template>
  </Modal>
</template>
```

## 不可由背景關閉

```vue
<Modal
  v-model="processing"
  title="資料處理中"
  :close-on-escape="false"
  :close-on-backdrop="false"
  :show-close-button="false"
>
  <LoadingSpinner label="資料處理中" />
</Modal>
```

## Props

| Prop               | 型別                    | 預設值      | 說明                                                        |
| ------------------ | ----------------------- | ----------- | ----------------------------------------------------------- |
| `modelValue`       | `boolean`               | `false`     | 顯示狀態，使用 `v-model`。                                  |
| `title`            | `string`                | `''`        | Modal 標題。                                                |
| `role`             | `dialog \| alertdialog` | `dialog`    | Modal 語意。                                                |
| `ariaLabel`        | `string`                | `undefined` | 沒有標題時必須提供的 accessible name。                      |
| `ariaDescribedby`  | `string`                | `undefined` | 關聯內容說明元素 ID。                                       |
| `closeOnEscape`    | `boolean`               | `true`      | Escape 是否關閉。                                           |
| `closeOnBackdrop`  | `boolean`               | `true`      | 點擊遮罩是否關閉。                                          |
| `showCloseButton`  | `boolean`               | `true`      | 是否顯示右上角關閉按鈕。                                    |
| `closeLabel`       | `string`                | 翻譯值      | 關閉按鈕 accessible name。                                  |
| `initialFocus`     | `first \| panel`        | `first`     | 顯示後聚焦第一個控制項或面板。具有 `autofocus` 的元素優先。 |
| `overlayClass`     | `ClassValue`            | `''`        | 遮罩 class。                                                |
| `modalClass`       | `ClassValue`            | `''`        | Modal 面板 class。                                          |
| `headerClass`      | `ClassValue`            | `''`        | Header class。                                              |
| `bodyClass`        | `ClassValue`            | `''`        | Body class。                                                |
| `footerClass`      | `ClassValue`            | `''`        | Footer class。                                              |
| `closeButtonClass` | `ClassValue`            | `''`        | 關閉按鈕 class。                                            |

Slots：`title`、預設 slot、`footer`、`closeIcon`。預設與 footer slot 都提供 `{ close }`。

Events：`update:modelValue`、`open`、`close(reason)`。關閉原因可能是 `close-button`、`backdrop`、`escape`、`programmatic` 或 `native`。

透過元件 ref 可呼叫 `open()`、`close()`。多個 Modal 同時開啟時，捲動鎖定會以計數管理，直到最後一個 Modal 關閉才恢復 body 狀態。

## 鍵盤與焦點

- 開啟後依序聚焦 `[autofocus]`、第一個可操作元素或 Modal 面板。
- `Tab` 在最後一個可操作元素時會回到第一個元素。
- `Shift + Tab` 在第一個可操作元素時會回到最後一個元素。
- Modal 沒有可操作元素時，焦點會留在面板上。
- 關閉後會將焦點還原到原本的觸發元素。
