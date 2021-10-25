<!--
 * @Author: vspirit803
 * @Date: 2021-10-29 10:54:44
 * @Description: 装备槽
 * @LastEditTime: 2021-10-29 18:00:15
 * @LastEditors: vspirit803
-->
<template>
  <Item
    v-if="equipmentSlot.equipment"
    :key="equipmentSlot.uuid"
    class="equipment-slot"
    :class="{
      'equipment-slot-available': available,
    }"
    :item="equipmentSlot.equipment"
    @click.right.prevent="onTakeOffEquipment"
  />
  <div
    v-else
    class="equipment-slot equipment-slot-empty"
    :class="{
      'equipment-slot-available': available,
    }"
  >
    {{ equipmentSlot.name }}
  </div>
</template>

<script lang="ts">
import { ItemEquipment, ItemEquipmentSlot } from 'sora-game-core';
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import Item from '@/components/Item.vue';

export default defineComponent({
  name: 'CharacterDetailEquipmentSlot',
  components: { Item },
  props: {
    equipmentSlot: {
      type: Object as PropType<ItemEquipmentSlot>,
      required: true,
    },
    draggingEquipment: {
      type: Object as PropType<ItemEquipment | null>,
      default: () => null,
    },
    available: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: { takeOffEquipment: () => true },
  setup(props, { emit }) {
    function onTakeOffEquipment() {
      emit('takeOffEquipment');
    }

    return {
      onTakeOffEquipment,
      ...useI18n(),
    };
  },
});
</script>
<style lang="scss">
.equipment-slot {
  width: 4rem;
  height: 4rem;
  border-radius: 8px;

  &-empty {
    border: 1px grey dashed;
    font-size: 0.75rem;
  }

  &-available {
    border-style: dashed !important;
    border-width: 4px !important;
  }
}
</style>
