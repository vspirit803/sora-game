<!--
 * @Author: vspirit803
 * @Date: 2021-04-14 16:48:40
 * @Description: 
 * @LastEditTime: 2021-04-14 17:17:12
 * @LastEditors: vspirit803
-->
<template>
  <q-btn style="position: absolute; right: 0" @click="$router.push({ name: 'Home' })">退出</q-btn>
  <div class="teams">
    <q-btn-group>
      <q-btn v-for="eachTeam of teams" :key="eachTeam.uuid" @click="onSelectTeam(eachTeam)">{{ eachTeam.name }}</q-btn>
    </q-btn-group>
    <span v-for="eachCharacter of selectedTeam.members" :key="eachCharacter.uuid">{{ eachCharacter.name }}</span>
  </div>
</template>

<script lang="ts">
import { Game, TeamNormal } from 'sora-game-core';
import { defineComponent, shallowRef } from 'vue';

export default defineComponent({
  name: 'Teams',
  setup() {
    const game = Game.getInstance();
    const teams: Array<TeamNormal> = game.teamCenter.teams;
    const selectedTeam = shallowRef(teams[0]);

    function onSelectTeam(team: TeamNormal) {
      selectedTeam.value = team;
    }
    return { teams, onSelectTeam, selectedTeam };
  },
});
</script>
<style lang="scss" scoped>
.team {
  width: 100%;
}
</style>
