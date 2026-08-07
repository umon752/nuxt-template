# useSocialShare 使用說明

`useSocialShare` 提供 Facebook、LINE、Twitter/X 分享與複製連結的共用邏輯，可搭配 `SocialShare` 元件，也能由連結、選單或其他自訂 UI 觸發。

原始碼：[useSocialShare.ts](../../app/composables/useSocialShare.ts)

## 基本使用

composable 由 Nuxt 自動匯入。`share` 應直接在使用者操作的事件處理函式中呼叫，以降低外部分享視窗被瀏覽器阻擋的機率：

```vue
<script setup lang="ts">
import type { TSharePlatform } from '~/composables/useSocialShare'

const { share, isCopied, feedbackMessage } = useSocialShare({
  url: 'https://example.com/news/1',
  title: '文章標題',
})

const handleShare = (platform: TSharePlatform): void => {
  void share(platform).catch((error: unknown) => {
    console.error('Share failed.', error)
  })
}
</script>

<template>
  <button type="button" @click="handleShare('line')">分享到 LINE</button>
  <button type="button" @click="handleShare('copy')">
    {{ isCopied ? '已複製' : '複製連結' }}
  </button>
  <p aria-live="polite">{{ feedbackMessage }}</p>
</template>
```

## API

### `useSocialShare(options)`

| 選項             | 型別                                    | 預設值           | 說明                                                |
| ---------------- | --------------------------------------- | ---------------- | --------------------------------------------------- |
| `url`            | `MaybeRefOrGetter<string \| undefined>` | 目前頁網址       | 分享網址；於呼叫 `share` 時解析。                   |
| `title`          | `MaybeRefOrGetter<string \| undefined>` | `document.title` | Twitter/X 分享文字；未提供時使用文件標題。          |
| `copiedDuration` | `MaybeRefOrGetter<number \| undefined>` | `2000`           | 複製回饋保留的毫秒數；小於或等於 `0` 時不自動清除。 |

### 回傳值

| 成員              | 型別                                        | 說明                               |
| ----------------- | ------------------------------------------- | ---------------------------------- |
| `isCopied`        | `Readonly<Ref<boolean>>`                    | 複製成功後為 `true`。              |
| `feedbackMessage` | `Readonly<Ref<string>>`                     | 複製成功或失敗時的 i18n 回饋訊息。 |
| `share`           | `(platform) => Promise<TSocialShareResult>` | 分享或複製指定平台的網址。         |
| `clearFeedback`   | `() => void`                                | 清除複製狀態、訊息與回饋計時器。   |

`TSharePlatform` 為 `'facebook' | 'line' | 'twitter' | 'copy'`。`share` 成功時回傳 `{ platform, url }`；網址解析或剪貼簿操作失敗時 reject。

## 行為與限制

- 未提供 `url` 時，使用者呼叫 `share` 後才讀取 `window.location.href`；未提供 `title` 時讀取 `document.title`。
- 分享網址只接受 `http:` 或 `https:`；其他協定會以 `components.socialShare.invalidUrl` 拋出錯誤。
- 安全環境優先使用 Clipboard API，不支援時回退到 `document.execCommand('copy')`，並在 fallback 後恢復原本 focus。
- composable 建立時不讀取 browser API，可安全參與 SSR；分享動作本身必須在 client 端事件中執行。
- effect scope 銷毀時會清理回饋計時器。
- 完整使用範例也可參考 `docs/components/SocialShare/README.md`。
