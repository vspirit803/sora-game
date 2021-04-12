/*
 * @Author: vspirit803
 * @Date: 2021-03-29 13:51:50
 * @Description:
 * @LastEditTime: 2021-04-12 17:57:11
 * @LastEditors: vspirit803
 */
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@core': 'sora-game-core/src',
      '@': '/src',
    },
  },
  plugins: [vue()],
  define: {
    'process.env': {},
  },
});
