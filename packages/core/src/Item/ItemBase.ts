/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:24
 * @Description: 物品基类
 * @LastEditTime: 2021-04-14 15:03:40
 * @LastEditors: vspirit803
 */
import { Common, Rarity, UUID } from '@core/Common';
import { ObjectId } from 'bson';

import { ItemType, Material } from './ItemType';

/**
 * 物品基类
 */
export abstract class ItemBase implements UUID {
  /**uuid */
  uuid: string;
  /**配置id */
  id: string;
  /**名称 */
  name: string;
  /**类别 */
  type: ItemType;
  /**能否堆叠 */
  isStackable: boolean;
  /**稀有度 */
  rarity: Rarity;
  /**数量 */
  count: number;

  constructor({
    uuid = new ObjectId().toHexString(),
    id,
    name,
    isStackable = false,
    type = Material,
    rarity = Common,
    count = 1,
  }: {
    uuid?: string;
    id: string;
    name: string;
    isStackable?: boolean;
    type?: ItemType;
    rarity?: Rarity;
    count?: number;
  }) {
    this.uuid = uuid;
    this.type = type;
    this.id = id;
    this.name = name;
    this.isStackable = isStackable;
    this.rarity = rarity;
    this.count = count;
  }
}
