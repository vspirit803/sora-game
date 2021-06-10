<!--
 * @Author: vspirit803
 * @Date: 2021-03-26 17:05:53
 * @Description:
 * @LastEditTime: 2021-06-10 11:54:24
 * @LastEditors: vspirit803
-->
<template>
  <div class="faction" :class="reverse ? 'row reverse' : 'row'">
    <div class="faction-title column items-center">
      <span class="faction-name">{{ faction.name }}</span>
      <q-img class="family-pattern" :src="`/images/familyPatterns/${faction.familyPattern}.svg`" />
    </div>
    <div class="teams column">
      <BattleTeam
        v-for="eachTeam of faction.teams"
        :key="eachTeam.uuid"
        :team="eachTeam"
        :reverse="reverse"
        @onSelectSkill="onSelectSkill"
        @onSelectCharacter="onSelectCharacter"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { CharacterBattle, FactionBattle, SkillBattle } from 'sora-game-core';
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
<style lang="scss">
.teams {
  gap: 8px;
}

.faction-title {
  .faction-name {
    writing-mode: vertical-rl;
  }

  .family-pattern {
    width: 2rem;
    height: 2rem;
    object-fit: cover;
    background-size: cover;
    z-index: 1;
  }
}
</style>
