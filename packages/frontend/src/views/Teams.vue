<!--
 * @Author: vspirit803
 * @Date: 2021-04-14 16:48:40
 * @Description:
 * @LastEditTime: 2021-06-24 11:32:31
 * @LastEditors: vspirit803
-->
<template>
  <q-card class="teams column q-pa-md items-stretch">
    <HomeButton />
    <q-tab-panels v-model="selectedTeamUUID" animated class="team-tab">
      <q-tab-panel v-for="eachTeam of teams" :key="eachTeam.uuid" :name="eachTeam.uuid">
        <q-card class="row justify-between">
          <q-card v-for="i of 5" :key="i" class="team-character bg-cyan-2">
            <span v-if="selectedTeamMembers[i - 1]">{{ selectedTeamMembers[i - 1].name }}</span>
            <span v-else>空</span>
            <q-menu touch-position auto-close>
              <q-list style="min-width: 100px">
                <q-item
                  v-if="selectedTeamMembers[i - 1]"
                  v-close-popup
                  clickable
                  class="text-red"
                  @click="removeMember(selectedTeam, selectedTeamMembers[i - 1])"
                >
                  <q-item-section>移出队伍</q-item-section>
                </q-item>
                <q-item
                  v-for="each of characters.filter((each) =>
                    selectedTeamMembers[i - 1]
                      ? each.uuid !== selectedTeamMembers[i - 1].uuid
                      : !selectedTeamMembers.includes(each),
                  )"
                  :key="each.uuid"
                  v-close-popup
                  clickable
                  @click="replaceTeamMember(selectedTeam, i - 1, each)"
                >
                  <q-item-section>{{ each.name }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-card>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
    <q-separator />

    <div class="bg-purple text-white shadow-2 rounded-borders row">
      <q-tabs
        v-model="selectedTeamUUID"
        align="left"
        style="flex: 1 0 auto; width: 100px"
        outside-arrows
        dense
        no-caps
        inline-label
      >
        <q-tab v-for="eachTeam of teams" :key="eachTeam.uuid" :name="eachTeam.uuid" @click="onSelectTeam(eachTeam)">
          <span>
            {{ eachTeam.name }}
            <q-btn flat round icon="mdi-delete" size="sm" @click.stop>
              <q-popup-proxy>
                <q-banner>
                  确定要删除吗
                  <q-btn
                    flat
                    round
                    class="q-ml-s"
                    icon="mdi-check"
                    size="xs"
                    @click.stop="onDeleteTeam(eachTeam)"
                  ></q-btn>
                </q-banner>
              </q-popup-proxy>
            </q-btn>
          </span>
        </q-tab>
      </q-tabs>
      <q-btn v-if="canAddTeam" flat label="新增队伍" style="flex: 0 0 auto" @click="onAddTeam" />
    </div>
  </q-card>
</template>

<script lang="ts">
import { CharacterCenter, CharacterNormal, Game, TeamCenter, TeamNormal } from 'sora-game-core';
import { defineComponent, ref, shallowRef, triggerRef } from 'vue';

export default defineComponent({
  name: 'Teams',
  setup() {
    const game = Game.getInstance();
    const teamCenter: TeamCenter = game.teamCenter;
    const characterCenter: CharacterCenter = game.characterCenter;
    const teams = shallowRef(teamCenter.teams);
    const selectedTeam = shallowRef(teams.value[0]);
    const selectedTeamUUID = ref(selectedTeam.value.uuid);
    const characters = characterCenter.userCharacters;
    const selectedTeamMembers = shallowRef(selectedTeam.value.members);
    const canAddTeam = ref(teamCenter.canAddTeam());

    function onSelectTeam(team: TeamNormal) {
      selectedTeam.value = team;
      selectedTeamMembers.value = team.members;
    }

    function replaceTeamMember(team: TeamNormal, index: number, character: CharacterNormal) {
      if (team.members[index]) {
        team.replaceMember(team.members[index], character);
      } else if (!team.includes(character.id)) {
        team.addMember(character);
      }

      selectedTeamMembers.value = team.members;
      triggerRef(selectedTeamMembers);
    }

    function removeMember(team: TeamNormal, character: CharacterNormal) {
      team.removeMember(character);
      selectedTeamMembers.value = team.members;
      triggerRef(selectedTeamMembers);
    }

    function onAddTeam() {
      teamCenter.newTeam();
      canAddTeam.value = teamCenter.canAddTeam();
      triggerRef(teams);
    }

    function onDeleteTeam(team: TeamNormal) {
      teamCenter.removeTeam(team);
      canAddTeam.value = teamCenter.canAddTeam();
      triggerRef(teams);
    }

    return {
      teams,
      onSelectTeam,
      selectedTeam,
      selectedTeamUUID,
      characters,
      replaceTeamMember,
      selectedTeamMembers,
      removeMember,
      onAddTeam,
      onDeleteTeam,
      canAddTeam,
    };
  },
});
</script>
<style lang="scss" scoped>
.teams {
  padding-top: 120px;
}

.team-tab {
  flex-grow: 1;
}

.team-character {
  width: 300px;
  height: 400px;
}
</style>
