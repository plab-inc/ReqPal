// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify'
import autoImport from 'unplugin-auto-import/vite'

// Utilities
import {defineConfig} from 'vite'
import {fileURLToPath, URL} from 'node:url'
import svgLoader from 'vite-svg-loader'

//Base path
const base = process.env.NODE_ENV === 'production' ? '/' : '/';

// https://vitejs.dev/config/
export default defineConfig({
  base: base,
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    vuetify({
      autoImport: true,
    }),
    svgLoader(),
    autoImport({
      dts: "src/auto-imports.d.ts",
      imports: [
        'vue',
        'vue-router',
      ],
        vueTemplate: true,
        injectAtEnd: true
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