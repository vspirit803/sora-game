<!--
 * @Author: vspirit803
 * @Date: 2021-06-29 09:47:07
 * @Description:
 * @LastEditTime: 2021-06-29 10:03:28
 * @LastEditors: vspirit803
-->

<template>
  <div>
    {{ character.name }} Lv.{{ character.level }}
    <div class="row">
      <template v-for="(eachProperty, key) of character.properties" :key="key">
        <template v-if="eachProperty">
          <span class="col-4">{{ t(`Properties.${key}`) }}</span>
          <span class="col-2 offset-4 text-right">
            {{ eachProperty.normalValue }}
          </span>
          <span v-if="eachProperty.increaseValue" class="col-2 text-left"> (+{{ eachProperty.increaseValue }}) </span>
        </template>
      </template>
    </div>
    <div class="skills-container row justify-center">
      <CharacterDetailSkill v-for="each of skills" :key="each.id" :skill="each" />
    </div>
  </div>
</template>

<script lang="ts">
import { CharacterNormal, SkillNormal } from 'sora-game-core';
import { computed, defineComponent, PropType, Ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import CharacterDetailSkill from './CharacterDetailSkill.vue';

export default defineComponent({
  name: 'CharacterDetail',
  components: { CharacterDetailSkill },
  props: {
    character: {
      type: Object as PropType<CharacterNormal>,
      required: true,
    },
  },
  setup(props) {
    const { character } = toRefs(props);
    const skills = computed(() => character.value.skills) as Ref<Array<SkillNormal>>;
    return { skills, ...useI18n() };
  },
});
</script>
<style lang="scss">
.skills-container {
  gap: 1rem;
}
</style>
