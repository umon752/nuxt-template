import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import Modal, { type TModalInstance } from '~/components/modal/Modal.vue'

const getInstance = (wrapper: ReturnType<typeof mount>): TModalInstance =>
  wrapper.vm as unknown as TModalInstance

const flushModal = async (): Promise<void> => {
  await nextTick()
  await nextTick()
}

describe('Modal', () => {
  it('renders an accessible dialog and closes from the close button', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true,
        title: '測試視窗',
      },
      slots: {
        default: '視窗內容',
      },
    })

    await flushModal()

    const dialog = document.body.querySelector('dialog')
    expect(dialog).not.toBeNull()
    expect(dialog?.getAttribute('role')).toBe('dialog')
    expect(dialog?.getAttribute('aria-labelledby')).toMatch(/^modal-title-/)
    expect(dialog?.textContent).toContain('視窗內容')

    const closeButton = dialog?.querySelector('button[aria-label="關閉視窗"]')
    expect(closeButton).not.toBeNull()
    closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('exposes open and close controls through the public API', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: false,
      },
    })

    getInstance(wrapper).open()
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])

    await wrapper.setProps({ modelValue: true })
    await flushModal()
    getInstance(wrapper).close()

    expect(wrapper.emitted('update:modelValue')).toEqual([[true], [false]])
  })

  it('requests an escape close only when closeOnEscape is enabled', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true,
        closeOnEscape: true,
      },
    })

    await flushModal()
    const dialog = document.body.querySelector('dialog')
    dialog?.dispatchEvent(new Event('cancel', { bubbles: true, cancelable: true }))

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('requests a backdrop close when the backdrop is clicked', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true,
        closeOnBackdrop: true,
      },
    })

    await flushModal()
    const dialog = document.body.querySelector('dialog')
    const backdrop = dialog?.querySelector('div')

    backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })
})
