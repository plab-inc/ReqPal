// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path';
import { readdirSync } from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    autoImport({
      dts: true,
      imports:
          ['vue', 'vue-router', 'pinia',
            //{ from: 'vue-router', imports: ['Router, RouteLocationRaw'], type: true },
            //{ from: 'vue-router', imports: ['createRouter', 'createWebHistory'] }
          ],
    }),
    components({
      dirs: [],
      resolvers: [
        name => readdirSync(resolve(__dirname, './src/components'))
            .filter(file => file.endsWith('.component.vue'))
            .map(file => file.split('.')[0])
            .includes(name) ? { name: "default", from: `@/components/${name}.component.vue` } : undefined,
      ],
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
})