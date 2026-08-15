export const systemMenuConfig = {
  home: {
    icon: 'home',
  },
  sample: {
    icon: '',
  },
  examples: {
    icon: '',
  },
} as const

export type SystemMenuCode = keyof typeof systemMenuConfig
