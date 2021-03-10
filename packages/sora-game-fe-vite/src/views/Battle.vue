<!--
 * @Author: vspirit803
 * @Date: 2021-03-04 09:50:15
 * @Description: 
 * @LastEditTime: 2021-03-10 17:33:25
 * @LastEditors: vspirit803
-->
<template>
  <v-btn style="position: absolute" @click="onBattleStart">开始战斗</v-btn>
  <v-btn style="position: absolute; right: 0" @click="$router.push({ name: 'Home' })">退出</v-btn>
  <div v-if="battle" class="battle">
    {{ battle.name }}
    <BattleFaction class="faction faction1" :faction="battle.factions[0]" reverse />
    <BattleFaction class="faction faction2" :faction="battle.factions[1]" />
    <BattleFaction v-if="battle.factions[2]" class="faction faction3" :faction="battle.factions[2]" />
  </div>
</template>

<script lang="ts">
import { Battle, CharacterBattle, Game } from 'sora-game-core';
import { defineComponent, onUnmounted, provide, Ref, shallowRef } from 'vue';

import BattleFaction from '@/components/BattleFaction.vue';

export default defineComponent({
  name: 'Battle',
  components: { BattleFaction },
  setup() {
    const game = Game.getInstence();
    const team = game.teamCenter.teams[0];
    const battle: Ref<Battle | undefined> = shallowRef();
    const availableTargets = shallowRef<Array<CharacterBattle>>([]);
    function setAvailableTargets(targets: Array<CharacterBattle>) {
      availableTargets.value = targets;
    }

    provide('availableTargets', availableTargets);
    provide('setAvailableTargets', setAvailableTargets);

    const selectTargetHandler = shallowRef<(target: CharacterBattle) => void | undefined>();
    function setSelectTargetHandler(handler: (target: CharacterBattle) => void) {
      selectTargetHandler.value = handler;
    }

    provide('selectTargetHandler', selectTargetHandler);
    provide('setSelectTargetHandler', setSelectTargetHandler);

    onUnmounted(() => {
      console.log('结束battle');
      battle.value?.end();
      console.log('已结束battle');
    });

    async function onBattleStart() {
      battle.value = game.battleCenter.generateBattle('Battle00001', team);
      // battle.value.autoMode = true;
      console.clear();
      battle.value.start();
    }

    return { battle, onBattleStart };
  },
});
</script>
<style lang="scss" scoped>
.battle {
  width: 100%;

  .faction {
    position: absolute;
    border: dashed #32a1ce;
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
