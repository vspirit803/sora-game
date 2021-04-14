<!--
 * @Author: vspirit803
 * @Date: 2021-03-04 09:50:15
 * @Description: 
 * @LastEditTime: 2021-04-14 16:57:09
 * @LastEditors: vspirit803
-->
<template>
  <div class="flex-row">
    <div id="banners" style="position: absolute; z-index: 500">
      <AutoBanners />
    </div>
    <div style="margin-top: 300px">
      <q-btn @click="$router.push({ name: 'Battle' })">战斗</q-btn>
      <q-btn @click="$router.push({ name: 'Teams' })">编队</q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AutoBanners from '@/components/AutoBanners.vue';

export default defineComponent({
  name: 'HelloWorld',
  components: { AutoBanners },
});
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
