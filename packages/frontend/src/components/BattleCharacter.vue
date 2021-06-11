<template>
  <div
    ref="characterElement"
    class="character"
    :class="{ target: isAvailable, 'fire-target': isFireTarget }"
    @click.stop="onSelectCharacter"
  >
    <div class="img-container">
      <q-img v-if="showImage" class="img" :src="imgUrl" />
      <!-- <div class="img" :style="`background-image: url(${imgUrl});`"></div> -->
    </div>
    <div class="name text-weight-bolder">
      {{ character.name }}
      <q-btn
        v-if="character.isPlayerControl"
        class="absolute-right detail-icon"
        size="xs"
        round
        flat
        color="blue"
        icon="mdi-information-variant"
        @mouseenter="onShowDetail(true)"
        @mouseleave="onShowDetail(false)"
      >
      </q-btn>
    </div>

    <div v-if="showDetail && character.isPlayerControl" class="character-detail text-weight-bold">
      <div class="row">
        <div class="col-6 text-left"><q-icon name="mdi-sword" />攻击力</div>
        <div class="col-6 text-right">{{ character.properties.atk.battleValue.toFixed(1) }}</div>
      </div>
      <div class="row">
        <div class="col-6 text-left"><q-icon name="mdi-shield-half-full" />防御力</div>
        <div class="col-6 text-right">{{ character.properties.def.battleValue.toFixed(1) }}</div>
      </div>
    </div>

    <template v-if="isAutoModeEnabled">
      <q-icon
        v-if="isFireTarget"
        class="absolute-left text-h2 no-pointer-events"
        size="md"
        color="red"
        name="mdi-bullseye-arrow"
      />
      <q-icon
        v-if="isProtectTarget"
        class="absolute-left text-h2 no-pointer-events"
        size="md"
        color="green"
        name="mdi-shield-cross-outline"
      />
    </template>
    <div class="buffs-container row">
      <BuffComponent v-for="eachBuff of buffs.filter((each) => each.visible)" :key="eachBuff.uuid" :buff="eachBuff" />
    </div>
    <div v-if="currActionCharacter === character" class="skills-container row">
      <BattleCharacterSkill
        v-for="eachSkill of availableSkills"
        :key="eachSkill.id"
        :skill="eachSkill"
        @click.stop="onSelectSkill(eachSkill)"
      />
    </div>
    <q-linear-progress :value="currHp / hpMax" color="primary" size="xl" class="hp-bar">
      <div v-if="character.isPlayerControl" class="hp-number text-white">{{ currHp }} / {{ hpMax }}</div>
    </q-linear-progress>
  </div>
</template>

<script lang="ts">
import { debounce } from 'quasar';
import { Buff, CharacterBattle, EventDataDamaged, EventListenerBuilder, SkillBattle } from 'sora-game-core';
import { computed, defineComponent, inject, onMounted, PropType, Ref, ref, shallowRef, toRefs, watch } from 'vue';

import BattleCharacterSkill from '@/components/BattleCharacterSkill.vue';
import BuffComponent from '@/components/Buff.vue';
import { useLabel, useSettings } from '@/use';

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
    const showDetail = ref(false);

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

    function onSwitchShowDetail() {
      showDetail.value = !showDetail.value;
    }

    const onShowDetail = debounce((show: boolean) => (showDetail.value = show), 150);
    const isAutoModeEnabled = inject<Ref<boolean>>('isAutoModeEnabled')!;

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
      onSwitchShowDetail,
      showDetail,
      onShowDetail,
      isAutoModeEnabled,
      ...useSettings(),
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

  &-detail {
    position: absolute;
    top: 1.7rem;
    width: calc(12rem - 16px);
    padding: 0 8px;
    height: 9.3rem;
    background-color: rgba(128, 128, 128, 0.05);
  }

  .name {
    font-size: 1.2rem;
    position: relative;
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
    bottom: 0;
    width: 100%;
  }

  .hp-number {
    display: none;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
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
    pointer-events: none;
  }

  ::v-deep(img) {
    -webkit-user-drag: none;
  }
}
</style>
