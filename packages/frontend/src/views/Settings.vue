<!--
 * @Author: vspirit803
 * @Date: 2021-06-11 11:01:05
 * @Description:
 * @LastEditTime: 2021-06-11 11:05:10
 * @LastEditors: vspirit803
-->
<template>
  <div>
    <q-btn class="absolute-top-right" style="z-index: 999" @click="$router.push({ name: 'Home' })">退出</q-btn>
    <q-toggle v-model="showImage" label="显示图片" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useSettings } from '@/use';

export default defineComponent({
  name: 'Settings',
  setup() {
    return { ...useSettings() };
  },
});
</script>

<style lang="scss" scoped></style>
