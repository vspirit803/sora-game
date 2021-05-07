<template>
  <div ref="characterElement" class="character" :class="{ target: isAvailable }" @click="onSelect">
    <div class="img-container">
      <q-img class="img" :src="imgUrl" />
      <!-- <div class="img" :style="`background-image: url(${imgUrl});`"></div> -->
    </div>
    <div class="name">{{ character.name }}</div>
    <div class="buffs-container row">
      <BuffComponent v-for="eachBuff of buffs" :key="eachBuff.uuid" :buff="eachBuff" />
    </div>
    <div class="skills-container row">
      <BattleCharacterSkill
        v-for="eachSkill of availableSkills"
        :key="eachSkill.id"
        :skill="eachSkill"
        :selected="eachSkill === selectedSkill"
        @click="onSelectSkill(eachSkill)"
      />
    </div>
    <progress class="hp-bar" :max="hpMax" :value="currHp"></progress>
    <div class="hp-number">{{ currHp }} / {{ hpMax }}</div>
  </div>
</template>

<script lang="ts">
import { Buff, CharacterBattle, EventDataDamaged, EventDataSkillSelect, SkillBattle } from 'sora-game-core';
import { computed, defineComponent, inject, onMounted, PropType, Ref, ref, shallowRef, toRefs, watch } from 'vue';

import BattleCharacterSkill from '@/components/BattleCharacterSkill.vue';
import BuffComponent from '@/components/Buff.vue';
import { useLabel } from '@/use';

export default defineComponent({
  name: 'BattleCharacter',
  components: { BuffComponent, BattleCharacterSkill },
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
    const selectSkillPromiseResolve = ref<((value?: unknown) => void) | undefined>(undefined);
    const availableSkills = shallowRef<Array<SkillBattle>>([]);
    let selectSkillData: EventDataSkillSelect | undefined = undefined;
    const buffs = shallowRef<Array<Buff>>([]);

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
          priority: 0,
          filter: character.value,
          callback: async (eventData: EventDataDamaged) => {
            const { isCrit, finalDamage } = eventData;
            addLabel(finalDamage!, isCrit ? 'red' : undefined);
            currHp.value = character.value.currHp;
            hpMax.value = character.value.properties.hp.battleValue;
          },
        });

        character.value.battle.eventCenter.listen({
          eventType: 'SkillSelect',
          priority: 0,
          filter: character.value,
          callback: async (eventData: EventDataSkillSelect) => {
            availableSkills.value = eventData.availableSkills;
            selectSkillData = eventData;

            return new Promise((resolve) => {
              selectSkillPromiseResolve.value = resolve;
            });
          },
        });

        character.value.battle.eventCenter.listen({
          eventType: 'ActionEnd',
          priority: 0,
          callback: async () => {
            buffs.value = character.value.buffs;
          },
        });
      },
      { immediate: true },
    );

    function onSelectSkill(skill: SkillBattle) {
      if (selectSkillData) {
        selectSkillData.selectedSkill = skill;
        selectedSkill.value = skill;
        setAvailableTargets(selectedSkill.value.getTargets());

        setSelectTargetHandler((target: CharacterBattle) => {
          selectSkillData!.selectedTarget = target;
          selectSkillPromiseResolve.value?.();
          availableSkills.value = [];
          setAvailableTargets([]);
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
      isAvailable,
      onSelect,
      availableSkills,
      onSelectSkill,
      selectedSkill,
      buffs,
    };
  },
});
</script>
<style lang="scss" scoped>
.character {
  width: 12rem;
  height: 12rem;
  box-sizing: content-box;

  &.target {
    border: 2px red dashed;

    &:hover {
      border-style: solid;
    }
  }

  border: 2px double aquamarine;
  position: relative;
  .name {
    position: relative;
    font-weight: bold;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(128, 128, 128, 0.8), rgba(255, 255, 255, 0));
  }

  .skills-container {
    position: absolute;
    bottom: 1rem;
  }

  .hp-bar {
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    width: 100%;
    height: 2rem;
  }

  .hp-number {
    display: none;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1rem;
    line-height: 1rem;
  }

  &:hover .hp-number {
    display: unset;
  }

  .img-container {
    position: absolute;
    width: 100%;
    height: 100%;

    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-size: cover;
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

  ::v-deep(img) {
    -webkit-user-drag: none;
  }
}
</style>
