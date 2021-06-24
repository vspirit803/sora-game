<!--
 * @Author: vspirit803
 * @Date: 2021-06-11 11:01:05
 * @Description:
 * @LastEditTime: 2021-06-24 10:28:16
 * @LastEditors: vspirit803
-->
<template>
  <div>
    <HomeButton />
    <q-toggle v-model="showImage" label="显示图片" />
    <q-toggle v-model="showBattleStats" label="显示战斗数据统计" />
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
