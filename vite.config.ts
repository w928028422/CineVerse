import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  base: process.env.NODE_ENV === 'production' ? '/CineVerse/' : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vue 核心库
          if (id.includes('vue') && !id.includes('vue-echarts')) {
            return 'vue-vendor'
          }
          // TDesign UI 库
          if (id.includes('tdesign')) {
            return 'tdesign-vendor'
          }
          // 图标库
          if (id.includes('lucide-vue-next')) {
            return 'icons-vendor'
          }
          // 工具库
          if (id.includes('axios') || id.includes('tailwind')) {
            return 'utils-vendor'
          }
          // 图表库
          if (id.includes('vue-echarts') || id.includes('echarts')) {
            return 'chart-vendor'
          }
          // 将 node_modules 中的其他库分组
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
    // 调整 chunk 大小警告限制到 1MB
    chunkSizeWarningLimit: 500,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
  },
})
