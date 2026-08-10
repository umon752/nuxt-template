import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import SamplePage from '~/pages/sample.vue'

const mountSamplePage = () =>
  mountSuspended(SamplePage, {
    route: '/sample',
  })

const getButtonByText = (wrapper: Awaited<ReturnType<typeof mountSuspended>>, text: string) => {
  const button = wrapper.findAll('button').find((candidate) => candidate.text() === text)

  expect(button, `找不到按鈕：${text}`).toBeDefined()
  return button!
}

describe('sample page integration', () => {
  it('renders auto-imported components and keeps CountUp controls connected', async () => {
    const wrapper = await mountSamplePage()

    expect(wrapper.text()).toContain('CountUp 數字動畫元件')
    expect(wrapper.text()).toContain('Odometer 里程表數字元件')
    expect(wrapper.findAll('.inline-block.tabular-nums')).toHaveLength(2)

    await getButtonByText(wrapper, 'Run（含延遲）').trigger('click')
    expect(wrapper.text()).toContain('最後事件：執行：')

    await getButtonByText(wrapper, 'Stop').trigger('click')
    expect(wrapper.text()).toContain('最後事件：暫停：')

    await getButtonByText(wrapper, 'Start（立即繼續）').trigger('click')
    expect(wrapper.text()).toContain('最後事件：繼續：')

    await getButtonByText(wrapper, 'Reset').trigger('click')
    expect(wrapper.text()).toContain('最後事件：重設：')

    await getButtonByText(wrapper, 'Restart').trigger('click')
    expect(wrapper.text()).toContain('最後事件：執行：')
  })

  it('updates the Odometer value through the sample page control', async () => {
    const wrapper = await mountSamplePage()

    const odometerInput = wrapper.get('input[type="number"]')
    await odometerInput.setValue('5432')
    await getButtonByText(wrapper, '更新數值').trigger('click')

    expect(wrapper.text()).toContain('最後事件：更新：5432')
  })
})
