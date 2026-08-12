import { markRaw } from 'vue'

import IconChevronDown from '~/components/icon/IconChevronDown.vue'

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()

  // 直接替換，避免 updateAppConfig 將 Vue component 與原本的 icon 字串 deep merge。
  appConfig.ui.icons.chevronDown = markRaw(IconChevronDown) as unknown as string
})
