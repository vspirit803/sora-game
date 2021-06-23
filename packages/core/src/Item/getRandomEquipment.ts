/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:24
 * @Description:
 * @LastEditTime: 2021-04-14 14:39:38
 * @LastEditors: vspirit803
 */
import { Normal, Immortal, Legendary, Mythical, Rare, Rarity } from '@core/Common';
import { Game } from '@core/Game';
import { ItemRarityRate as rarityRate } from 'sora-game-assets';

import { ItemEquipment } from './ItemEquipment';
import { ItemEquipmentType, Weapon } from './ItemEquipmentType';
import { Equipment } from './ItemType';

export function generateEquipment({
  id,
  name,
  equipmentType,
  rarity,
  level,
}: {
  id: string;
  name: string;
  equipmentType: ItemEquipmentType;
  rarity?: Rarity;
  level?: number;
}): ItemEquipment {
  const randomGenerator = Game.getInstance().randomGenerator;

  if (rarity === undefined) {
    const r = randomGenerator.get();

    if (r < rarityRate.Immortal.stackRate) {
      rarity = Immortal;
    } else if (r < rarityRate.Legendary.stackRate) {
      rarity = Legendary;
    } else if (r < rarityRate.Mythical.stackRate) {
      rarity = Mythical;
    } else if (r < rarityRate.Rare.stackRate) {
      rarity = Rare;
    } else {
      rarity = Normal;
    }
  }

  if (level === undefined) {
    level = randomGenerator.getInt(20) * 5;
  }
  const rarityRange = rarityRate as { [rarity: string]: { min: number; max: number } };
  equipmentType = Weapon;
  const { min: minRatio, max: maxRatio } = { ...rarityRange[rarity] };
  const min = Math.round(Math.sin((0.01 * level - 0.5) * Math.PI + 1) * 500 * minRatio);
  const max = Math.round(Math.sin((0.01 * level - 0.5) * Math.PI + 1) * 500 * maxRatio);
  const value = randomGenerator.getInt(min, max);
  const properties = { atk: { min, max, value } };

  return new ItemEquipment({
    id,
    name,
    rarity,
    equipmentType,
    level,
    properties,
    type: Equipment,
  });
}

export class ItemEquipmentBuilder {
  private id?: string;
  private name?: string;
  private equipmentType?: ItemEquipmentType;
  private rarity?: Rarity;
  private level?: number;

  constructor() {
    const randomGenerator = Game.getInstance().randomGenerator;
    const r = randomGenerator.get();

    if (r < rarityRate.Immortal.stackRate) {
      this.rarity = Immortal;
    } else if (r < rarityRate.Legendary.stackRate) {
      this.rarity = Legendary;
    } else if (r < rarityRate.Mythical.stackRate) {
      this.rarity = Mythical;
    } else if (r < rarityRate.Rare.stackRate) {
      this.rarity = Rare;
    } else {
      this.rarity = Normal;
    }
  }

  setId(id: string): ItemEquipmentBuilder {
    this.id = id;
    return this;
  }

  setName(name: string): ItemEquipmentBuilder {
    this.name = name;
    return this;
  }

  setEquipmentType(equipmentType: ItemEquipmentType): ItemEquipmentBuilder {
    this.equipmentType = equipmentType;
    return this;
  }

  setRarity(rarity: Rarity): ItemEquipmentBuilder {
    this.rarity = rarity;
    return this;
  }

  setLevel(level: number): ItemEquipmentBuilder {
    this.level = level;
    return this;
  }

  getResult(): ItemEquipment {
    if (this.id === undefined) {
      throw new Error('The id of ItemEquipment cannot be undefined.');
    }

    if (this.name === undefined) {
      throw new Error('The name of ItemEquipment cannot be undefined.');
    }

    if (this.rarity === undefined) {
      throw new Error('The rarity of ItemEquipment cannot be undefined.');
    }

    if (this.equipmentType === undefined) {
      throw new Error('The equipmentType of ItemEquipment cannot be undefined.');
    }

    if (this.level === undefined) {
      throw new Error('The level of ItemEquipment cannot be undefined.');
    }

    return new ItemEquipment({
      id: this.id,
      name: this.name,
      rarity: this.rarity,
      equipmentType: this.equipmentType,
      level: this.level,
      properties: {},
      type: Equipment,
    });
  }
}
