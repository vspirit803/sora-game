/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:24
 * @Description:
 * @LastEditTime: 2020-09-24 15:46:14
 * @LastEditors: vspirit803
 */
import { CharacterPropertyType } from '@core/Character/CharacterPropertyType';

import { ItemConfiguration } from './ItemConfiguration';
import { ItemEquipmentPropertyConfiguration } from './ItemEquipmentPropertyConfiguration';
import { ItemEquipmentType } from './ItemEquipmentType';
import { Equipment } from './ItemType';

/**
 * 装备配置接口
 */
export interface ItemEquipmentConfiguration extends ItemConfiguration {
  type: typeof Equipment;
  /**装备类别 */
  equipmentType: ItemEquipmentType;
  /**装备等级 */
  level: number;
  /**装备属性 */
  properties: { [propName in CharacterPropertyType]?: ItemEquipmentPropertyConfiguration };
}
