<!--
 * @Author: vspirit803
 * @Date: 2021-06-29 09:47:07
 * @Description:
 * @LastEditTime: 2021-07-01 17:51:26
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
    <div class="equipments-container row justify-center">
      <div
        v-for="each of equipments"
        :key="each.uuid"
        class="equipment-slot"
        :class="{ 'equipment-slot-available': draggingEquipment && each.isEquipmentAvailable(draggingEquipment) }"
        @dragover="(e) => onDragOver(e, each)"
        @drop="(e) => onDragDrop(e, each)"
        @click.right.prevent="() => onTakeOffEquipment(each)"
      >
        {{ each.name }} {{ each.equipment?.name }}
      </div>
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

    const draggingEquipment = ref<ItemEquipment | undefined>();

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
      draggingEquipment.value = undefined;
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
  gap: 1rem;

  .equipment-slot {
    width: 4rem;
    height: 4rem;

    border: 1px purple dashed;

    &-available {
      border: 2px red solid;
    }
  }
}

.items-background {
  width: calc(4rem * 8 + 7px + 2px);
  height: calc(4rem * 5 + 4px + 2px);
}
</style>
