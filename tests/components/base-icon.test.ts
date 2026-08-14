import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseIcon from '~/components/icon/BaseIcon.vue'

describe('BaseIcon', () => {
  it('merges external classes without duplicating them on the svg root', () => {
    const wrapper = mount(BaseIcon, {
      props: {
        viewBox: '0 0 24 24',
      },
      attrs: {
        class: 'shrink-0 text-dimmed size-5',
      },
    })

    const classList = wrapper.get('svg').attributes('class').trim().split(/\s+/)
    const shrinkCount = classList.filter((className) => className === 'shrink-0').length
    const textDimmedCount = classList.filter((className) => className === 'text-dimmed').length

    expect(shrinkCount).toBe(1)
    expect(textDimmedCount).toBe(1)
    expect(classList).toContain('size-5')
    expect(classList).not.toContain('size-6')
  })
})
