/*
 * @Author: vspirit803
 * @Date: 2021-03-29 13:51:50
 * @Description:
 * @LastEditTime: 2021-04-21 14:37:31
 * @LastEditors: vspirit803
 */
import 'quasar/dist/quasar.css';
import '@mdi/font/css/materialdesignicons.css';

import { Quasar } from 'quasar';
import mdi from 'quasar/icon-set/mdi-v5';
import { createApp } from 'vue';

import router from '@/router';

import App from './App.vue';

createApp(App).use(Quasar, { iconSet: mdi }).use(router).mount('#app');
