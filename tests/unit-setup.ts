import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { defineComponent, h } from 'vue'
import { afterEach } from 'vitest'

import messages from '~/i18n/locales/zh-TW.json'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'zh-TW': messages,
  },
})

const ClientOnlyStub = defineComponent({
  name: 'ClientOnly',
  setup(_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

config.global.plugins = [i18n]
config.global.stubs = {
  ClientOnly: ClientOnlyStub,
}

afterEach(() => {
  document.body.innerHTML = ''
})
