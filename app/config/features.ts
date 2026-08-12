/**
 * 控制網站功能是否對外啟用。
 *
 * 這些設定只負責功能可見性與路由入口；需要保護資料或操作權限時，仍須由 server 端驗證。
 */
export const featureConfig = {
  search: true,
  account: true,
  cart: true,
  sitemap: true,
  privacyPolicy: true,
} as const satisfies Record<string, boolean>

export type FeatureKey = keyof typeof featureConfig
