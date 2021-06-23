<!--
 * @Author: vspirit803
 * @Date: 2021-04-14 16:48:40
 * @Description:
 * @LastEditTime: 2021-06-23 16:33:10
 * @LastEditors: vspirit803
-->
<template>
  <q-btn class="absolute-top-right" style="z-index: 999" @click="$router.push({ name: 'Home' })">退出</q-btn>
  <q-card class="items column q-pa-md items-stretch">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="equipments" label="装备" />
      <q-tab name="systemItems" label="系统" />
      <q-tab name="materials" label="材料" />
    </q-tabs>

    <q-separator />

    <q-tab-panels ref="tabPanels" v-model="tab" animated class="tab-content">
      <q-tab-panel v-for="(items, type) in itemsMap" :key="type" :name="type">
        <div class="items-background row content-start">
          <Item v-for="each of items" :key="each.uuid" :item="each" />
          <Item v-for="index of rowCount * colCount - items.length" :key="index" class="item" />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script lang="ts">
import { Game, ItemCenter } from 'sora-game-core';
import { defineComponent, ref } from 'vue';

import Item from '@/components/Item.vue';

export default defineComponent({
  name: 'Items',
  components: { Item },
  setup() {
    const game = Game.getInstance();
    const itemCenter: ItemCenter = game.backpack;
    const { equipments, systemItems, materials } = itemCenter;

    const tabPanels = ref();
    const colCount = ref(16);
    const rowCount = ref(9);

    return {
      tab: ref('equipments'),
      tabPanels,
      colCount,
      rowCount,
      itemsMap: {
        equipments,
        systemItems,
        materials,
      },
    };
  },
});
</script>
<style lang="scss" scoped>
.items {
  width: 100%;
  height: 100%;

  &-background {
    padding: 1px;
    width: calc(4rem * 16 + 15px + 2px);
    height: calc(4rem * 9 + 8px + 2px);
    background-color: rgba(240, 255, 255, 0.3);
    gap: 1px;
  }

  .tab-content {
    flex-grow: 1;
    font-size: 16px;
  }
}
</style>
