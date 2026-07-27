# Loading 使用說明

專案提供兩種不同用途的 loading：

- `NuxtLoadingIndicator`：由 Nuxt 自動處理路由切換，顯示頁面頂部進度條。
- `FullPageLoading`：用於必須阻止使用者繼續操作的重要非同步流程。

## 路由切換進度條

`NuxtLoadingIndicator` 已掛載在 `app/app.vue`，一般頁面切換不需要額外呼叫 API。

## 全頁 Loading

全頁遮罩已掛載在 `app/app.vue`，透過 `useFullPageLoading()` 控制：

```ts
const { start, finish } = useFullPageLoading()

const submit = async (): Promise<void> => {
  start('資料送出中，請稍候')

  try {
    await submitForm()
  } finally {
    finish()
  }
}
```

也可以使用 `withLoading()` 自動確保成功或失敗時都會關閉遮罩：

```ts
const { withLoading } = useFullPageLoading()

const submit = async (): Promise<void> => {
  await withLoading(() => submitForm(), '資料送出中，請稍候')
}
```

`start()`／`finish()` 內部使用計數，允許多個非同步工作同時共用遮罩。每次 `start()` 都必須對應一次 `finish()`；只有計數歸零後遮罩才會關閉。`clear()` 僅適合在需要強制重設狀態時使用。

一般資料列表載入仍應優先使用區塊 skeleton 或區域 loading，不要顯示全頁遮罩。
