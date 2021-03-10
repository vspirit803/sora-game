<template>
  <div ref="characterElement" class="character" :class="{ target: isAvailable }" @click="onSelect">
    <div class="img-container">
      <img class="img" :src="imgUrl" />
    </div>
    <div class="name">{{ character.name }}</div>
    <div class="skills-container d-flex">
      <img
        v-for="eachSkill of availableSkills"
        :key="eachSkill.id"
        class="skill"
        :src="`/images/skills/${eachSkill.id}.png`"
        :class="{ 'skill-selected': eachSkill === selectedSkill }"
        @click="onSelectSkill(eachSkill)"
      />
      <!-- <v-btn
        class="skill"
        v-for="eachSkill of availableSkills"
        @click="onSelectSkill(eachSkill)"
        :class="{ 'skill-selected': eachSkill === selectedSkill }"
      >{{ eachSkill.name }}</v-btn>-->
    </div>
    <progress class="hp-bar" :max="hpMax" :value="currHp"></progress>
  </div>
</template>

<script lang="ts">
import { CharacterBattle, EventDataDamaged, EventDataSkillSelect, SkillBattle } from 'sora-game-core';
import { computed, defineComponent, inject, onMounted, PropType, Ref, ref, shallowRef, toRefs, watch } from 'vue';

import { useLabel } from '@/use';

export default defineComponent({
  name: 'BattleCharacter',
  props: {
    character: {
      required: true,
      type: Object as PropType<CharacterBattle>,
    },
  },
  setup(props) {
    const { character } = toRefs(props);
    const currHp = ref(character.value.currHp);
    const hpMax = ref(character.value.properties.hp.battleValue);
    const characterElement: Ref<HTMLElement | undefined> = ref(undefined);
    const selectSkillPromiseResolve = ref<(() => void) | undefined>(undefined);
    const availableSkills = shallowRef<Array<SkillBattle>>([]);
    let selectSkillData: EventDataSkillSelect | undefined = undefined;

    const availableTargets = inject<Ref<Array<CharacterBattle>>>('availableTargets')!;
    const setAvailableTargets = inject<(targets: Array<CharacterBattle>) => void>('setAvailableTargets')!;

    const setSelectTargetHandler = inject<(handler: (target: CharacterBattle) => void) => void>(
      'setSelectTargetHandler',
    )!;
    const selectTargetHandler = inject<Ref<(target: CharacterBattle) => void>>('selectTargetHandler')!;

    const isAvailable = computed(() => availableTargets.value.includes(character.value));
    const selectedSkill = shallowRef<SkillBattle | undefined>(undefined);

    let addLabel: (damage: number, color?: string) => void;
    onMounted(() => {
      addLabel = useLabel(characterElement.value!);
    });

    watch(
      character,
      () => {
        character.value.battle.eventCenter.listen({
          eventType: 'Damaged',
          priority: 1,
          filter: character.value,
          callback: async (eventData: EventDataDamaged) => {
            const { isCrit, finalDamage } = eventData;
            addLabel(finalDamage!, isCrit ? 'red' : undefined);
            currHp.value = character.value.currHp;
            hpMax.value = character.value.properties.hp.battleValue;

            return new Promise((resolve) => {
              setTimeout(resolve, 50);
            });
          },
        });

        character.value.battle.eventCenter.listen({
          eventType: 'SkillSelect',
          priority: 1,
          filter: character.value,
          callback: async (eventData: EventDataSkillSelect) => {
            availableSkills.value = eventData.availableSkills;
            setAvailableTargets(eventData.availableTargets);
            selectSkillData = eventData;

            return new Promise((resolve) => {
              selectSkillPromiseResolve.value = resolve;
            });
          },
        });
      },
      { immediate: true },
    );

    function onSelectSkill(skill: SkillBattle) {
      if (selectSkillData) {
        selectSkillData.selectedSkill = skill;
        selectedSkill.value = skill;

        setSelectTargetHandler((target: CharacterBattle) => {
          selectSkillData!.selectedTarget = target;
          selectSkillPromiseResolve.value?.();
          availableSkills.value = [];
          selectSkillPromiseResolve.value = undefined;
          selectedSkill.value = undefined;
        });
      }
    }

    function onSelect() {
      if (isAvailable.value) {
        selectTargetHandler.value?.(character.value);
      }
    }

    return {
      currHp,
      hpMax,
      characterElement,
      imgUrl: `/images/characters/${character.value.id}.png`,
      availableSkills,
      onSelectSkill,
      isAvailable,
      onSelect,
      selectedSkill,
    };
  },
});
</script>
<style lang="scss" scoped>
.character {
  width: 16rem;
  height: 16rem;

  &.target {
    border: 2px red dashed;

    &:hover {
      border-style: solid;
    }
  }

  border: double aquamarine;
  position: relative;
  .name {
    position: relative;
    font-weight: bold;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(128, 128, 128, 0.8), rgba(255, 255, 255, 0));
  }

  .skills-container {
    position: absolute;
    bottom: 1rem;

    .skill {
      width: 4rem;
      height: 4rem;

      font-size: 0.8rem;

      &-selected {
        border: 1px red solid !important;
      }
    }
  }

  .hp-bar {
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    width: 100%;
    height: 2rem;
  }
  .img-container {
    position: absolute;
    width: 100%;
    height: 100%;

    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  ::v-deep(.damage-span) {
    position: absolute;
    font-size: x-large;
    font-weight: bolder;
    bottom: 20px;
    text-align: center;
    left: 0;
    right: 0;
  }
}
</style>
