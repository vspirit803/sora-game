/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:24
 * @Description: 装备类型
 * @LastEditTime: 2021-04-14 14:31:35
 * @LastEditors: vspirit803
 */
const Weapon = 'Weapon'; //武器
const Coat = 'Coat'; //上衣
const Pants = 'Pants'; //下装
const Shoes = 'Shoes'; //鞋子
const Belt = 'Belt'; //腰带
const Shoulders = 'Shoulders'; //护肩
const Kneecap = 'Kneecap'; //护膝
const Necklace = 'Necklace'; //项链
const Bracelet = 'Bracelet'; //手镯
const Ring = 'Ring'; //戒指

const ItemEquipmentTypes = [
  Belt,
  Coat,
  // Kneecap,
  Pants,
  Shoes,
  Shoulders,
  Weapon,
  Necklace,
  Bracelet,
  Ring,
] as const;
type ItemEquipmentType = typeof ItemEquipmentTypes[number];

export {
  Belt,
  Bracelet,
  Coat,
  ItemEquipmentType,
  ItemEquipmentTypes,
  Kneecap,
  Necklace,
  Pants,
  Ring,
  Shoes,
  Shoulders,
  Weapon,
};
