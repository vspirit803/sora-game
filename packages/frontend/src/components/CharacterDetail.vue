<!--
 * @Author: vspirit803
 * @Date: 2021-06-29 09:47:07
 * @Description:
 * @LastEditTime: 2021-11-01 18:07:04
 * @LastEditors: vspirit803
-->

<template>
  <div class="character-detail">
    <div class="column items-center">
      <div class="character-detail-top relative-position shadow-1">
        <div class="equipments-container">
          <CharacterDetailEquipmentSlot
            v-for="each of equipmentSlots"
            :key="each.uuid"
            :class="`equipment-slot equipment-slot-${each.name.toLowerCase()}`"
            :equipment-slot="each"
            :available="(draggingEquipment && each.isEquipmentAvailable(draggingEquipment)) || false"
            :dragging-equipment="draggingEquipment"
            @dragover.prevent="(e: DragEvent) => onDragOver(e, each)"
            @drop="(e: DragEvent) => onDragDrop(e, each)"
            @take-off-equipment="() => onTakeOffEquipment(each)"
          />
        </div>
        <div class="character-name-container text-subtitle2">
          <span class="character-level q-mr-md">lv.{{ character.level }}</span>
          <span class="character-name">{{ character.name }}</span>
        </div>
        <div class="character-image-container">
          <q-img class="character-image" :src="`/images/characters/${character.id}.png`" fit="contain" />
        </div>
      </div>
      <div class="character-detail-bottom column content-center q-mt-sm">
        <div class="character-properties row shadow-1">
          <template v-for="(eachProperty, key) of character.properties" :key="key">
            <template v-if="eachProperty">
              <span class="col-2">{{ t(`Properties.${key}`) }}</span>
              <span class="col-2 text-right text-green">
                {{ eachProperty.characterValue }}
              </span>
              <span v-if="eachProperty.equipmentValue > 0" class="col-2 text-left q-pl-sm">
                +{{ eachProperty.equipmentValue }}
              </span>
              <span v-else-if="eachProperty.equipmentValue < 0" class="col-2 text-left q-pl-sm">
                {{ eachProperty.equipmentValue }}
              </span>
              <span v-else class="col-2 text-left q-pl-sm"></span>
            </template>
          </template>
        </div>
        <div class="skills-container row justify-center">
          <CharacterDetailSkill v-for="each of skills" :key="each.id" :skill="each" />
        </div>
        <div class="items-background row content-start shadow-4">
          <Item
            v-for="each of availableEquipments"
            :key="each.uuid"
            :item="each"
            draggable="true"
            @dragstart="(e: DragEvent) => onDragStart(e, each)"
            @dragend="onDragEnd"
            @click.right.prevent="() => onPutOnEquipment(each)"
          />
          <Item v-for="index of 32 - availableEquipments.length" :key="index" class="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CharacterNormal, ItemCenter, ItemEquipment, ItemEquipmentSlot, SkillNormal } from 'sora-game-core';
import { computed, defineComponent, PropType, Ref, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import Item from '@/components/Item.vue';
import { useGame } from '@/use';

import CharacterDetailEquipmentSlot from './CharacterDetailEquipmentSlot.vue';
import CharacterDetailSkill from './CharacterDetailSkill.vue';

export default defineComponent({
  name: 'CharacterDetail',
  components: { CharacterDetailSkill, Item, CharacterDetailEquipmentSlot },
  props: {
    character: {
      type: Object as PropType<CharacterNormal>,
      required: true,
    },
  },
  setup(props) {
    const { character } = toRefs(props);
    const game = useGame();
    const skills = computed(() => character.value.skills) as Ref<Array<SkillNormal>>;
    const equipmentSlots = computed(() => character.value.equipments) as Ref<Array<ItemEquipmentSlot>>;
    const availableEquipments = computed(() => (game.backpack as ItemCenter).equipments.filter((each) => !each.wearer));

    const draggingEquipment = ref<ItemEquipment | null>(null);

    function onDragStart(e: DragEvent, equipment: ItemEquipment) {
      e.dataTransfer?.setData('text/plain', equipment.name);
      draggingEquipment.value = equipment;
      console.log(e.dataTransfer?.getData('text/plain'), draggingEquipment.value);
    }

    function onDragOver(e: DragEvent, equipmentSlot: ItemEquipmentSlot) {
      console.log(e.dataTransfer?.getData('text/plain'), equipmentSlot.name, draggingEquipment.value);

      if (draggingEquipment.value && equipmentSlot.isEquipmentAvailable(draggingEquipment.value)) {
        e.dataTransfer && (e.dataTransfer.dropEffect = 'move');
      } else {
        e.dataTransfer && (e.dataTransfer.dropEffect = 'none');
      }
    }

    function onDragEnd() {
      draggingEquipment.value = null;
    }

    function onDragDrop(e: DragEvent, equipmentSlot: ItemEquipmentSlot) {
      if (!draggingEquipment.value) {
        return;
      }

      character.value.putOnEquipment(equipmentSlot, draggingEquipment.value);
    }

    function onTakeOffEquipment(equipmentSlot: ItemEquipmentSlot) {
      character.value.takeOffEquipment(equipmentSlot);
    }

    function onPutOnEquipment(equipment: ItemEquipment) {
      const availableEquipmentSlot = equipmentSlots.value.find((eachSlot) => eachSlot.isEquipmentAvailable(equipment));

      if (availableEquipmentSlot) {
        character.value.putOnEquipment(availableEquipmentSlot, equipment);
      }
    }

    return {
      skills,
      equipmentSlots,
      availableEquipments,
      onDragStart,
      onDragOver,
      onDragEnd,
      onDragDrop,
      onTakeOffEquipment,
      onPutOnEquipment,
      draggingEquipment,
      ...useI18n(),
    };
  },
});
</script>
<style lang="scss">
.skills-container {
  gap: 1rem;
}

.equipments-container {
  position: relative;

  .equipment-slot {
    position: absolute;

    &-coat {
      top: 1rem;
      left: calc(5rem + 4px);
    }

    &-pants {
      top: calc(5rem + 4px);
      left: calc(5rem + 4px);
    }

    &-shoulders {
      top: 1rem;
      left: 1rem;
    }

    &-belt {
      top: calc(5rem + 4px);
      left: 1rem;
    }

    &-shoes {
      top: calc(9rem + 8px);
      left: 1rem;
    }

    &-weapon {
      top: 1rem;
      right: calc(5rem + 4px);
    }

    &-necklace {
      top: calc(5rem + 4px);
      right: 1rem;
    }

    &-bracelet {
      top: calc(5rem + 4px);
      right: calc(5rem + 4px);
    }

    &-ring {
      top: calc(9rem + 8px);
      right: 1rem;
    }

    &-universal {
      top: 1rem;
      right: 1rem;
    }
  }
}

.character-detail {
  &-top {
    overflow: hidden;
    width: 32rem;
    height: calc(14rem + 8px);
    flex-grow: 0;

    .character-name-container {
      position: absolute;
      bottom: 0;
      width: 100%;
    }

    .character-image-container {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;

      .character-image {
        max-height: 12rem;
      }
    }
  }

  &-bottom {
    width: 32rem;
    flex-grow: 1;
    gap: 1rem;
  }
}

.items-background {
  width: calc(4rem * 8 + 7px);
  height: calc(4rem * 4 + 3px);
  background-color: rgba(240, 255, 255, 0.3);
  gap: 1px;
}
</style>
