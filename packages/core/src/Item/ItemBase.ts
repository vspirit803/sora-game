/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:24
 * @Description: 物品基类
 * @LastEditTime: 2021-06-23 16:19:39
 * @LastEditors: vspirit803
 */
import { Normal, Rarity, UUID } from '@core/Common';
import { ObjectId } from 'bson';

import { ItemType, Material } from './ItemType';

/**
 * 物品基类
 */
export abstract class ItemBase implements UUID {
  uuid: string; // uuid
  id: string; // 配置id
  name: string; // 名称
  type: ItemType; // 类别
  isStackable: boolean; // 能否堆叠
  rarity: Rarity; // 稀有度
  count: number; // 数量
  description: string; // 描述

  constructor({
    uuid = new ObjectId().toHexString(),
    id,
    name,
    isStackable = false,
    type = Material,
    rarity = Normal,
    count = 1,
    description = '',
  }: {
    uuid?: string;
    id: string;
    name: string;
    isStackable?: boolean;
    type?: ItemType;
    rarity?: Rarity;
    count?: number;
    description?: string;
  }) {
    this.uuid = uuid;
    this.type = type;
    this.id = id;
    this.name = name;
    this.isStackable = isStackable;
    this.rarity = rarity;
    this.count = count;
    this.description = description;
  }
}
