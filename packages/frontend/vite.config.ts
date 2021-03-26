import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@src': 'sora-game-core/src',
      '@assets': 'sora-game-core/assets',
      '@saves': 'sora-game-core/saves',
      '@': '/src',
    },
  },
  plugins: [vue()],
  define: {
    'process.env': {},
  },
});
