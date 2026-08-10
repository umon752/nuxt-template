import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import IframeLazyLoad from '~/components/lazyload/IframeLazyLoad.vue'
import ImageLazyLoad from '~/components/lazyload/ImageLazyLoad.vue'
import VideoLazyLoad from '~/components/lazyload/VideoLazyLoad.vue'
import { TestIntersectionObserver, triggerIntersection } from '../utils/dom'

describe('ImageLazyLoad', () => {
  it('loads only after intersection and switches to the fallback after an error', async () => {
    const wrapper = mount(ImageLazyLoad, {
      props: {
        src: '/images/main.jpg',
        fallbackSrc: '/images/fallback.jpg',
        alt: '示範圖片',
      },
    })

    const container = wrapper.get('span').element
    const image = wrapper.get('img')

    expect(image.attributes('src')).toBeUndefined()

    triggerIntersection(container)
    await nextTick()

    expect(image.attributes('src')).toBe('/images/main.jpg')

    await image.trigger('load')
    expect(wrapper.emitted('load')).toHaveLength(1)
    expect(image.classes()).toContain('opacity-100')

    await image.trigger('error')
    expect(image.attributes('src')).toBe('/images/fallback.jpg')

    await image.trigger('error')
    expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('示範圖片')
    expect(wrapper.emitted('error')?.length).toBeGreaterThanOrEqual(2)
  })
})

describe('VideoLazyLoad', () => {
  it('activates the video source and reports load and error states', async () => {
    const wrapper = mount(VideoLazyLoad, {
      props: {
        src: '/videos/demo.mp4',
      },
    })

    const container = wrapper.get('div').element
    const video = wrapper.get('video')

    expect(video.attributes('src')).toBeUndefined()

    triggerIntersection(container)
    await nextTick()

    expect(video.attributes('src')).toBe('/videos/demo.mp4')

    await video.trigger('loadedmetadata')
    expect(wrapper.emitted('load')).toHaveLength(1)

    await video.trigger('error')
    expect(wrapper.get('[role="status"]').text()).toContain('影片載入失敗')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })
})

describe('IframeLazyLoad', () => {
  it('does not render the iframe before activation and reports load and error states', async () => {
    const wrapper = mount(IframeLazyLoad, {
      props: {
        src: 'https://example.com/embed',
        title: '嵌入內容',
      },
    })

    const container = wrapper.get('div').element
    expect(wrapper.find('iframe').exists()).toBe(false)

    triggerIntersection(container)
    await nextTick()

    const iframe = wrapper.get('iframe')
    expect(iframe.attributes('src')).toBe('https://example.com/embed')

    await iframe.trigger('load')
    expect(wrapper.emitted('load')).toHaveLength(1)

    await iframe.trigger('error')
    expect(wrapper.get('[role="status"]').text()).toContain('嵌入內容載入失敗')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('disconnects the observer when it is unmounted', async () => {
    const wrapper = mount(IframeLazyLoad, {
      props: {
        src: 'https://example.com/embed',
        title: '嵌入內容',
      },
    })

    await nextTick()
    const observer = TestIntersectionObserver.instances.at(-1)

    wrapper.unmount()

    expect(observer?.disconnectCalls).toBeGreaterThan(0)
  })
})
