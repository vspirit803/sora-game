<!--
 * @Author: vspirit803
 * @Date: 2021-03-04 09:50:15
 * @Description:
 * @LastEditTime: 2021-06-18 09:47:18
 * @LastEditors: vspirit803
-->
<template>
  <div class="flex-row">
    <div style="margin-top: 300px">
      <q-btn @click="$router.push({ name: 'Battle' })">战斗</q-btn>
      <q-btn @click="$router.push({ name: 'Teams' })">编队</q-btn>
      <q-btn @click="$router.push({ name: 'Settings' })">设置</q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Main',
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
