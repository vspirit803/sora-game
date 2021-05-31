<!--
 * @Author: vspirit803
 * @Date: 2021-03-04 09:50:15
 * @Description:
 * @LastEditTime: 2021-05-31 17:29:47
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

    <BattleAutoModeSwitch v-model:enabled="isAutoModeEnabled" class="absolute-bottom-left" />
  </div>
</template>

<script lang="ts">
import { Battle, CharacterBattle, EventDataSkillSelect, EventListenerBuilder, Game, SkillBattle } from 'sora-game-core';
import { defineComponent, nextTick, onUnmounted, provide, Ref, ref, shallowRef, watch } from 'vue';

import BattleAutoModeSwitch from '@/components/BattleAutoModeSwitch.vue';
import BattleFaction from '@/components/BattleFaction.vue';

export default defineComponent({
  name: 'Battle',
  components: { BattleFaction, BattleAutoModeSwitch },
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
    const isAutoModeEnabled = ref(false);
    const fireTarget = shallowRef<CharacterBattle | undefined>(undefined);
    provide('fireTarget', fireTarget);
    const protectTarget = shallowRef<CharacterBattle | undefined>(undefined);
    provide('protectTarget', protectTarget);

    onUnmounted(() => {
      console.log('结束battle');
      battle.value?.end();
      console.log('已结束battle');
    });

    async function onBattleStart() {
      console.clear();
      battle.value = game.battleCenter.generateBattle('Battle00001', team);
      isAutoModeEnabled.value = battle.value!.autoMode;

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

      new EventListenerBuilder()
        .setEventCenter(battle.value!.eventCenter)
        .setEventType('BattleSuccess')
        .setPriority(0)
        .setCallback(async () => {
          isAutoModeEnabled.value = false;
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
      if (isAutoModeEnabled.value) {
        if (character.faction !== battle.value!.factions[0]) {
          battle.value!.setFireTarget(character);
          fireTarget.value = character;
        } else {
          battle.value!.setProtectTarget(character);
          protectTarget.value = character;
        }
      } else if (availableTargets.value.includes(character)) {
        selectSkillData!.selectedTarget = character;
        selectSkillPromiseResolve.value?.();
        availableSkills.value = [];
        availableTargets.value = [];
        selectSkillPromiseResolve.value = undefined;
        selectedSkill.value = undefined;
      }
    }

    watch(isAutoModeEnabled, (newVal) => {
      battle.value!.autoMode = newVal;

      if (selectSkillPromiseResolve.value) {
        selectSkillPromiseResolve.value?.();
        availableSkills.value = [];
        availableTargets.value = [];
        selectSkillPromiseResolve.value = undefined;
        selectedSkill.value = undefined;
      }
    });

    return { battle, onBattleStart, onSelectSkill, onSelectCharacter, isAutoModeEnabled };
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
