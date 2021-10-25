<!--
 * @Author: vspirit803
 * @Date: 2021-03-04 09:50:15
 * @Description:
 * @LastEditTime: 2021-10-07 09:42:24
 * @LastEditors: vspirit803
-->
<template>
  <div class="battle">
    <HomeButton class="absolute-top-left" />
    <q-btn v-if="!battle" class="absolute-center" @click="onBattleStart">开始战斗</q-btn>
    <template v-if="battle">
      <span class="text-h2 battle-name absolute-top-right">{{ battle.name }}</span>
      <BattleFaction
        class="faction faction1"
        :faction="battle.factions[0]"
        :reverse="true"
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
      <BattleStats v-if="showBattleStats" class="battle-status absolute-top-right" :battle="battle" />

      <q-dialog v-model="showResultDialog" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-teal text-white" style="width: 300px">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">{{ result ? '胜利' : '失败' }}</div>
            <q-space />
            <q-btn v-close-popup icon="mdi-check" flat round dense @click="$router.push({ name: 'Home' })" />
          </q-card-section>
          <q-card-section class="q-pt-none">123 </q-card-section>
        </q-card>
      </q-dialog>
    </template>
  </div>
</template>

<script lang="ts">
import { Battle, CharacterBattle, EventDataSkillSelect, EventListenerBuilder, Game, SkillBattle } from 'sora-game-core';
import {
  defineAsyncComponent,
  defineComponent,
  nextTick,
  onUnmounted,
  provide,
  Ref,
  ref,
  shallowRef,
  watch,
} from 'vue';

import BattleAutoModeSwitch from '@/components/BattleAutoModeSwitch.vue';
import BattleFaction from '@/components/BattleFaction.vue';
import { useSettings } from '@/use';

export default defineComponent({
  name: 'Battle',
  components: {
    BattleFaction,
    BattleAutoModeSwitch,
    BattleStats: defineAsyncComponent(() => import('@/components/BattleStats.vue')),
  },
  setup() {
    const game = Game.getInstance();
    const team = game.teamCenter.teams[0];
    const battle: Ref<Battle | null> = shallowRef(null);
    const availableTargets = shallowRef<Array<CharacterBattle>>([]);
    provide('availableTargets', availableTargets);
    let selectSkillData: EventDataSkillSelect | null = null;
    const selectSkillPromiseResolve = ref<((value?: unknown) => void) | null>(null);
    const availableSkills = shallowRef<Array<SkillBattle>>([]);
    provide('availableSkills', availableSkills);
    const selectedSkill = shallowRef<SkillBattle | null>(null);
    provide('selectedSkill', selectedSkill);
    const currActionCharacter = shallowRef<CharacterBattle | null>(null);
    provide('currActionCharacter', currActionCharacter);
    const isAutoModeEnabled = ref(false);
    provide('isAutoModeEnabled', isAutoModeEnabled);
    const fireTarget = shallowRef<CharacterBattle | null>(null);
    provide('fireTarget', fireTarget);
    const protectTarget = shallowRef<CharacterBattle | null>(null);
    provide('protectTarget', protectTarget);

    const showResultDialog = ref(false);
    const result = ref(false);

    onUnmounted(() => {
      battle.value?.end();
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

      nextTick(() =>
        battle.value!.start().then((isSucceed) => {
          isAutoModeEnabled.value = false;
          showResultDialog.value = true;
          result.value = isSucceed;
        }),
      );
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
        selectSkillPromiseResolve.value = null;
        selectedSkill.value = null;
      }
    }

    watch(isAutoModeEnabled, (newVal) => {
      battle.value!.autoMode = newVal;

      if (selectSkillPromiseResolve.value) {
        selectSkillPromiseResolve.value?.();
        availableSkills.value = [];
        availableTargets.value = [];
        selectSkillPromiseResolve.value = null;
        selectedSkill.value = null;
      }
    });

    return {
      battle,
      onBattleStart,
      onSelectSkill,
      onSelectCharacter,
      isAutoModeEnabled,
      showResultDialog,
      result,
      ...useSettings(),
    };
  },
});
</script>

<style lang="scss" scoped>
.battle {
  &-name {
    font-family: 'STXingkai';
  }

  &-status {
    top: 4rem;
  }

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
