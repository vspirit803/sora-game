<!--
 * @Author: vspirit803
 * @Date: 2021-03-11 14:00:45
 * @Description: 
 * @LastEditTime: 2021-03-11 16:06:52
 * @LastEditors: vspirit803
-->
<template>
  <div class="buff">
    <!-- <img class="buff-icon" src="/images/buffs/stunned.png" :title="buff.name" /> -->
    <div
      class="buff-icon"
      style="background-image: url(/images/buffs/stunned.png); background-size: cover"
      :title="buff.name"
    />
  </div>
</template>

<script lang="ts">
import { Buff } from 'sora-game-core';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'Buff',
  props: {
    buff: {
      required: true,
      type: Object as PropType<Buff>,
    },
  },
});
</script>
<style lang="scss" scoped>
.buff {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.75rem;

  &-icon {
    width: 100%;
    height: 100%;
  }
}
</style>
