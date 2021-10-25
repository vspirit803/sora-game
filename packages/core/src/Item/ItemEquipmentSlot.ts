/*
 * @Author: vspirit803
 * @Date: 2021-06-30 17:10:54
 * @Description: 装备槽
 * @LastEditTime: 2021-07-01 10:22:23
 * @LastEditors: vspirit803
 */
import { ObjectId } from 'bson';

import { ItemEquipment } from './ItemEquipment';
import { ItemEquipmentType } from './ItemEquipmentType';

export class ItemEquipmentSlot {
  uuid: string;
  name: string; // 槽位名称
  availableEquipmentTypes: Array<ItemEquipmentType>; // 允许的装备类型
  equipment: ItemEquipment | null; // 装备

  constructor({
    name,
    availableEquipmentTypes,
    equipment = null,
  }: {
    name: string;
    availableEquipmentTypes: Array<ItemEquipmentType>;
    equipment?: ItemEquipment | null;
  }) {
    this.name = name;
    this.availableEquipmentTypes = availableEquipmentTypes;
    this.equipment = equipment;
    this.uuid = new ObjectId().toHexString();
  }

  isEquipmentAvailable(equipment: ItemEquipment): boolean {
    return this.availableEquipmentTypes.includes(equipment.equipmentType);
  }
}
