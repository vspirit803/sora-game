/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:24
 * @Description:
 * @LastEditTime: 2021-06-23 13:25:39
 * @LastEditors: vspirit803
 */
import { Rarity } from '@core/Common';
import { ObjectID } from 'bson';

import { IItemBase } from './IItemBase';
import { ItemCenter } from './ItemCenter';
import { ItemSystemConfiguration } from './ItemSystemConfiguration';
import { ItemSystemSave } from './ItemSystemSave';
import { System } from './ItemType';

function isItemSystemSave(systemItem: ItemSystemConfiguration | ItemSystemSave): systemItem is ItemSystemSave {
  return 'uuid' in systemItem;
}

/**
 * 系统物品
 */
export class ItemSystem implements IItemBase {
  uuid: string;
  id: string;
  name: string;
  type: typeof System;
  isStackable: boolean;
  rarity: Rarity;
  count: number;
  description: string;

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

    this.uuid = isItemSystemSave(systemItem) ? systemItem.uuid : new ObjectID().toString();
    this.id = id;
    this.name = name;
    this.type = System;
    this.rarity = rarity;
    this.isStackable = isStackable;
    this.description = description;
    this.count = isItemSystemSave(systemItem) ? systemItem.count : 1;
  }

  generateSave(): ItemSystemSave {
    return {
      uuid: this.uuid,
      id: this.id,
      count: this.count,
    };
  }
}
