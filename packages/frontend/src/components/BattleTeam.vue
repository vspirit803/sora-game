<!--
 * @Author: vspirit803
 * @Date: 2021-03-26 17:05:53
 * @Description:
 * @LastEditTime: 2021-06-07 17:05:07
 * @LastEditors: vspirit803
-->
<template>
  <div class="team" :class="reverse ? 'row reverse' : 'row'">
    <div v-if="team.faction.hasMultipleTeams" class="text-left team-name">{{ team.name }}</div>
    <div class="members" :class="reverse ? 'row reverse' : 'row'">
      <BattleCharacter
        v-for="eachCharacter of team.members"
        :key="eachCharacter.uuid"
        :character="eachCharacter"
        @onSelectSkill="onSelectSkill"
        @onSelectCharacter="onSelectCharacter"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { CharacterBattle, SkillBattle, TeamBattle } from 'sora-game-core';
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
    reverse: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['onSelectSkill', 'onSelectCharacter'],
  setup(_props, { emit }) {
    function onSelectSkill(skill: SkillBattle) {
      emit('onSelectSkill', skill);
    }

    function onSelectCharacter(character: CharacterBattle) {
      emit('onSelectCharacter', character);
    }

    return { onSelectSkill, onSelectCharacter };
  },
});
</script>

<style>
.members {
  gap: 8px;
}

.team-name {
  writing-mode: vertical-rl;
}
</style>
