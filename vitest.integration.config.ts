import { fileURLToPath } from 'node:url'

import { defineVitestConfig } from '@nuxt/test-utils/config'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const buildDir = fileURLToPath(new URL('./.nuxt/test-vitest/', import.meta.url))

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    include: ['tests/integration/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts', './tests/integration/setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
    testTimeout: 30_000,
    hookTimeout: 30_000,
    environmentOptions: {
      nuxt: {
        rootDir,
        domEnvironment: 'happy-dom',
        overrides: {
          buildDir,
        },
        mock: {
          intersectionObserver: true,
          indexedDb: false,
        },
      },
    },
  },
})
