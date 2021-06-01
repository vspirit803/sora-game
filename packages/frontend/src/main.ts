/*
 * @Author: vspirit803
 * @Date: 2021-03-29 13:51:50
 * @Description:
 * @LastEditTime: 2021-06-01 16:19:40
 * @LastEditors: vspirit803
 */
import 'quasar/dist/quasar.css';
import '@mdi/font/css/materialdesignicons.css';

import { Quasar } from 'quasar';
import mdi from 'quasar/icon-set/mdi-v5';
import { createApp } from 'vue';
import ECharts from 'vue-echarts';

import router from '@/router';

import App from './App.vue';

createApp(App).component('v-chart', ECharts).use(Quasar, { iconSet: mdi }).use(router).mount('#app');
