<!--
 * @Author: vspirit803
 * @Date: 2021-06-21 17:17:29
 * @Description:
 * @LastEditTime: 2021-06-23 16:55:23
 * @LastEditors: vspirit803
-->

<template>
  <div v-if="item" class="item relative-position" :class="`item-${item.rarity}`">
    {{ item.name }}
    <span v-if="item.count > 1" class="absolute-bottom-right item-count q-mr-xs">{{ item.count }}</span>
    <q-tooltip :model-value="true" class="item-detail">
      <div style="width: 200px" class="column no-wrap">
        <div class="row text-weight-bold">
          <span class="text-h6" :class="`item-${item.rarity}`">{{ t(`ItemRarity.${item.rarity}`) }}</span>
          <q-space />
          <span class="text-h6">{{ item.name }}</span>
          <span v-if="item instanceof ItemEquipment && true" class="col-4 offset-8 text-right">
            {{ t(`EquipmentType.${item.equipmentType}`) }}
          </span>
        </div>

        <div>
          <q-separator dark />
          <div v-if="item instanceof ItemEquipment && true" class="row">
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
          <span class="item-description" v-html="item.description"></span>
        </div>
      </div>
    </q-tooltip>
  </div>
  <div v-else class="item" />
</template>

<script lang="ts">
import { ItemBase, ItemEquipment } from 'sora-game-core';
import { defineComponent, PropType } from 'vue-demi';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Item',
  props: {
    item: {
      type: Object as PropType<ItemBase>,
      default: null,
    },
  },
  setup() {
    function isEquipment(item: ItemBase) {
      return item instanceof ItemEquipment;
    }

    return { isEquipment, ...useI18n(), ItemEquipment };
  },
});
</script>

<style lang="scss" scoped>
$rarityList: 'Normal' 'Rare' 'Mythical' 'Legendary' 'Ancient' 'Immortal';

.item {
  width: 4rem;
  height: 4rem;
  border: 4px silver solid;
  border-radius: 8px;

  &-count {
    font-size: 0.75rem;
  }

  @each $rarity in $rarityList {
    &-#{$rarity} {
      border-color: var(--color-#{to-lower-case($rarity)});
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
