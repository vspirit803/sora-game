/*
 * @Author: vspirit803
 * @Date: 2021-03-29 13:51:50
 * @Description:
 * @LastEditTime: 2021-06-24 13:25:32
 * @LastEditors: vspirit803
 */
import 'quasar/dist/quasar.css';
import '@mdi/font/css/materialdesignicons.css';
import '@/style/rarity.scss';

import { Quasar } from 'quasar';
import mdi from 'quasar/icon-set/mdi-v5';
import { i18n } from 'sora-game-assets';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

import HomeButton from '@/components/HomeButton.vue';
import router from '@/router';

import App from './App.vue';

const i18nPlugin = createI18n({
  locale: 'zh-CN', // set locale
  fallbackLocale: 'zh-CN', // set fallback locale
  messages: i18n,
});

createApp(App)
  .use(Quasar, { iconSet: mdi })
  .use(router)
  .use(i18nPlugin)
  .component('HomeButton', HomeButton)
  .mount('#app');
