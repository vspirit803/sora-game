/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:24
 * @Description:
 * @LastEditTime: 2020-09-24 14:48:42
 * @LastEditors: vspirit803
 */
import { ItemEquipmentPropertyConfiguration } from './ItemEquipmentPropertyConfiguration';

/**
 * 装备属性类
 */
export interface ItemEquipmentProperty extends ItemEquipmentPropertyConfiguration {
  /**实际值 */
  value: number;
}
