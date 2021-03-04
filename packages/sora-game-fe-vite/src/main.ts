import { createApp } from 'vue'
import App from './App.vue'

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/lib/styles/main.sass";
// @ts-ignore
import { createVuetify } from "vuetify";
// @ts-ignore
import * as components from "vuetify/lib/components";
import * as directives from "vuetify/lib/directives";

const vuetify = createVuetify({
  components,
  directives,
});

console.log(vuetify)

createApp(App).use(vuetify).mount('#app')
