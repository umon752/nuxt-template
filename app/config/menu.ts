export const systemMenuConfig = {
  home: {
    route: '/',
    icon: 'home',
  },
  sample: {
    route: '/sample',
    icon: '',
  },
  examples: {
    route: '',
    icon: '',
  },
} as const

export type SystemMenuCode = keyof typeof systemMenuConfig
