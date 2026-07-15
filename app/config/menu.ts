export const systemMenuConfig = {
  home: {
    route: '/',
    icon: 'home',
  },
  about: {
    route: '/about',
    icon: '',
  },
  news: {
    route: '/news',
    icon: '',
  },
  sample: {
    route: '/sample',
    icon: '',
  },
  content: {
    route: '',
    icon: '',
  },
} as const

export type SystemMenuCode = keyof typeof systemMenuConfig
