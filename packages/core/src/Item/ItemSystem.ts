/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:24
 * @Description:
 * @LastEditTime: 2021-06-23 13:25:39
 * @LastEditors: vspirit803
 */
import { Rarity } from '@core/Common';

import { ItemBase } from './ItemBase';
import { ItemCenter } from './ItemCenter';
import { ItemSystemConfiguration } from './ItemSystemConfiguration';
import { ItemSystemSave } from './ItemSystemSave';
import { System } from './ItemType';

function isItemSystemSave(system: ItemSystemConfiguration | ItemSystemSave): system is ItemSystemSave {
  return 'uuid' in system;
}

/**
 * 系统物品
 */
export class ItemSystem extends ItemBase {
  constructor(systemConfiguration: ItemSystemConfiguration);
  constructor(systemSave: ItemSystemSave);
  constructor(systemItem: ItemSystemConfiguration | ItemSystemSave) {
    let systemConfiguration: ItemSystemConfiguration;
    if (isItemSystemSave(systemItem)) {
      systemConfiguration = ItemCenter.getInstance().systemsConfigurationMap.get(systemItem.id)!;
    } else {
      systemConfiguration = systemItem;
    }

    const { id, name, rarity, description, isStackable } = systemConfiguration;
    const uuid = isItemSystemSave(systemItem) ? systemItem.uuid : undefined;
    const count = isItemSystemSave(systemItem) ? systemItem.count : undefined;
    super({ uuid, id, name, isStackable, type: System, rarity: rarity as Rarity, count, description });
  }

  generateSave(): ItemSystemSave {
    return {
      uuid: this.uuid,
      id: this.id,
      count: this.count,
    };
  }
}
