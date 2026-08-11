# Cursor

在指定內容區域顯示跟隨指標移動的裝飾性自訂游標，支援連結／按鈕 hover 樣式、原生游標隱藏、文字或圖片內容，以及多個獨立元件實例。

原始碼：[Cursor.vue](../../../../app/components/cursor/Cursor.vue)

## 基本使用

```vue
<Cursor link-hover hide-cursor>
  <div class="rounded-xl bg-sky-200 p-8">
    <p>將指標移入此區域。</p>
    <a href="/about">連結</a>
  </div>
</Cursor>
```

Nuxt 會自動匯入 `Cursor`。每個 `Cursor` 實例只管理預設 slot 內的區域，因此可以在同一頁建立多種游標效果。

## API

| Prop           | 型別         | 預設值      | 說明                                                      |
| -------------- | ------------ | ----------- | --------------------------------------------------------- |
| `disabled`     | `boolean`    | `false`     | 停用游標效果，預設 slot 內容仍正常互動。                  |
| `text`         | `string`     | `''`        | 未提供 `content` slot 時顯示的游標文字。                  |
| `linkHover`    | `boolean`    | `false`     | 是否偵測區域內的 `a`、`button`，並套用 `hoverClass`。     |
| `hideCursor`   | `boolean`    | `false`     | 指標位於區域時隱藏原生游標；離開或停用後會恢復。          |
| `touchDevice`  | `boolean`    | `false`     | 是否允許 touch pointer 啟用效果；預設忽略 touch pointer。 |
| `triggerClass` | `ClassValue` | `''`        | 包住預設 slot 的 trigger wrapper class。                  |
| `cursorClass`  | `ClassValue` | `''`        | 自訂游標本體 class；會使用 `cn` 合併 Tailwind class。     |
| `hoverClass`   | `ClassValue` | `'size-12'` | `linkHover` 啟用且指標位於連結／按鈕時套用的 class。      |

### Slots

- `default`：游標作用區域。
- `content`：取代 `text` 的游標內容，提供以下 slot props：
  - `isLink`：目前是否位於 `a` 或 `button` 內。
  - `imageSrc`：目前解析到的 `data-cursor-img` 值，找不到時為 `undefined`。

### Events

- `enter(event: PointerEvent)`：指標進入作用區域。
- `move(event: PointerEvent)`：指標在作用區域內移動。
- `leave(event: PointerEvent)`：指標離開作用區域。

## 固定圖片游標

如果游標內容固定，直接在 `content` slot 放入圖片即可，不需要 `data-cursor-img`：

```vue
<Cursor cursor-class="size-auto rounded-none bg-transparent mix-blend-normal">
  <div class="rounded-xl p-8">固定圖片作用區域</div>

  <template #content>
    <img src="/images/demo/test-img.jpg" alt="" class="h-24 w-40 rounded object-cover" />
  </template>
</Cursor>
```

## 文字內容 slot

可以在 `content` slot 直接放入文字或文字元素，也可以使用 `isLink` 判斷目前是否 hover 到 link：

```vue
<Cursor link-hover cursor-class="size-auto rounded-xl bg-emerald-950 mix-blend-normal">
  <div class="rounded-xl bg-emerald-100 p-8">
    <a href="#">文字作用區域內的 link</a>
  </div>

  <template #content="{ isLink }">
    <span class="whitespace-nowrap px-4 py-2 text-sm font-semibold text-white">
      {{ isLink ? '查看詳細資訊' : '開啟詳細資訊' }}
    </span>
  </template>
</Cursor>
```

## 依 hover 目標切換圖片

在作用區域內加入 `data-cursor-img`，再透過 `content` slot 讀取 `imageSrc`：

```vue
<Cursor cursor-class="size-auto rounded-none bg-transparent mix-blend-normal">
  <div class="grid grid-cols-3 gap-3">
    <a href="#" data-cursor-img="/images/demo/test-img.jpg">圖片一</a>
    <a href="#" data-cursor-img="/images/nopic.png">圖片二</a>
    <a href="#" data-cursor-img="/images/logo/logo.svg">圖片三</a>
  </div>

  <template #content="{ imageSrc }">
    <img v-if="imageSrc" :src="imageSrc" alt="" class="h-24 w-40 rounded object-cover" />
  </template>
</Cursor>
```

同一個 `Cursor` 區域內，元件會優先讀取指標目前所在元素或其祖先的 `data-cursor-img`；若沒有，則使用作用區域內第一個設定的元素。圖片 URL 由使用端提供，應使用可信任且已驗證的來源。

## 行為與限制

- 游標使用 `position: fixed` 並依 `clientX`／`clientY` 更新位置，不會影響原本內容的 layout。
- 游標本體設為 `pointer-events-none`，不會攔截連結、按鈕或其他互動。
- `aria-hidden="true"`：游標是裝飾性 UI，不會取代原本的文字、焦點或鍵盤操作。
- 元件只處理 pointer 事件，不會因鍵盤 focus 顯示裝飾游標；預設 slot 內的可聚焦元素仍可正常使用。
- `ClientOnly` 與 `Teleport` 讓游標只在 client render，避免 SSR 期間讀取 DOM 或造成 hydration 差異。
- 事件由 Vue template 管理，沒有註冊全域 event listener；元件卸載時不會留下 listener 或 timer。
- 顯示與 hover transition 使用 `motion-reduce:transition-none`，使用者啟用 reduced motion 時不播放轉場。
- 元件不使用 `v-html`；`content` slot 的 HTML 由呼叫端負責，圖片 `src` 也應避免使用未驗證的外部輸入。

元件本身沒有硬編碼可翻譯的 UI label，因此不需要新增 i18n key。
