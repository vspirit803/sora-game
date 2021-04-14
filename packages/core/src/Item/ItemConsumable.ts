/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:24
 * @Description:
 * @LastEditTime: 2021-04-14 14:39:30
 * @LastEditors: vspirit803
 */
import { Rarity } from '@core/Common';

import { ItemBase } from './ItemBase';
import { Consumable } from './ItemType';

/**
 * 消耗类物品
 */
export class ItemConsumable extends ItemBase {
  constructor({
    uuid,
    id = 'Consumable00000',
    name = '未命名消耗品',
    count = 1,
    rarity,
  }: { uuid?: string; id?: string; name?: string; rarity?: Rarity; count?: number } = {}) {
    super({ uuid, id, name, isStackable: true, type: Consumable, rarity, count });
  }
}
