import { mount } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import { describe, expect, it } from 'vitest'

import Cursor from '~/components/cursor/Cursor.vue'

const getCursorElement = (): HTMLElement | null =>
  document.body.querySelector<HTMLElement>('[aria-hidden="true"]')

describe('Cursor', () => {
  it('shows and follows the pointer inside the trigger area', async () => {
    const wrapper = mount(Cursor, {
      slots: {
        default: '游標區域',
      },
    })

    const trigger = wrapper.get('div')

    await trigger.trigger('pointerenter', {
      clientX: 120,
      clientY: 80,
      pointerType: 'mouse',
    })

    const cursor = getCursorElement()

    expect(cursor).not.toBeNull()
    expect(cursor?.classList).toContain('opacity-100')
    expect(cursor?.style.left).toBe('120px')
    expect(cursor?.style.top).toBe('80px')
    expect(wrapper.emitted('enter')).toHaveLength(1)

    await trigger.trigger('pointermove', {
      clientX: 240,
      clientY: 160,
      pointerType: 'mouse',
    })

    expect(cursor?.style.left).toBe('240px')
    expect(cursor?.style.top).toBe('160px')
    expect(wrapper.emitted('move')).toHaveLength(1)

    await trigger.trigger('pointerleave', {
      clientX: 240,
      clientY: 160,
      pointerType: 'mouse',
    })
    await nextTick()

    expect(cursor?.classList).toContain('opacity-0')
    expect(wrapper.emitted('leave')).toHaveLength(1)
  })

  it('applies hover classes when a link or button is under the pointer', async () => {
    const wrapper = mount(Cursor, {
      props: {
        linkHover: true,
        hoverClass: 'size-12',
      },
      slots: {
        default: () => h('a', { href: '/about' }, '連結'),
      },
    })

    const trigger = wrapper.get('div')
    const link = wrapper.get('a')

    await trigger.trigger('pointerenter', {
      clientX: 10,
      clientY: 20,
      pointerType: 'mouse',
    })
    await link.trigger('pointermove', {
      clientX: 30,
      clientY: 40,
      pointerType: 'mouse',
    })
    await nextTick()

    const cursor = getCursorElement()

    expect(cursor?.classList).toContain('size-12')
    expect(cursor?.classList).toContain('opacity-100')
  })

  it('passes the nearest data-cursor-img source to the content slot', async () => {
    const wrapper = mount(Cursor, {
      slots: {
        default: () =>
          h(
            'div',
            {
              'data-cursor-img': '/images/demo/test-img.jpg',
            },
            '圖片區域'
          ),
        content: ({ imageSrc }) => h('img', { src: imageSrc, alt: '' }),
      },
    })

    const trigger = wrapper.get('div')
    const imageTarget = wrapper.get('[data-cursor-img]')

    await trigger.trigger('pointerenter', {
      clientX: 10,
      clientY: 20,
      pointerType: 'mouse',
    })
    await imageTarget.trigger('pointermove', {
      clientX: 10,
      clientY: 20,
      pointerType: 'mouse',
    })
    await nextTick()

    expect(getCursorElement()?.querySelector('img')?.getAttribute('src')).toBe(
      '/images/demo/test-img.jpg'
    )
  })

  it('does not fall back to an image target outside the pointer position', async () => {
    const wrapper = mount(Cursor, {
      slots: {
        default: () =>
          h('div', [
            h('p', '說明文字'),
            h('button', { 'data-cursor-img': '/images/demo/test-img.jpg' }, '圖片按鈕'),
          ]),
        content: ({ imageSrc }) => (imageSrc ? h('img', { src: imageSrc, alt: '' }) : undefined),
      },
    })

    const trigger = wrapper.get('div')

    await trigger.trigger('pointerenter', {
      clientX: 10,
      clientY: 20,
      pointerType: 'mouse',
    })
    await nextTick()

    expect(getCursorElement()?.querySelector('img')).toBeNull()

    await wrapper.get('button').trigger('pointermove', {
      clientX: 30,
      clientY: 40,
      pointerType: 'mouse',
    })
    await nextTick()

    expect(getCursorElement()?.querySelector('img')?.getAttribute('src')).toBe(
      '/images/demo/test-img.jpg'
    )
  })

  it('ignores touch pointers by default and can be disabled', async () => {
    const wrapper = mount(Cursor, {
      props: {
        touchDevice: false,
      },
      slots: {
        default: '游標區域',
      },
    })

    const trigger = wrapper.get('div')

    await trigger.trigger('pointerenter', {
      clientX: 10,
      clientY: 20,
      pointerType: 'touch',
    })
    expect(getCursorElement()).toBeNull()

    await wrapper.setProps({ touchDevice: true })
    await trigger.trigger('pointerenter', {
      clientX: 10,
      clientY: 20,
      pointerType: 'touch',
    })
    expect(getCursorElement()).not.toBeNull()

    await wrapper.setProps({ disabled: true })
    expect(getCursorElement()?.classList).toContain('opacity-0')
  })

  it('restores the trigger state and removes the teleported cursor on unmount', async () => {
    const wrapper = mount(Cursor, {
      props: {
        hideCursor: true,
      },
      slots: {
        default: '游標區域',
      },
    })

    const trigger = wrapper.get('div')
    await trigger.trigger('pointerenter', {
      clientX: 10,
      clientY: 20,
      pointerType: 'mouse',
    })

    expect(trigger.classes()).toContain('cursor-none')

    await trigger.trigger('pointerleave', {
      clientX: 10,
      clientY: 20,
      pointerType: 'mouse',
    })
    await nextTick()

    expect(trigger.classes()).not.toContain('cursor-none')

    await trigger.trigger('pointerenter', {
      clientX: 10,
      clientY: 20,
      pointerType: 'mouse',
    })
    wrapper.unmount()

    expect(getCursorElement()).toBeNull()
  })
})
