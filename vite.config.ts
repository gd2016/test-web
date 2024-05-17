import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import gzipPlugin from 'rollup-plugin-gzip'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import AutoImport from 'unplugin-auto-import/vite'
import { VueHooksPlusResolver } from '@vue-hooks-plus/resolvers'

// import fs from 'node:fs'
// import electron from 'vite-plugin-electron/simple'
// import pkg from './package.json'
// import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // fs.rmSync('dist-electron', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG
  return {
    base: '/ezoo-aio/',
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            lib: ['vue', 'axios', 'lodash-es', 'localforage', 'vue-hooks-plus'],
            ui: ['ant-design-vue']
          }
        }
      }
    },
    plugins: [
      vue(),
      gzipPlugin(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/auto-imports.d.ts',
        resolvers: [VueHooksPlusResolver()]
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      })
      // visualizer({
      //   open: true,
      //   gzipSize: true,
      //   brotliSize: true
      // })
    ],
    resolve: {
      extensions: ['.ts', '.vue', '.js'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '~/': `${path.resolve(__dirname, 'src')}/`
      }
    },
    css: {
      // css预处理器
      preprocessorOptions: {
        less: {}
      }
    },
    server: {
      middlewareMode: false,
      appType: 'custom',
      host: '127.0.0.1',
      port: 3008,
      proxy: {
        // '/aio/api/service': {
        //   target: 'http://localhost:5502',
        //   changeOrigin: true,
        //   headers: {
        //     host: 'http://localhost:5502',
        //     origin: 'http://localhost:5502'
        //   },
        //   rewrite(path) {
        //     return path.replace(/^\/aio\/api\/service/, '/api/infocenter')
        //   }
        // },
        '/aio/api': {
          target: 'https://dev.ezoodb.com',
          changeOrigin: true,
          headers: {
            host: 'https://dev.ezoodb.com',
            origin: 'https://dev.ezoodb.com'
          }
        }
      }
    },
    clearScreen: false
  }
})
