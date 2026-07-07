## JavaScript 與非同步程式

- 禁止使用 `var`；預設使用 `const`，只有需要重新賦值時才使用 `let`。
- Promise 不得處於未處理狀態；應使用 `await`、明確回傳，或附加錯誤處理。
- 非同步操作應使用 `try/catch` 處理錯誤；無法在當前層處理時，記錄必要脈絡後重新拋出。
- 立即執行的初始化或 bootstrap 邏輯應包在 IIFE 中，避免散落的 top-level 執行流程。

```ts
;(async () => {
  try {
    await init()
    await bootstrap()
  } catch (error: unknown) {
    console.error('Application bootstrap failed:', error)
    throw error
  }
})()
```
