# SwiperBase

以 Swiper Vue 封裝資料驅動輪播。投影片留在 Swiper 內，上一張、分頁與下一張控制項渲染在 Swiper 外，並可透過 slots 完整替換結構。元件使用 Swiper instance 控制移動，不依賴 `prevEl`、`nextEl` 或 DOM selector。

原始碼：[SwiperBase.vue](../../../app/components/SwiperBase.vue)

## 基本使用

```vue
<script setup lang="ts">
const items = [
  { id: 1, title: '第一張' },
  { id: 2, title: '第二張' },
  { id: 3, title: '第三張' },
]
</script>

<template>
  <SwiperBase
    :items="items"
    :options="{
      slidesPerView: 1,
      spaceBetween: 24,
      breakpoints: {
        768: { slidesPerView: 2 },
      },
    }"
  >
    <template #slide="{ item, isActive }">
      <article :class="{ 'ring-2': isActive }">
        {{ item.title }}
      </article>
    </template>
  </SwiperBase>
</template>
```

`items` 使用 Vue SFC generic 推導 slot 中的資料型別，每筆資料必須包含唯一的 `id: string | number`。

## 初始化與 SSR

SSR 輸出及 client-side Swiper 初始化完成前，元件會以 `visibility: hidden` 隱藏整個輪播與控制列；`@swiper` 取得 instance、同步目前狀態後才顯示並觸發 `ready`。`visibility` 會保留版面與可測量的容器寬度，讓 Swiper 能正確套用 `slidesPerView` 與 breakpoints，同時避免 Swiper 預設 `width: 100%` 使首屏短暫只顯示一張投影片。

## 自訂外層控制項

```vue
<SwiperBase :items="items" :options="{ slidesPerView: 1 }">
  <template #slide="{ item }">
    <article>{{ item.title }}</article>
  </template>

  <template #previous="{ previous, disabled }">
    <BtnDefault text="上一張" :disabled="disabled" @click="previous" />
  </template>

  <template #pagination="{ activeIndex, count, goTo }">
    <div class="flex gap-2" role="group" aria-label="選擇投影片">
      <button
        v-for="index in count"
        :key="index"
        type="button"
        :aria-current="activeIndex === index - 1 ? 'true' : undefined"
        :aria-label="`前往第 ${index} 張投影片`"
        @click="goTo(index - 1)"
      >
        {{ index }}
      </button>
    </div>
  </template>

  <template #next="{ next, disabled }">
    <BtnDefault text="下一張" :disabled="disabled" @click="next" />
  </template>
</SwiperBase>
```

Pagination 的 `count` 來自 Swiper `snapGrid`，會依 `slidesPerView`、`slidesPerGroup` 與 breakpoint 更新；`activeIndex` 是目前 snap page，`activeSlideIndex` 則是目前真實投影片索引。啟用 `loop` 時，投影片跳轉會使用 `slideToLoop()`。

## Props

| Prop                | 型別                       | 預設值 | 說明                                                       |
| ------------------- | -------------------------- | ------ | ---------------------------------------------------------- |
| `items`             | `T[]`                      | 必填   | 輪播資料；`T extends { id: string \| number }`。           |
| `options`           | `TSwiperBaseOptions`       | `{}`   | 傳給 Swiper 的設定，例如 breakpoints、loop、spaceBetween。 |
| `modules`           | `SwiperOptions['modules']` | `[]`   | 額外 Swiper modules；A11y 一律由元件加入。                 |
| `a11y`              | `A11yOptions`              | `{}`   | 覆蓋元件預設的 Swiper A11y 設定。                          |
| `ariaLabel`         | `string`                   | 翻譯值 | 輪播容器 accessible name。                                 |
| `previousLabel`     | `string`                   | 翻譯值 | 預設上一張按鈕與 Swiper A11y 訊息。                        |
| `nextLabel`         | `string`                   | 翻譯值 | 預設下一張按鈕與 Swiper A11y 訊息。                        |
| `paginationLabel`   | `string`                   | 翻譯值 | 預設 pagination 群組 accessible name。                     |
| `swiperClass`       | `ClassValue`               | `''`   | Swiper 根元素 class。                                      |
| `slideClass`        | `ClassValue`               | `''`   | 每個 `SwiperSlide` class。                                 |
| `controlsClass`     | `ClassValue`               | `''`   | Swiper 外層 controls 容器 class。                          |
| `buttonClass`       | `ClassValue`               | `''`   | 預設上一張與下一張按鈕 class。                             |
| `paginationClass`   | `ClassValue`               | `''`   | 預設 pagination 容器 class。                               |
| `bulletClass`       | `ClassValue`               | `''`   | 預設 pagination bullet class。                             |
| `activeBulletClass` | `ClassValue`               | `''`   | Active bullet class。                                      |
| `disabledClass`     | `ClassValue`               | `''`   | Disabled 上一張／下一張按鈕 class。                        |

額外 modules 所需的 CSS 需由使用端自行匯入，例如使用 Swiper Navigation 或 Pagination module 時匯入對應樣式。`swiper/css` 已由元件載入。

內部的 `TSwiperBaseOptions` 從 Swiper Vue 元件的實際 props 擷取 `SwiperOptions` 同名欄位，再排除由元件獨立管理的 `a11y`、`modules`，避免 Swiper 核心 options 與 Vue props 的型別差異。

## Slots

- `slide`：`{ item, index, isActive }`。
- `previous`：`{ previous, disabled }`。
- `pagination`：`{ activeIndex, activeSlideIndex, count, goTo }`；此處 `goTo()` 接收 snap page index。
- `next`：`{ next, disabled }`。

未提供控制項 slots 時，元件會輸出具 `button type="button"`、disabled 狀態、`aria-label` 與 `aria-current` 的預設控制項。

## Events

| Event    | Payload                           | 觸發時機                     |
| -------- | --------------------------------- | ---------------------------- |
| `ready`  | `(swiper: Swiper)`                | Swiper instance 初始化完成。 |
| `change` | `(index: number, swiper: Swiper)` | 真實投影片索引變更。         |

## 公開方法

透過 template ref 可呼叫：

- `previous()`、`next()`：移動至前一／後一張。
- `goTo(index)`：依真實投影片索引移動；loop 模式使用 `slideToLoop()`。
- `goToPage(index)`：依 snap page index 移動。
- `getSwiper()`：取得 Swiper instance，尚未初始化時為 `undefined`。

## 無障礙與 i18n

元件固定加入 Swiper A11y module。預設翻譯鍵值位於 `components.swiperBase`：`ariaLabel`、`roleDescription`、`itemRoleDescription`、`previous`、`next`、`first`、`last`、`pagination`、`goToSlide`、`slideLabel`。

自訂 `previous`、`pagination` 或 `next` slot 時，使用端需自行保留按鈕 accessible name、disabled 狀態及 active pagination 的 `aria-current`。
