/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:24
 * @Description:
 * @LastEditTime: 2021-06-23 11:49:46
 * @LastEditors: vspirit803
 */

import { Rarity } from '@core/Common';

import { ItemType } from './ItemType';

/**
 * 物品配置接口
 */
export interface ItemConfiguration {
  /**配置id */
  id: string;
  /**名称 */
  name: string;
  /**类别 */
  type: ItemType;
  /**能否堆叠 */
  isStackable?: boolean;
  /**稀有度 */
  rarity: Rarity;
  description: string;
}
