/*
 * @Author: vspirit803
 * @Date: 2021-05-20 15:11:14
 * @Description:
 * @LastEditTime: 2021-06-02 16:42:00
 * @LastEditors: vspirit803
 */
import { CharacterBattle } from './CharacterBattle';
import { CharacterPropertyNormal } from './CharacterPropertyNormal';

/**
 * 角色属性类(战斗状态)
 */
export class CharacterPropertyBattle extends CharacterPropertyNormal {
  /**绑定的角色 */
  character: CharacterBattle;
  /**额外百分比 */
  extraPercent: number;
  /**额外数值 */
  extraValue: number;

  constructor({ character, property }: { character: CharacterBattle; property: CharacterPropertyNormal }) {
    super({ character, property });
    this.character = character;
    this.baseValue = property.baseValue;
    this.increaseValue = property.increaseValue;
    this.equipmentValue = property.equipmentValue;
    this.extraPercent = 0;
    this.extraValue = 0;
  }

  /**
   * 获得战斗状态的属性值
   * 所有额外值均为加算,先算百分比再算固定值
   */
  get battleValue(): number {
    return Math.round(this.normalValue * (1 + this.extraPercent / 100) + this.extraValue);
  }
}
