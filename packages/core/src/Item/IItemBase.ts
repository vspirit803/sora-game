import { Rarity, UUID } from '@core/Common';

import { ItemType } from './ItemType';

/**
 * 物品基础接口
 */
export interface IItemBase extends UUID {
  id: string; // 配置id
  name: string; // 名称
  type: ItemType; // 类别
  isStackable: boolean; // 能否堆叠
  rarity: Rarity; // 稀有度
  description: string; // 描述
  count: number; // 数量
}
