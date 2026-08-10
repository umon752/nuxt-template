import { fileURLToPath } from 'node:url'

import { defineVitestConfig } from '@nuxt/test-utils/config'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const buildDir = fileURLToPath(new URL('./.nuxt/test-vitest/', import.meta.url))

export default defineVitestConfig({
  test: {
    environment: 'happy-dom',
    include: ['tests/components/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts', './tests/unit-setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
    environmentOptions: {
      nuxt: {
        rootDir,
        overrides: {
          buildDir,
        },
      },
    },
  },
})
