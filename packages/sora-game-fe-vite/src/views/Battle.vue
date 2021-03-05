<!--
 * @Author: vspirit803
 * @Date: 2021-03-04 09:50:15
 * @Description: 
 * @LastEditTime: 2021-03-05 11:50:23
 * @LastEditors: vspirit803
-->
<template>
  <v-btn style="position: absolute" @click="onBattleStart">开始战斗</v-btn>
  <div class="battle" v-if="battle">
    {{ battle.name }}
    <BattleFaction class="faction faction1" :faction="battle.factions[0]" reverse />
    <BattleFaction class="faction faction2" :faction="battle.factions[1]" />
    <BattleFaction
      v-if="battle.factions[2]"
      class="faction faction3"
      :faction="battle.factions[2]"
    />
  </div>
</template>

<script lang="ts">
import { Battle, Game } from 'sora-game-core';
import { defineComponent, nextTick, onMounted, onUnmounted, Ref, ref, shallowRef } from 'vue';

// import '@/styles/vuetify.css';
import BattleFaction from '@/components/BattleFaction.vue';
import { onBeforeRouteLeave } from 'vue-router';

export default defineComponent({
  name: 'Battle',
  components: { BattleFaction },
  setup() {
    const game = Game.getInstence();
    const team = game.teamCenter.teams[0];
    const battle: Ref<Battle | undefined> = shallowRef();

    // onMounted(() => {
    //   if (battle.value) {
    //     // battle.value?.end();
    //     // battle.value = undefined
    //   }

    //   battle.value = game.battleCenter.generateBattle('Battle00001', team);
    //   battle.value.autoMode = true;
    //   battle.value.start();
    // })

    onUnmounted(() => {
      console.log('结束battle')
      battle.value?.end();
      console.log('已结束battle')
      // battle.value = undefined
    });

    // onBeforeRouteLeave(async () => {
    //   console.log('结束battle')
    //   // battle.value?.end();
    //   console.log('已结束battle')

    //   await nextTick();
    // })

    async function onBattleStart() {
      battle.value = await game.battleCenter.generateBattle('Battle00001', team);
      battle.value.autoMode = true;
      console.clear();
      console.log(battle.value)
      // nextTick(() => {
      battle.value!.start();
      // })
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
