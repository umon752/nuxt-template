# Composable 使用文件

本目錄收錄 `app/composables` 下可重用邏輯的公開 API、SSR 行為、side effects、清理方式與使用範例。

| Composable                | 文件                                      | 說明                                              |
| ------------------------- | ----------------------------------------- | ------------------------------------------------- |
| `useDrag`                 | [使用方式](use-drag.md)                   | Pointer Events 水平拖曳。                         |
| `useDropdownMenuPosition` | [使用方式](use-dropdown-menu-position.md) | 計算桌面版下拉選單面板位置。                      |
| `useFormValidation`       | [使用方式](use-form-validation.md)        | 共用 Email、電話、身分證與統編欄位驗證。          |
| `useNumberFormat`         | [使用方式](use-number-format.md)          | 依語系格式化數字與千分位。                        |
| `useObserverFade`         | [使用方式](use-observer-fade.md)          | IntersectionObserver 與 Web Animations 捲動淡入。 |
| `usePaginationQuery`      | [使用方式](use-pagination-query.md)       | 同步分頁狀態與 route query。                      |
| `useSocialShare`          | [使用方式](use-social-share.md)           | 分享連結與複製剪貼簿的共用邏輯。                  |

尚未文件化的既有 composable 與目前內容 hash 記錄在 `scripts/docs-consistency-baseline.json`。新增或修改 baseline 內的 composable 時，必須建立文件並移除對應 baseline 項目。
