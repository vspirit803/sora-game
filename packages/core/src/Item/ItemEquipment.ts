/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:24
 * @Description: 装备
 * @LastEditTime: 2021-07-02 16:06:21
 * @LastEditors: vspirit803
 */
import { CharacterNormal } from '@core/Character';
import { CharacterPropertyType } from '@core/Character/CharacterPropertyType';
import { Rarity } from '@core/Common';
import { Game } from '@core/Game';
import { ObjectID } from 'bson';

import { IItemBase } from './IItemBase';
import { ItemCenter } from './ItemCenter';
import { ItemEquipmentConfiguration } from './ItemEquipmentConfiguration';
import { ItemEquipmentProperty } from './ItemEquipmentProperty';
import { ItemEquipmentSave } from './ItemEquipmentSave';
import { ItemEquipmentType } from './ItemEquipmentType';
import { Equipment } from './ItemType';

function isEquipmentSave(
  equipmentItem: ItemEquipmentConfiguration | ItemEquipmentSave,
): equipmentItem is ItemEquipmentSave {
  return 'uuid' in equipmentItem;
}

/**
 * 装备类物品
 */
export class ItemEquipment implements IItemBase {
  id: string;
  name: string;
  type: typeof Equipment;
  isStackable: false;
  rarity: Rarity;
  description: string;
  count: number;
  uuid: string;

  /**穿戴装备的角色 */
  wearer: CharacterNormal | null;
  /**装备部位 */
  equipmentType: ItemEquipmentType;
  /**装备属性 */
  properties: { [propName in CharacterPropertyType]?: ItemEquipmentProperty };
  /**装备等级 */
  level: number;

  /**装备评分 */
  get score(): number {
    return Object.values(this.properties)
      .map((eachProperty) => eachProperty!.value / eachProperty!.max)
      .reduce((prev, curr) => prev * curr, 1);
  }

  constructor(equipmentConfiguration: ItemEquipmentConfiguration);
  constructor(equipmentSave: ItemEquipmentSave);
  constructor(equipmentItem: ItemEquipmentConfiguration | ItemEquipmentSave) {
    let equipmentConfiguration: ItemEquipmentConfiguration;

    if (isEquipmentSave(equipmentItem)) {
      //参数为EquipmentSave
      const id = equipmentItem.id;
      const tempEquipmentConfiguration = ItemCenter.getInstance().equipmentsConfigurationMap.get(id);

      if (tempEquipmentConfiguration === undefined) {
        throw new Error(`装备[${id}]的配置不存在`);
      }

      equipmentConfiguration = tempEquipmentConfiguration;
    } else {
      //参数为EquipmentConfiguration
      equipmentConfiguration = equipmentItem;
    }

    const properties: { [propName in CharacterPropertyType]?: ItemEquipmentProperty } = {};

    for (const eachEquipmentPropertyConfiguration in equipmentConfiguration.properties) {
      const { min, max } =
        equipmentConfiguration.properties[eachEquipmentPropertyConfiguration as CharacterPropertyType]!;
      let value: number;
      if (!isEquipmentSave(equipmentItem)) {
        //范围内随机取值
        value = Game.getInstance().randomGenerator.get(min, max);
        //若为整数则取整
        if (Number.isInteger(min) && Number.isInteger(max)) {
          value = Math.round(value);
        }
      } else {
        //从存档读取数值
        value = equipmentItem.properties[eachEquipmentPropertyConfiguration as CharacterPropertyType]!;
      }
      properties[eachEquipmentPropertyConfiguration as CharacterPropertyType] = { min, max, value };
    }

    const { id, name, rarity, equipmentType, level, description } = equipmentConfiguration;

    this.uuid = isEquipmentSave(equipmentItem) ? equipmentItem.uuid : new ObjectID().toString();
    this.id = id;
    this.name = name;
    this.type = Equipment;
    this.rarity = rarity;
    this.isStackable = false;
    this.description = description;
    this.count = 1;

    this.level = level;
    this.equipmentType = equipmentType;
    this.properties = properties;
    this.wearer = null;

    //存档,且有人佩戴
    if (isEquipmentSave(equipmentItem) && equipmentItem.wearerId) {
      // const wearer: CharacterNormal;
      // wearer.putOnEquipment(thisEquipment);
    }
  }

  /**设置wearer */
  setWearer(wearer: CharacterNormal | null): void {
    this.wearer = wearer;
  }

  generateSave(): ItemEquipmentSave {
    const properties = Object.fromEntries(
      Object.entries(this.properties).map(([key, eachProperty]) => [key, eachProperty!.value]),
    );

    return {
      uuid: this.uuid,
      id: this.id,
      properties,
      count: 1,
      wearerId: this.wearer?.id,
    };
  }
}
