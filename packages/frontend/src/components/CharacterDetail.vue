<!--
 * @Author: vspirit803
 * @Date: 2021-06-29 09:47:07
 * @Description:
 * @LastEditTime: 2021-07-11 20:49:46
 * @LastEditors: vspirit803
-->

<template>
  <div class="character-detail">
    <span class="text-h2">
      <span class="character-name">{{ character.name }}</span>
      <span class="character-level q-ml-md">Lv.{{ character.level }}</span>
    </span>
    <div class="row">
      <div class="character-detail-left">
        <div class="equipments-container">
          <q-icon name="mdi-human-handsdown" size="48rem" style="color: rgba(22, 22, 22, 0.1)"></q-icon>
          <template v-for="each of equipments" :key="each.uuid">
            <Item
              v-if="each.equipment"
              :key="each.uuid"
              :class="{
                'equipment-slot-available': draggingEquipment && each.isEquipmentAvailable(draggingEquipment),
                [`equipment-slot-${each.name}`]: true,
              }"
              :item="each.equipment"
              @dragover="(e) => onDragOver(e, each)"
              @drop="(e) => onDragDrop(e, each)"
              @click.right.prevent="() => onTakeOffEquipment(each)"
            />
            <div
              v-else
              class="equipment-slot"
              :class="{
                'equipment-slot-available': draggingEquipment && each.isEquipmentAvailable(draggingEquipment),
                [`equipment-slot-${each.name}`]: true,
              }"
              @dragover="(e) => onDragOver(e, each)"
              @drop="(e) => onDragDrop(e, each)"
            >
              {{ each.name }}
            </div>
          </template>
        </div>
      </div>
      <div class="character-detail-right column content-center">
        <div class="row">
          <template v-for="(eachProperty, key) of character.properties" :key="key">
            <template v-if="eachProperty">
              <span class="col-4">{{ t(`Properties.${key}`) }}</span>
              <span class="col-2 offset-4 text-right text-green">
                {{ eachProperty.characterValue }}
              </span>
              <span v-if="eachProperty.equipmentValue" class="col-2 text-left">
                +{{ eachProperty.equipmentValue }}
              </span>
            </template>
          </template>
        </div>
        <div class="skills-container row justify-center">
          <CharacterDetailSkill v-for="each of skills" :key="each.id" :skill="each" />
        </div>
        <div class="items-background row content-start">
          <Item
            v-for="each of availableEquipments"
            :key="each.uuid"
            :item="each"
            draggable="true"
            @dragstart="(e) => onDragStart(e, each)"
            @dragend="onDragEnd"
          />
          <Item v-for="index of 40 - availableEquipments.length" :key="index" class="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CharacterNormal, ItemCenter, ItemEquipment, ItemEquipmentSlot, SkillNormal } from 'sora-game-core';
import { computed, defineComponent, PropType, Ref, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import Item from '@/components/Item.vue';
import { useGame } from '@/use';

import CharacterDetailSkill from './CharacterDetailSkill.vue';

export default defineComponent({
  name: 'CharacterDetail',
  components: { CharacterDetailSkill, Item },
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
    const equipments = ref<Array<ItemEquipmentSlot>>(character.value.equipments);

    watch(character, () => refreshEquipments());

    function refreshEquipments() {
      equipments.value = character.value.equipments;
      availableEquipments.value = (game.backpack as ItemCenter).equipments.filter((each) => !each.wearer);
    }

    const availableEquipments = ref<Array<ItemEquipment>>(
      (game.backpack as ItemCenter).equipments.filter((each) => !each.wearer),
    );

    const draggingEquipment = ref<ItemEquipment | null>(null);

    function onDragStart(e: DragEvent, equipment: ItemEquipment) {
      e.dataTransfer?.setData('text/plain', equipment.name);
      draggingEquipment.value = equipment;
      // e.dataTransfer && (e.dataTransfer.dropEffect = 'copy');
    }

    function onDragOver(e: DragEvent, equipmentSlot: ItemEquipmentSlot) {
      e.preventDefault();

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
      e.preventDefault();

      if (!draggingEquipment.value) {
        return;
      }

      character.value.putOnEquipment(equipmentSlot, draggingEquipment.value);
      refreshEquipments();

      // console.log(`将装备${draggingEquipment.value!.name}放到装备槽${equipmentSlot.name}`);
    }

    function onTakeOffEquipment(equipmentSlot: ItemEquipmentSlot) {
      character.value.takeOffEquipment(equipmentSlot);
      refreshEquipments();
    }

    return {
      skills,
      equipments,
      refreshEquipments,
      availableEquipments,
      onDragStart,
      onDragOver,
      onDragEnd,
      onDragDrop,
      onTakeOffEquipment,
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
  width: 48rem;
  position: relative;
  margin-left: -8rem;
  .equipment-slot {
    width: 4rem;
    height: 4rem;

    border: 1px purple dashed;

    &-available {
      border: 2px red dashed !important;
    }

    &-武器 {
      position: absolute;
      top: 22rem;
      left: 8rem;
    }

    &-上衣 {
      position: absolute;
      top: 18rem;
      left: 22rem;
    }

    &-下装 {
      position: absolute;
      top: 32rem;
      left: 18rem;
    }

    &-鞋子 {
      position: absolute;
      top: 40rem;
      left: 22rem;
    }

    &-腰带 {
      position: absolute;
      top: 24rem;
      left: 22rem;
    }

    &-护肩 {
      position: absolute;
      top: 12rem;
      left: 28rem;
    }

    &-护膝 {
      position: absolute;
      top: 32rem;
      left: 26rem;
    }

    &-通用 {
      position: absolute;
      top: 4rem;
      left: 36rem;
    }
  }
}

.character-name {
  font-family: 'STXingkai';
}

.character-detail {
  &-left {
    overflow: hidden;
    width: 32rem;
    flex-grow: 0;
  }

  &-right {
    flex-grow: 1;

    gap: 2rem;
  }
}

.items-background {
  width: calc(4rem * 8 + 7px + 2px);
  height: calc(4rem * 5 + 4px + 2px);
  padding: 1px;
  background-color: rgba(240, 255, 255, 0.3);
  gap: 1px;
}

$rarityList: 'Normal' 'Rare' 'Mythical' 'Legendary' 'Ancient' 'Immortal';
@each $rarity in $rarityList {
  .equipment-#{$rarity} {
    border: 2px var(--color-#{to-lower-case($rarity)}) solid !important;
  }
}
</style>
