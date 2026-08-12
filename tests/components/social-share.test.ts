import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SocialShare from '~/components/socialShare/SocialShare.vue'

describe('SocialShare', () => {
  it('uses x as the platform name and named slot', () => {
    const wrapper = mount(SocialShare, {
      props: {
        platforms: ['x'],
      },
      slots: {
        x: ({ label }: { label: string }) => h('span', { 'data-testid': 'x-slot' }, label),
      },
    })

    const button = wrapper.get('button')

    expect(button.attributes('data-share-platform')).toBe('x')
    expect(button.attributes('aria-label')).toBe('分享到 X')
    expect(button.get('[data-testid="x-slot"]').text()).toBe('分享到 X')
  })
})
