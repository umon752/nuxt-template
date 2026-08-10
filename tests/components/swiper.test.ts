import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h, onMounted } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import BaseSwiper from '~/components/swiper/BaseSwiper.vue'

const { swiperMock } = vi.hoisted(() => ({
  swiperMock: {
    realIndex: 0,
    snapIndex: 0,
    snapGrid: [0, 1],
    isBeginning: true,
    isEnd: false,
    params: {
      slidesPerGroup: 1,
    },
    slidePrev: vi.fn(),
    slideNext: vi.fn(),
    slideTo: vi.fn(),
    slideToLoop: vi.fn(),
  },
}))

vi.mock('swiper/modules', () => ({
  A11y: {},
}))

vi.mock('swiper/vue', () => ({
  Swiper: defineComponent({
    name: 'Swiper',
    setup(_, { emit, slots }) {
      onMounted(() => emit('swiper', swiperMock))

      return () => h('div', { class: 'mock-swiper' }, slots.default?.())
    },
  }),
  SwiperSlide: defineComponent({
    name: 'SwiperSlide',
    setup(_, { slots }) {
      return () => h('div', { class: 'mock-swiper-slide' }, slots.default?.())
    },
  }),
}))

const items = [
  { id: 'one', label: '第一張' },
  { id: 'two', label: '第二張' },
]

describe('BaseSwiper', () => {
  it('emits ready and delegates navigation to the Swiper instance', async () => {
    const wrapper = mount(BaseSwiper, {
      props: {
        items,
      },
      slots: {
        slide: ({ item }: { item: (typeof items)[number] }) => item.label,
      },
    })

    expect(wrapper.emitted('ready')).toEqual([[swiperMock]])
    expect(wrapper.findAll('.mock-swiper-slide')).toHaveLength(2)

    await nextTick()

    const nextButton = wrapper.get('button[aria-label="下一張投影片"]')
    expect(nextButton.attributes('disabled')).toBeUndefined()
    await nextButton.trigger('click')

    expect(swiperMock.slideNext).toHaveBeenCalledOnce()
  })

  it('uses loop-aware navigation for a requested page', () => {
    const wrapper = mount(BaseSwiper, {
      props: {
        items,
        options: {
          loop: true,
        },
      },
    })

    const instance = wrapper.vm as unknown as {
      goTo: (index: number) => void
      goToPage: (index: number) => void
    }

    instance.goTo(1)
    instance.goToPage(1)

    expect(swiperMock.slideToLoop).toHaveBeenNthCalledWith(1, 1)
    expect(swiperMock.slideToLoop).toHaveBeenNthCalledWith(2, 1)
  })
})
