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

const ItemEquipmentTypes = [Belt, Coat, Kneecap, Pants, Shoes, Shoulders, Weapon];
type ItemEquipmentType =
  | typeof Weapon
  | typeof Coat
  | typeof Pants
  | typeof Shoes
  | typeof Belt
  | typeof Shoulders
  | typeof Kneecap;

export { Belt, Coat, ItemEquipmentType, ItemEquipmentTypes, Kneecap, Pants, Shoes, Shoulders, Weapon };
