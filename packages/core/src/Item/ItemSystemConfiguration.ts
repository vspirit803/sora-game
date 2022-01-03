/*
 * @Author: vspirit803
 * @Date: 2020-09-24 14:00:05
 * @Description:
 * @LastEditTime: 2020-09-24 15:19:20
 * @LastEditors: vspirit803
 */
import { ItemConfiguration } from './ItemConfiguration';
import { System } from './ItemType';

/**
 * 系统物品配置接口
 */
export interface ItemSystemConfiguration extends ItemConfiguration {
  isStackable: boolean;
  type: typeof System;
}
