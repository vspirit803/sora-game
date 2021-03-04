<template>
  <v-btn @click="onBattleStart">开始战斗</v-btn>
  <div class="battle" v-if="battle">
    {{ battle.name }}
    <BattleFaction class="faction1" :faction="battle.factions[0]" reverse />
    <BattleFaction class="faction2" :faction="battle.factions[1]" />
    <BattleFaction v-if="battle.factions[2]" class="faction3" :faction="battle.factions[2]" />
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
.faction1 {
  position: absolute;
  right: 20px;
  bottom: 20px;

  border: dashed #32a1ce;
}

.faction2 {
  position: absolute;
  left: 20px;
  top: 20px;

  border: dashed #32a1ce;
}

.faction3 {
  position: absolute;
  right: 20px;
  top: 20px;

  border: dashed #32a1ce;
}
</style>
