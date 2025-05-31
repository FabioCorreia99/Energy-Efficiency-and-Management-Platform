import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // <-- ESSA LINHA AQUI É IMPORTANTE
  plugins: [
    vue(),
    vueDevTools(),
    compression({
      algorithm: 'gzip', // ou 'brotliCompress'
      ext: '.gz',
      threshold: 1024,
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
