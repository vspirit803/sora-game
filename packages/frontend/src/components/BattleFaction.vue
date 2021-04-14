<!--
 * @Author: vspirit803
 * @Date: 2021-03-26 17:05:53
 * @Description: 
 * @LastEditTime: 2021-04-14 17:22:46
 * @LastEditors: vspirit803
-->
<template>
  <div class="faction">
    <div>{{ faction.name }}</div>
    <div class="teams" :class="reverse ? 'column' : 'column reverse'">
      <BattleTeam v-for="eachTeam of faction.teams" :key="eachTeam.uuid" :team="eachTeam" />
    </div>
  </div>
</template>

<script lang="ts">
import { FactionBattle } from 'sora-game-core';
import { defineComponent, PropType } from 'vue';

import BattleTeam from '@/components/BattleTeam.vue';

export default defineComponent({
  name: 'BattleFaction',
  components: { BattleTeam },
  props: {
    faction: {
      type: Object as PropType<FactionBattle>,
      required: true,
    },
    reverse: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
});
</script>
