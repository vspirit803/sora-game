<template>
  <div
    ref="characterElement"
    class="character"
    :class="{ target: isAvailable, 'fire-target': isFireTarget }"
    @click.stop="onSelectCharacter"
  >
    <div class="img-container">
      <q-img class="img" :src="imgUrl" />
      <!-- <div class="img" :style="`background-image: url(${imgUrl});`"></div> -->
    </div>
    <div class="name">
      {{ character.name }}
    </div>
    <q-icon v-if="isFireTarget" class="absolute-right text-h2" color="red" name="mdi-bullseye-arrow" />
    <q-icon v-if="isProtectTarget" class="absolute-right text-h2" color="green" name="mdi-shield-cross-outline" />
    <div class="buffs-container row">
      <BuffComponent v-for="eachBuff of buffs" :key="eachBuff.uuid" :buff="eachBuff" />
    </div>
    <div v-if="currActionCharacter === character" class="skills-container row">
      <BattleCharacterSkill
        v-for="eachSkill of availableSkills"
        :key="eachSkill.id"
        :skill="eachSkill"
        @click.stop="onSelectSkill(eachSkill)"
      />
    </div>
    <progress class="hp-bar" :max="hpMax" :value="currHp"></progress>
    <div class="hp-number">{{ currHp }} / {{ hpMax }}</div>
  </div>
</template>

<script lang="ts">
import { Buff, CharacterBattle, EventDataDamaged, EventListenerBuilder, SkillBattle } from 'sora-game-core';
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
  emits: ['onSelectSkill', 'onSelectCharacter'],
  setup(props, { emit }) {
    const { character } = toRefs(props);
    const currHp = ref(character.value.currHp);
    const hpMax = ref(character.value.properties.hp.battleValue);
    const characterElement: Ref<HTMLElement | undefined> = ref(undefined);
    const availableSkills = inject<Ref<Array<SkillBattle>>>('availableSkills')!;
    const currActionCharacter = inject<Ref<CharacterBattle>>('currActionCharacter')!;
    const buffs = shallowRef<Array<Buff>>([]);
    const fireTarget = inject<Ref<CharacterBattle | undefined>>('fireTarget')!;
    const isFireTarget = computed(() => fireTarget.value === character.value);
    const protectTarget = inject<Ref<CharacterBattle | undefined>>('protectTarget')!;
    const isProtectTarget = computed(() => protectTarget.value === character.value);

    const availableTargets = inject<Ref<Array<CharacterBattle>>>('availableTargets')!;
    const isAvailable = computed(() => availableTargets.value.includes(character.value));

    let addLabel: (damage: number, color: string, isCrit?: boolean) => void;
    onMounted(() => {
      addLabel = useLabel(characterElement.value!);
    });

    watch(
      character,
      () => {
        const eventCenter = character.value.battle.eventCenter;

        new EventListenerBuilder()
          .setEventCenter(eventCenter)
          .setEventType('Damaged')
          .setPriority(0)
          .setFilter(character.value)
          .setCallback(async (eventData: EventDataDamaged) => {
            const { isCrit, finalDamage } = eventData;
            addLabel(finalDamage!, 'red', isCrit);
            currHp.value = character.value.currHp;
            hpMax.value = character.value.properties.hp.battleValue;
          })
          .apply();

        new EventListenerBuilder()
          .setEventCenter(eventCenter)
          .setEventType('Treated')
          .setPriority(0)
          .setFilter(character.value)
          .setCallback(async (eventData: EventDataDamaged) => {
            const { isCrit, finalDamage } = eventData;
            addLabel(finalDamage!, 'green', isCrit);
            currHp.value = character.value.currHp;
            hpMax.value = character.value.properties.hp.battleValue;
          })
          .apply();

        new EventListenerBuilder()
          .setEventCenter(eventCenter)
          .setEventType('ActionEnd')
          .setPriority(0)
          .setCallback(async () => {
            buffs.value = character.value.buffs;
          })
          .apply();

        new EventListenerBuilder()
          .setEventCenter(eventCenter)
          .setEventType('ActionEnd')
          .setPriority(-1)
          .setFilter(character.value)
          .setCallback(async () => {
            return new Promise((resolve) => {
              setTimeout(resolve, 200);
            });
          })
          .apply();
      },
      { immediate: true },
    );

    function onSelectSkill(skill: SkillBattle) {
      emit('onSelectSkill', skill);
    }

    function onSelectCharacter() {
      emit('onSelectCharacter', character.value);
    }

    return {
      currHp,
      hpMax,
      characterElement,
      imgUrl: `/images/characters/${character.value.id}.png`,
      isAvailable,
      onSelectCharacter,
      availableSkills,
      onSelectSkill,
      buffs,
      currActionCharacter,
      isFireTarget,
      isProtectTarget,
    };
  },
});
</script>

<style lang="scss" scoped>
.character {
  width: 12rem;
  height: 12rem;
  box-sizing: content-box;
  outline: aquamarine double 2px;
  position: relative;

  &.target {
    outline: red dashed 2px;

    &:hover {
      outline-style: solid;
    }
  }

  &-fire-target::after {
  }

  .name {
    position: relative;
    font-weight: bold;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(128, 128, 128, 0.8), rgba(255, 255, 255, 0));
  }

  .skills-container {
    position: absolute;
    bottom: 1.5rem;
    gap: 0.5rem;
    padding: 0 0.5rem;
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
