<!--
 * @Author: vspirit803
 * @Date: 2021-03-26 17:05:53
 * @Description: 
 * @LastEditTime: 2021-04-14 17:24:00
 * @LastEditors: vspirit803
-->
<template>
  <div class="team">
    <div class="text-left">{{ team.name }}</div>
    <div class="members row">
      <BattleCharacter v-for="eachCharacter of team.members" :key="eachCharacter.uuid" :character="eachCharacter" />
    </div>
  </div>
</template>

<script lang="ts">
import { TeamBattle } from 'sora-game-core';
import { defineComponent, PropType } from 'vue';

import BattleCharacter from '@/components/BattleCharacter.vue';

export default defineComponent({
  name: 'BattleTeam',
  components: { BattleCharacter },
  props: {
    team: {
      required: true,
      type: Object as PropType<TeamBattle>,
    },
  },
});
</script>
