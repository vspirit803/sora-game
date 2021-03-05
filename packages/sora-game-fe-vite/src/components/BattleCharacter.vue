<template>
  <div ref="characterElement" class="character">
    <div class="img-container">
      <!-- <img class="img" :src="imgUrl" /> -->
    </div>
    <div class="name">{{ character.name }}</div>
    <progress class="hp-bar" :max="hpMax" :value="currHp"></progress>
  </div>
</template>

<script lang="ts">
import { CharacterBattle, EventDataDamaged } from "sora-game-core";
import {
  defineComponent,
  onMounted,
  PropType,
  Ref,
  ref,
  toRefs,
  watch,
} from "vue";

import { useLabel } from "@/use";

export default defineComponent({
  name: "BattleCharacter",
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
    let addLabel: (damage: number, color?: string) => void;
    onMounted(() => {
      addLabel = useLabel(characterElement.value!);
    });

    watch(
      character,
      () => {
        character.value.battle.eventCenter.listen({
          eventType: "Damaged",
          priority: 1,
          filter: character.value,
          callback: async (eventData: EventDataDamaged) => {
            const { isCrit, finalDamage } = eventData;
            addLabel(finalDamage!, isCrit ? "red" : undefined);
            currHp.value = character.value.currHp;
            hpMax.value = character.value.properties.hp.battleValue;

            return new Promise((resolve) => {
              setTimeout(resolve, 50);
            });
          },
        });
      },
      { immediate: true }
    );

    return {
      currHp,
      hpMax,
      characterElement,
      imgUrl: `/images/${character.value.id}.png`,
    };
  },
});
</script>
<style lang="scss" scoped>
.character {
  width: 12rem;
  height: 12rem;

  border: double aquamarine;
  position: relative;

  .name {
    position: relative;
    font-weight: bold;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(128, 128, 128, 0.8),
      rgba(255, 255, 255, 0)
    );
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
