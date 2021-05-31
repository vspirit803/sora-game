<!--
 * @Author: vspirit803
 * @Date: 2021-03-04 09:50:15
 * @Description:
 * @LastEditTime: 2021-05-31 14:19:18
 * @LastEditors: vspirit803
-->
<template>
  <q-btn class="absolute-top-left" @click="onBattleStart">开始战斗</q-btn>
  <q-btn class="absolute-top-right" @click="$router.push({ name: 'Home' })">退出</q-btn>
  <div v-if="battle" class="battle">
    {{ battle.name }}
    <BattleFaction
      class="faction faction1"
      :faction="battle.factions[0]"
      reverse
      @onSelectSkill="onSelectSkill"
      @onSelectCharacter="onSelectCharacter"
    />
    <BattleFaction
      class="faction faction2"
      :faction="battle.factions[1]"
      @onSelectSkill="onSelectSkill"
      @onSelectCharacter="onSelectCharacter"
    />
    <BattleFaction
      v-if="battle.factions[2]"
      class="faction faction3"
      :faction="battle.factions[2]"
      @onSelectSkill="onSelectSkill"
      @onSelectCharacter="onSelectCharacter"
    />
  </div>
</template>

<script lang="ts">
import { Battle, CharacterBattle, EventDataSkillSelect, EventListenerBuilder, Game, SkillBattle } from 'sora-game-core';
import { defineComponent, nextTick, onUnmounted, provide, Ref, ref, shallowRef } from 'vue';

import BattleFaction from '@/components/BattleFaction.vue';

export default defineComponent({
  name: 'Battle',
  components: { BattleFaction },
  setup() {
    const game = Game.getInstance();
    const team = game.teamCenter.teams[0];
    const battle: Ref<Battle | undefined> = shallowRef();
    const availableTargets = shallowRef<Array<CharacterBattle>>([]);
    provide('availableTargets', availableTargets);
    let selectSkillData: EventDataSkillSelect | undefined = undefined;
    const selectSkillPromiseResolve = ref<((value?: unknown) => void) | undefined>(undefined);
    const availableSkills = shallowRef<Array<SkillBattle>>([]);
    provide('availableSkills', availableSkills);
    const selectedSkill = shallowRef<SkillBattle | undefined>(undefined);
    provide('selectedSkill', selectedSkill);
    const currActionCharacter = shallowRef<CharacterBattle | undefined>(undefined);
    provide('currActionCharacter', currActionCharacter);

    onUnmounted(() => {
      console.log('结束battle');
      battle.value?.end();
      console.log('已结束battle');
    });

    async function onBattleStart() {
      console.clear();
      battle.value = game.battleCenter.generateBattle('Battle00001', team);

      new EventListenerBuilder()
        .setEventCenter(battle.value!.eventCenter)
        .setEventType('SkillSelect')
        .setPriority(0)
        .setCallback(async (eventData: EventDataSkillSelect) => {
          availableSkills.value = eventData.availableSkills;
          currActionCharacter.value = eventData.source;
          selectSkillData = eventData;

          return new Promise((resolve) => {
            selectSkillPromiseResolve.value = resolve;
          });
        })
        .apply();

      nextTick(() => battle.value!.start());
    }

    function onSelectSkill(skill: SkillBattle) {
      if (selectSkillData) {
        selectSkillData.selectedSkill = skill;
        selectedSkill.value = skill;
        availableTargets.value = selectedSkill.value.getTargets();
      }
    }

    function onSelectCharacter(character: CharacterBattle) {
      selectSkillData!.selectedTarget = character;
      selectSkillPromiseResolve.value?.();
      availableSkills.value = [];
      availableTargets.value = [];
      selectSkillPromiseResolve.value = undefined;
      selectedSkill.value = undefined;
    }

    return { battle, onBattleStart, onSelectSkill, onSelectCharacter };
  },
});
</script>

<style lang="scss" scoped>
.battle {
  width: 100%;

  .faction {
    position: absolute;
  }

  .faction1 {
    right: 20px;
    bottom: 20px;
  }

  .faction2 {
    left: 20px;
    top: 20px;
  }

  .faction3 {
    right: 20px;
    top: 20px;
  }
}
</style>
