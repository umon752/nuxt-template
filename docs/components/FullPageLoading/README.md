# FullPageLoading

由 `useFullPageLoading()` 控制的全頁載入遮罩。顯示期間會鎖定 body 捲動，並提供 `role="status"` live region。

原始碼：[FullPageLoading.vue](../../../app/components/FullPageLoading.vue)

延伸閱讀：[Loading 完整使用說明](loading-guide.md)

## 使用方式

元件已掛在應用程式根節點，頁面通常只需操作 composable：

```ts
const loading = useFullPageLoading()

loading.start('資料處理中')
try {
  await saveData()
} finally {
  loading.finish()
}

await loading.withLoading(() => fetchData(), '資料載入中')
```

元件沒有 Props 或 Events。預設 slot 提供 `{ label }`，可替換載入圖示：

```vue
<FullPageLoading v-slot="{ label }">
  <Spinner :label="label" spinner-class="size-10 text-white" />
</FullPageLoading>
```
