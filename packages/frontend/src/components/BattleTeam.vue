<template>
  <div class="team">
    <div class="text-left">{{ team.name }}</div>
    <div class="members d-flex">
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
