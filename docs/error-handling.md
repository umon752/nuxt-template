## 錯誤處理

- `catch` 中的錯誤視為 `unknown`，使用 `instanceof Error` 或自訂 guard 縮窄。
- 領域或 API 錯誤可建立自訂 `Error` subclass，包含可操作的 code/status。
- 不得靜默吞掉錯誤；應處理、轉換成明確結果，或重新拋出。
- 錯誤訊息應包含操作脈絡，但不得記錄密碼、token 或個資。
