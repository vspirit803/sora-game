/*
 * @Author: vspirit803
 * @Date: 2021-03-29 13:51:50
 * @Description:
 * @LastEditTime: 2021-06-22 16:06:22
 * @LastEditors: vspirit803
 */
import 'quasar/dist/quasar.css';
import '@mdi/font/css/materialdesignicons.css';
import '@/style/rarity.scss';

import { Quasar } from 'quasar';
import mdi from 'quasar/icon-set/mdi-v5';
import { i18n } from 'sora-game-assets';
import { createApp } from 'vue';
import ECharts from 'vue-echarts';
import { createI18n, useI18n } from 'vue-i18n';

import router from '@/router';

import App from './App.vue';

const i18nPlugin = createI18n({
  locale: 'zh-CN', // set locale
  fallbackLocale: 'zh-CN', // set fallback locale

  messages: i18n, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
});
window.i18nPlugin = i18nPlugin;
window.useI18n = useI18n;
createApp(App).component('v-chart', ECharts).use(Quasar, { iconSet: mdi }).use(router).use(i18nPlugin).mount('#app');
