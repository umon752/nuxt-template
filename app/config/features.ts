/**
 * 控制網站功能是否對外啟用。
 *
 * 這些設定只負責功能可見性與路由入口；需要保護資料或操作權限時，仍須由 server 端驗證。
 */
export const featureConfig = {
  search: true,
  languageSwitcher: true,
  account: true,
  cart: true,
  sitemap: true,
  privacyPolicy: true,
} as const satisfies Record<string, boolean>

export type FeatureKey = keyof typeof featureConfig

/**
 * 控制網站無障礙導覽元件是否輸出。
 *
 * 這些設定只負責無障礙導覽 UI 的可見性，不影響頁面內容、路由或資料權限。
 */
export const a11yConfig = {
  skipLink: true,
  accessKeyLinks: true,
} as const satisfies Record<string, boolean>

export type A11yConfigKey = keyof typeof a11yConfig
