<!--
 * @Author: vspirit803
 * @Date: 2021-06-21 17:17:29
 * @Description:
 * @LastEditTime: 2021-06-24 11:13:48
 * @LastEditors: vspirit803
-->

<template>
  <div v-if="item" class="item relative-position" :class="`item-${item.rarity}`">
    {{ item.name }}
    <span v-if="item.count > 1" class="absolute-bottom-right item-count q-mr-xs">{{ item.count }}</span>
    <q-tooltip class="item-detail">
      <div style="width: 200px" class="column no-wrap">
        <div class="row text-weight-bold">
          <span class="text-h6" :class="`item-${item.rarity}`">{{ t(`ItemRarity.${item.rarity}`) }}</span>
          <q-space />
          <span class="text-h6">{{ item.name }}</span>
          <span v-if="isEquipment(item)" class="col-4 offset-8 text-right">
            {{ t(`EquipmentType.${item.equipmentType}`) }}
          </span>
        </div>

        <div>
          <q-separator dark />
          <div v-if="isEquipment(item)" class="row">
            <template v-for="(eachProperty, key) of item.properties" :key="key">
              <template v-if="eachProperty">
                <span class="col-4">{{ t(`Properties.${key}`) }}</span>
                <span class="col-4 offset-4 text-right">{{ eachProperty.value }}</span>
              </template>
            </template>
          </div>
        </div>

        <div v-if="item.description">
          <q-separator dark />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span class="item-description" v-html="item.description" />
        </div>
      </div>
    </q-tooltip>
  </div>
  <div v-else class="item" />
</template>

<script lang="ts">
import { IItemBase, ItemEquipment } from 'sora-game-core';
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Item',
  props: {
    item: {
      type: Object as PropType<IItemBase>,
      default: null,
    },
  },
  setup() {
    function isEquipment(item: IItemBase): item is ItemEquipment {
      return item instanceof ItemEquipment;
    }

    return { isEquipment, ...useI18n() };
  },
});
</script>

<style lang="scss" scoped>
$rarityList: 'Normal' 'Rare' 'Mythical' 'Legendary' 'Ancient' 'Immortal';

.item {
  width: 4rem;
  height: 4rem;
  border-radius: 8px;
  box-shadow: inset 0 0 4px 4px silver;

  &-count {
    font-size: 0.75rem;
  }

  @each $rarity in $rarityList {
    &.item-#{$rarity} {
      box-shadow: inset 0 0 4px 4px var(--color-#{to-lower-case($rarity)});
    }
  }
}

.q-tooltip {
  @each $rarity in $rarityList {
    .item-#{$rarity} {
      color: var(--color-#{to-lower-case($rarity)});
    }
  }
}
</style>

<style lang="css">
.q-tooltip.item-detail {
  background-color: #282c34;
  font-size: 1rem;
}
</style>
