<!--
 * @Author: vspirit803
 * @Date: 2021-04-13 10:21:23
 * @Description:
 * @LastEditTime: 2021-05-09 09:11:08
 * @LastEditors: vspirit803
-->
<template>
  <q-img
    class="skill"
    :src="`/images/skills/${skill.id}.png`"
    :class="{ 'skill-selected': selected }"
    :alt="skill.name"
  >
    <template #error>
      {{ skill.name }}
    </template>
  </q-img>
</template>

<script lang="ts">
import { SkillBattle } from 'sora-game-core';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'BattleCharacterSkill',
  props: {
    skill: {
      type: Object as PropType<SkillBattle>,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
<style lang="scss" scoped>
.skill {
  width: 3rem;
  height: 3rem;
  font-size: 0.8rem;
  border: 1px grey dotted;
  box-sizing: border-box;

  &-selected {
    border: 1px red solid;
  }
}
</style>
