/*
 * @Author: vspirit803
 * @Date: 2021-06-30 17:10:54
 * @Description: 装备槽
 * @LastEditTime: 2021-06-30 17:20:19
 * @LastEditors: vspirit803
 */
import { ItemEquipment } from './ItemEquipment';
import { ItemEquipmentType } from './ItemEquipmentType';

export class ItemEquipmentSlot {
  name: string; // 槽位名称
  availableEquipmentTypes: Array<ItemEquipmentType>; // 允许的装备类型
  equipment?: ItemEquipment; // 装备

  constructor({
    name,
    availableEquipmentTypes,
    equipment,
  }: {
    name: string;
    availableEquipmentTypes: Array<ItemEquipmentType>;
    equipment?: ItemEquipment;
  }) {
    this.name = name;
    this.availableEquipmentTypes = availableEquipmentTypes;
    this.equipment = equipment;
  }
}
