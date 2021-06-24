<!--
 * @Author: vspirit803
 * @Date: 2021-04-13 10:21:23
 * @Description:
 * @LastEditTime: 2021-06-24 11:49:49
 * @LastEditors: vspirit803
-->
<template>
  <component
    :is="showImage ? 'q-img' : 'div'"
    class="skill"
    :src="`/images/skills/${skill.id}.png`"
    :class="{ 'skill-selected': isSelected, 'skill-passive': skill.isPassive }"
    :alt="skill.name"
  >
    <template #error>
      {{ skill.name }}
    </template>
    <template v-if="!showImage">{{ skill.name }}</template>
  </component>
</template>

<script lang="ts">
import { SkillBattle } from 'sora-game-core';
import { computed, defineComponent, inject, PropType, Ref } from 'vue';

import { useSettings } from '@/use';

export default defineComponent({
  name: 'BattleCharacterSkill',
  props: {
    skill: {
      type: Object as PropType<SkillBattle>,
      required: true,
    },
  },
  setup(props) {
    const selectedSkill: Ref<SkillBattle> = inject('selectedSkill')!;
    const isSelected = computed(() => selectedSkill.value === props.skill);

    return { isSelected, ...useSettings() };
  },
});
</script>

<style lang="scss" scoped>
.skill {
  width: 2rem;
  height: 2rem;
  font-size: 0.8rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;

  &:hover::after {
    box-sizing: border-box;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    border: 1px dashed red;
  }

  &-selected.skill::after {
    box-sizing: border-box;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    border: 1.5px solid red;
  }

  &-passive::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, transparent 75%, gold 76%, gold 99%, transparent 100%) no-repeat;
    background-position: 50% 0;
    background-size: 50% 100%;
    animation: rotate 2s linear infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(1turn);
  }
}
</style>
