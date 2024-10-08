import swc from 'unplugin-swc'
import configPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['**/data/**', '**/node_modules/**'],
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/e2e-setup.ts'],
  },
  plugins: [
    configPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
