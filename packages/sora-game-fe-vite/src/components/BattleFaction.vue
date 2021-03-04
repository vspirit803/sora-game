<template>
  <div class="faction">
    <div>{{ faction.name }}</div>
    <div class="teams d-flex" :class="reverse ? 'flex-column-reverse' : 'flex-column'">
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
