/*
 * @Author: vspirit803
 * @Date: 2021-03-29 13:51:50
 * @Description:
 * @LastEditTime: 2021-04-14 17:15:52
 * @LastEditors: vspirit803
 */
import 'quasar/dist/quasar.css';

import { Quasar } from 'quasar';
import { createApp } from 'vue';

import router from '@/router';

import App from './App.vue';

createApp(App).use(Quasar).use(router).mount('#app');
