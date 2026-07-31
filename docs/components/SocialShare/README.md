# SocialShare

提供 Facebook、LINE、Twitter/X 分享與複製連結的預設按鈕 UI。分享功能位於 `useSocialShare()`，也能由連結、選單項目或其他互動觸發。

原始碼：[SocialShare.vue](../../../app/components/SocialShare.vue)

功能原始碼：[useSocialShare.ts](../../../app/composables/useSocialShare.ts)

## 基本使用

```vue
<SocialShare />
```

未提供 `url` 時，使用者點擊按鈕後才會讀取目前頁面的 `window.location.href`；Twitter/X 分享文字預設使用 `document.title`。所有網址都會透過 `URLSearchParams` 編碼。

## 不使用預設按鈕 UI

需要從連結、選單或其他 UI 觸發時，直接使用 composable：

```vue
<script setup lang="ts">
const { share, isCopied } = useSocialShare({
  url: 'https://example.com/news/1',
  title: '文章標題',
})
const errorMessage = ref('')

const handleError = (error: unknown): void => {
  errorMessage.value = error instanceof Error ? error.message : '分享失敗'
}

const shareToLine = (): void => {
  void share('line').catch(handleError)
}

const copyLink = (): void => {
  void share('copy').catch(handleError)
}
</script>

<template>
  <a href="#share" @click.prevent="shareToLine">分享到 LINE</a>
  <a href="#copy" @click.prevent="copyLink">{{ isCopied ? '已複製' : '複製連結' }}</a>
  <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
</template>
```

`url`、`title` 與 `copiedDuration` 可傳入一般值、`ref`、`computed` 或 getter。`share(platform)` 回傳 `Promise<{ platform, url }>`；成功時 resolve，網址或剪貼簿操作失敗時 reject。請從使用者操作的同步事件處理函式中直接呼叫外部平台分享，以降低 popup 被瀏覽器阻擋的機率。

`useSocialShare()` 另回傳：

- `isCopied`：唯讀 ref，複製成功後為 `true`。
- `feedbackMessage`：唯讀 ref，包含複製成功或失敗的 i18n 訊息，可供自訂 live region 使用。
- `clearFeedback()`：立即清除複製狀態、訊息與計時器。

`copiedDuration` 預設為 `2000` 毫秒；設為 `0` 時不自動清除。composable 所在的 effect scope 銷毀時會清理計時器。

## 指定內容與平台

```vue
<SocialShare
  url="https://example.com/news/1"
  title="文章標題"
  :platforms="['facebook', 'line', 'copy']"
  @share="handleShare"
  @copied="handleCopied"
  @error="handleError"
/>
```

`platforms` 會按照傳入順序顯示並自動移除重複項目。元件只接受 HTTP／HTTPS 分享網址；解析失敗或協定不支援時會觸發 `error`。

## 自訂按鈕內容

平台名稱可作為 named slot，slot props 包含 `platform`、`label` 與 `copied`：

```vue
<SocialShare>
  <template #facebook="{ label }">
    <span aria-hidden="true">f</span>
    <span>{{ label }}</span>
  </template>

  <template #copy="{ label, copied }">
    {{ copied ? '完成' : label }}
  </template>
</SocialShare>
```

## Props

| Prop             | 型別                                              | 預設值                                    | 說明                                         |
| ---------------- | ------------------------------------------------- | ----------------------------------------- | -------------------------------------------- |
| `url`            | `string`                                          | `undefined`                               | 分享網址；未提供時於點擊當下使用目前頁網址。 |
| `title`          | `string`                                          | `undefined`                               | Twitter/X 分享文字；未提供時使用文件標題。   |
| `platforms`      | `('facebook' \| 'line' \| 'twitter' \| 'copy')[]` | `['facebook', 'line', 'twitter', 'copy']` | 顯示的平台與順序。                           |
| `copiedDuration` | `number`                                          | `2000`                                    | 複製回饋保留毫秒數；`0` 代表不自動清除。     |
| `buttonClass`    | `ClassValue`                                      | `''`                                      | 套用到每個分享按鈕的 class。                 |

## Events

| Event    | Payload                                                      | 觸發時機                             |
| -------- | ------------------------------------------------------------ | ------------------------------------ |
| `share`  | `(platform: 'facebook' \| 'line' \| 'twitter', url: string)` | 已嘗試開啟平台分享視窗。             |
| `copied` | `(url: string)`                                              | 連結成功寫入剪貼簿。                 |
| `error`  | `(error: unknown)`                                           | 網址解析、協定驗證或剪貼簿操作失敗。 |

Slots：`facebook`、`line`、`twitter`、`copy`。每個 slot 都接收 `{ platform, label, copied }`。

## 行為與無障礙

- 根元素使用 `role="group"`，預設 accessible name 來自 `components.socialShare.ariaLabel`，可用 `aria-label` 覆蓋。
- 每個平台使用原生 `button type="button"`，即使自訂 slot，按鈕仍保留平台的 `aria-label`。
- 複製成功或失敗訊息透過 `aria-live="polite"` 宣告；成功時複製按鈕文字暫時改為 `components.socialShare.copied`。
- `SocialShare` 僅負責按鈕、slot、群組語意與事件轉接；網址解析、開啟分享視窗、剪貼簿操作與回饋狀態由 `useSocialShare()` 提供。
- 安全環境優先使用 Clipboard API，不支援時回退至 `document.execCommand('copy')`。
- 分享視窗使用 `noopener,noreferrer`。瀏覽器仍可能依使用者設定阻擋 popup；`share` 代表已嘗試開啟，不代表分享完成。

相關 i18n 鍵值：`components.socialShare.ariaLabel`、`facebook`、`line`、`twitter`、`copy`、`copied`、`copyError`、`invalidUrl`。不支援的網址協定與複製 fallback 失敗所拋出的錯誤訊息也會使用這些翻譯。
