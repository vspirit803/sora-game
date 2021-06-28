<!--
 * @Author: vspirit803
 * @Date: 2021-04-13 10:21:23
 * @Description:
 * @LastEditTime: 2021-06-29 10:13:01
 * @LastEditors: vspirit803
-->
<template>
  <component
    :is="showImage ? 'q-img' : 'div'"
    class="skill"
    :src="`/images/skills/${skill.id}.png`"
    :class="{ 'skill-passive': skill.isPassive }"
    :alt="skill.name"
  >
    <template #error>
      {{ skill.name }}
    </template>
    <template v-if="!showImage">{{ skill.name }}</template>
  </component>
</template>

<script lang="ts">
import { SkillNormal } from 'sora-game-core';
import { defineComponent, PropType } from 'vue';

import { useSettings } from '@/use';

export default defineComponent({
  name: 'CharacterDetailSkill',
  props: {
    skill: {
      type: Object as PropType<SkillNormal>,
      required: true,
    },
  },
  setup() {
    return { ...useSettings() };
  },
});
</script>

<style lang="scss" scoped>
.skill {
  width: 4rem;
  height: 4rem;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 2rem;
  display: flex;
  justify-content: center;
  flex-direction: column;

  &::after {
    box-sizing: border-box;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 2rem;
    border: 1px dashed red;
  }
}
</style>
