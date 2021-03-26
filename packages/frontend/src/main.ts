import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/lib/styles/main.sass';

import { createApp } from 'vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createVuetify } from 'vuetify';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as components from 'vuetify/lib/components';
import * as directives from 'vuetify/lib/directives';

import router from '@/router';

import App from './App.vue';

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(router).use(vuetify).mount('#app');
