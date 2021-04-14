/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:24
 * @Description:
 * @LastEditTime: 2021-04-14 15:04:04
 * @LastEditors: vspirit803
 */
import { Rarity } from '@core/Common';

import { ItemBase } from './ItemBase';
import { ItemCenter } from './ItemCenter';
import { ItemMaterialConfiguration } from './ItemMaterialConfiguration';
import { ItemMaterialSave } from './ItemMaterialSave';
import { Material } from './ItemType';

function isItemMaterialSave(material: ItemMaterialConfiguration | ItemMaterialSave): material is ItemMaterialSave {
  return 'uuid' in material;
}

/**
 * 材料类物品
 */
export class ItemMaterial extends ItemBase {
  constructor(materialConfiguration: ItemMaterialConfiguration);
  constructor(materialSave: ItemMaterialSave);
  constructor(material: ItemMaterialConfiguration | ItemMaterialSave) {
    let materialConfiguration: ItemMaterialConfiguration;
    if (isItemMaterialSave(material)) {
      materialConfiguration = ItemCenter.getInstance().materialsConfigurationMap.get(material.id)!;
    } else {
      materialConfiguration = material;
    }

    const { id, name, rarity } = materialConfiguration;
    const uuid = isItemMaterialSave(material) ? material.uuid : undefined;
    const count = isItemMaterialSave(material) ? material.count : undefined;
    super({ uuid, id, name, isStackable: true, type: Material, rarity: rarity as Rarity, count });
  }

  generateSave(): ItemMaterialSave {
    return {
      uuid: this.uuid,
      id: this.id,
      count: this.count,
    };
  }
}
