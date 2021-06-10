<!--
 * @Author: vspirit803
 * @Date: 2021-03-04 09:50:15
 * @Description:
 * @LastEditTime: 2021-06-10 11:47:11
 * @LastEditors: vspirit803
-->
<template>
  <div class="q-application">
    <ContentContainer />
  </div>
</template>

<script lang="ts">
import { battles, characters, items, sav001, skills } from 'sora-game-assets';
import { Game, ItemConfigurations, SkillConfiguration } from 'sora-game-core';
import { defineComponent, onMounted } from 'vue';

import ContentContainer from '@/views/ContentContainer.vue';

export default defineComponent({
  name: 'App',
  components: {
    ContentContainer,
  },
  setup() {
    const game = Game.getInstance();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).game = game;

    //加载配置
    game.skillCenter.loadConfiguration(skills as Array<SkillConfiguration>);
    game.backpack.loadConfigurations(items as ItemConfigurations);
    game.characterCenter.loadConfiguration(characters);
    game.battleCenter.loadConfiguration(battles);

    onMounted(() => {
      game.loadSave(sav001);
    });
  },
});
</script>

<style lang="scss">
.q-application {
  width: 100%;
}

html {
  overflow-y: auto !important;
}

#app {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, segoe ui, Roboto, Helvetica, Arial, sans-serif,
    apple color emoji, segoe ui emoji, segoe ui symbol;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

* {
  user-select: none;
}
</style>
