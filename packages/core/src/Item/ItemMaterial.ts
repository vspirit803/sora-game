/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:24
 * @Description:
 * @LastEditTime: 2021-06-23 13:25:31
 * @LastEditors: vspirit803
 */
import { Rarity } from '@core/Common';
import { ObjectID } from 'bson';

import { IItemBase } from './IItemBase';
import { ItemCenter } from './ItemCenter';
import { ItemMaterialConfiguration } from './ItemMaterialConfiguration';
import { ItemMaterialSave } from './ItemMaterialSave';
import { Material } from './ItemType';

function isItemMaterialSave(
  materialItem: ItemMaterialConfiguration | ItemMaterialSave,
): materialItem is ItemMaterialSave {
  return 'uuid' in materialItem;
}

/**
 * 材料类物品
 */
export class ItemMaterial implements IItemBase {
  id: string;
  name: string;
  type: typeof Material;
  isStackable: boolean;
  rarity: Rarity;
  description: string;
  count: number;
  uuid: string;

  constructor(materialConfiguration: ItemMaterialConfiguration);
  constructor(materialSave: ItemMaterialSave);
  constructor(materialItem: ItemMaterialConfiguration | ItemMaterialSave) {
    let materialConfiguration: ItemMaterialConfiguration;

    if (isItemMaterialSave(materialItem)) {
      materialConfiguration = ItemCenter.getInstance().materialsConfigurationMap.get(materialItem.id)!;
    } else {
      materialConfiguration = materialItem;
    }

    const { id, name, rarity, description, isStackable } = materialConfiguration;

    this.uuid = isItemMaterialSave(materialItem) ? materialItem.uuid : new ObjectID().toString();
    this.id = id;
    this.name = name;
    this.type = Material;
    this.rarity = rarity;
    this.isStackable = isStackable;
    this.description = description;
    this.count = isItemMaterialSave(materialItem) ? materialItem.count : 1;
  }

  generateSave(): ItemMaterialSave {
    return {
      uuid: this.uuid,
      id: this.id,
      count: this.count,
    };
  }
}
