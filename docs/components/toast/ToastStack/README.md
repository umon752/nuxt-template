# ToastStack

全域 Toast 容器，讀取 `useToast()` 狀態並將通知 Teleport 到 `<body>`；預設固定在畫面右上角。

原始碼：[ToastStack.vue](../../../../app/components/toast/ToastStack.vue)

## 掛載

應用程式只需掛載一次：

```vue
<!-- app/app.vue -->
<template>
  <NuxtPage />
  <ToastStack />
</template>
```

頁面透過 composable 操作：

```ts
const toast = useToast()

const id = toast.show({
  text: '資料儲存成功',
  duration: 2500,
})

toast.update(id, { text: '通知內容已更新' })
toast.hide(id) // 播放離場動畫後移除
toast.remove(id) // 立即移除
toast.clear() // 清空全部
```

| Prop         | 型別                            | 預設值      | 說明                                                   |
| ------------ | ------------------------------- | ----------- | ------------------------------------------------------ |
| `position`   | `fixed \| absolute \| relative` | `fixed`     | 容器定位。                                             |
| `x` / `y`    | `string`                        | `undefined` | 容器 CSS `left` / `top`；未給 `x` 時使用預設右側定位。 |
| `stackClass` | `ClassValue`                    | `''`        | 堆疊容器 class。                                       |
| `toastClass` | `ClassValue`                    | `''`        | 套用到每一則 Toast 的共用 class。                      |

`useToast().show()` 的選項與 Toast props 對應，並會回傳通知 ID。一般通知使用 `role: 'status'`；緊急通知可使用 `role: 'alert'`；阻塞式通知使用 `role: 'alertdialog'` 並提供 `ariaLabel`。
