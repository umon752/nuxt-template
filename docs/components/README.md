# 元件使用文件

本目錄收錄 `app/components` 下所有 Vue 元件的用途、API 與使用範例。Nuxt 已啟用元件自動匯入；巢狀目錄元件依專案目前的命名方式使用，例如 `A11yAccessKeyLink`、`HeaderMobileMenuList`、`IconBaseIcon`、`PageHeaderPageBanner`。

## 通用元件

| 元件            | 文件                                    | 說明                                  |
| --------------- | --------------------------------------- | ------------------------------------- |
| Accordion       | [使用方式](Accordion/README.md)         | 展開／收合內容與程式化控制。          |
| Breadcrumb      | [使用方式](Breadcrumb/README.md)        | 麵包屑導覽。                          |
| Counter         | [使用方式](counter/Counter/README.md)   | 受控數量輸入與增減控制。              |
| CountUp         | [使用方式](countup/CountUp/README.md)   | 隨機或順序數字動畫與程式化控制。      |
| EmptyState      | [使用方式](EmptyState/README.md)        | 列表與搜尋結果的空資料狀態。          |
| FullPageLoading | [使用方式](FullPageLoading/README.md)   | 全頁載入遮罩。                        |
| IframeLazyLoad  | [使用方式](IframeLazyLoad/README.md)    | 延遲載入響應式 iframe。               |
| ImageLazyLoad   | [使用方式](ImageLazyLoad/README.md)     | 可控提前載入、響應式圖片與 fallback。 |
| Marquee         | [使用方式](marquee/Marquee/README.md)   | 無縫循環與拖曳跑馬燈。                |
| Odometer        | [使用方式](odometer/Odometer/README.md) | 逐位垂直滾動與最大值提示。            |
| Pagination      | [使用方式](Pagination/README.md)        | 受控分頁導覽。                        |
| SlideTab        | [使用方式](SlideTab/README.md)          | 可拖曳的橫向分類導覽。                |
| SocialShare     | [使用方式](SocialShare/README.md)       | 可拆用功能層的社群分享按鈕。          |
| Spinner         | [使用方式](Spinner/README.md)           | 載入指示器。                          |
| SwiperBase      | [使用方式](SwiperBase/README.md)        | 可自訂外層控制項的響應式輪播。        |
| Tooltip         | [使用方式](tooltip/Tooltip/README.md)   | 滑鼠與鍵盤提示文字。                  |
| VideoLazyLoad   | [使用方式](VideoLazyLoad/README.md)     | 延遲載入響應式影片。                  |

## Nuxt UI wrappers

| 元件              | 文件                                     | 說明                                                |
| ----------------- | ---------------------------------------- | --------------------------------------------------- |
| FormAppCheckbox   | [使用方式](form/AppCheckbox/README.md)   | Nuxt UI Checkbox wrapper。                          |
| FormAppCombobox   | [使用方式](form/AppCombobox/README.md)   | 可搜尋的單選下拉 wrapper。                          |
| FormAppDatePicker | [使用方式](form/AppDatePicker/README.md) | InputDate、Calendar 與 Popover 的日期選擇 wrapper。 |
| FormAppForm       | [使用方式](form/AppForm/README.md)       | 表單 state、schema 與 submit 行為 wrapper。         |
| FormAppFormField  | [使用方式](form/AppFormField/README.md)  | 表單欄位 label、description 與 error wrapper。      |
| FormAppInput      | [使用方式](form/AppInput/README.md)      | 專案統一輸入元件 wrapper。                          |
| FormAppRadioGroup | [使用方式](form/AppRadioGroup/README.md) | Nuxt UI RadioGroup wrapper。                        |
| FormAppSelect     | [使用方式](form/AppSelect/README.md)     | 專案單選下拉元件 wrapper。                          |
| FormAppSwitch     | [使用方式](form/AppSwitch/README.md)     | Nuxt UI Switch wrapper。                            |
| FormAppTextarea   | [使用方式](form/AppTextarea/README.md)   | 專案統一多行文字輸入 wrapper。                      |

## Modal

| 元件  | 文件                              | 說明                      |
| ----- | --------------------------------- | ------------------------- |
| Modal | [使用方式](modal/Modal/README.md) | 原生 dialog、focus trap。 |

## 無障礙與按鈕

| 元件          | 文件                                     | 說明                  |
| ------------- | ---------------------------------------- | --------------------- |
| AccessKeyLink | [使用方式](a11y/AccessKeyLink/README.md) | 網站區塊 access key。 |
| SkipLink      | [使用方式](a11y/SkipLink/README.md)      | 略過導覽連結。        |
| BtnDefault    | [使用方式](btn/BtnDefault/README.md)     | 通用按鈕。            |
| BtnGoTop      | [使用方式](btn/BtnGoTop/README.md)       | 回到頁首按鈕。        |

## 內容與版型

| 元件          | 文件                                        | 說明                     |
| ------------- | ------------------------------------------- | ------------------------ |
| CardDefault   | [使用方式](card/CardDefault/README.md)      | 基本內容卡片。           |
| EditorContent | [使用方式](editor/EditorContent/README.md)  | 編輯器 HTML 輸出。       |
| EditorModule  | [使用方式](editor/EditorModule/README.md)   | 模組化文章版型。         |
| Footer        | [使用方式](footer/Footer/README.md)         | 網站共用頁尾。           |
| PageBanner    | [使用方式](pageHeader/PageBanner/README.md) | 頁面橫幅。               |
| PageHeader    | [使用方式](pageHeader/PageHeader/README.md) | 橫幅、標題與麵包屑組合。 |
| PageTitle     | [使用方式](pageHeader/PageTitle/README.md)  | 頁面 H1。                |

## Header 與選單

| 元件                        | 文件                                                     | 說明               |
| --------------------------- | -------------------------------------------------------- | ------------------ |
| Header                      | [使用方式](header/Header/README.md)                      | 網站共用頁首。     |
| DesktopMultipleDropdownMenu | [使用方式](header/DesktopMultipleDropdownMenu/README.md) | 桌面多欄下拉選單。 |
| DesktopSingleDropdownMenu   | [使用方式](header/DesktopSingleDropdownMenu/README.md)   | 桌面受控下拉選單。 |
| MobileMenuList              | [使用方式](header/MobileMenuList/README.md)              | 手機遞迴選單。     |

## 圖示

| 元件           | 文件                                      | 說明           |
| -------------- | ----------------------------------------- | -------------- |
| BaseIcon       | [使用方式](icon/BaseIcon/README.md)       | SVG 圖示基底。 |
| IconArrowDown  | [使用方式](icon/IconArrowDown/README.md)  | 向下箭頭。     |
| IconArrowLeft  | [使用方式](icon/IconArrowLeft/README.md)  | 向左箭頭。     |
| IconArrowRight | [使用方式](icon/IconArrowRight/README.md) | 向右箭頭。     |
| IconArrowUp    | [使用方式](icon/IconArrowUp/README.md)    | 向上箭頭。     |
| IconCart       | [使用方式](icon/IconCart/README.md)       | 購物車。       |
| IconSearch     | [使用方式](icon/IconSearch/README.md)     | 搜尋。         |
| IconUser       | [使用方式](icon/IconUser/README.md)       | 使用者。       |

## Toast

| 元件       | 文件                                   | 說明                     |
| ---------- | -------------------------------------- | ------------------------ |
| Toast      | [使用方式](toast/Toast/README.md)      | 單一通知與 alertdialog。 |
| ToastStack | [使用方式](toast/ToastStack/README.md) | 全域堆疊通知容器。       |
