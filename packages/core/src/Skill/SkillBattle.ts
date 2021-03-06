/*
 * @Author: vspirit803
 * @Date: 2020-09-25 10:47:53
 * @Description: 技能(战斗状态)
 * @LastEditTime: 2021-05-31 17:32:30
 * @LastEditors: vspirit803
 */
import { CharacterBattle } from '@core/Character';

import { SkillCenter } from './SkillCenter';
import { SkillData } from './SkillData';
import { SkillNormal } from './SkillNormal';
import { SkillStore } from './SkillStore';
import * as SkillTarget from './SkillTarget';
import { SkillTargetType } from './SkillTarget';
import { SkillType } from './SkillType';

/**
 * 技能(战斗状态)
 */
export class SkillBattle implements SkillNormal {
  /**技能id */
  id: string;
  /**技能名称 */
  name: string;
  /**技能数据 */
  data: SkillData;
  /**技能类别 */
  type: SkillType;
  /**技能描述 */
  description: string;
  /**技能等级 */
  level: number;
  /**技能冷却 */
  cooldown: number;
  /**技能拥有者 */
  owner: CharacterBattle;
  /**当前冷却 */
  currCooldown: number;
  /**可选目标 */
  target: SkillTargetType;

  handler?: (skillData: SkillData, source: CharacterBattle, target: CharacterBattle) => Promise<void>;

  constructor({ owner, id, level = 1 }: { owner: CharacterBattle; id: string; level?: number }) {
    const skillConfigration = SkillCenter.getInstance().skillConfigurationMap.get(id);
    if (skillConfigration === undefined) {
      throw new Error(`技能[${id}]配置不存在`);
    }
    if (skillConfigration.levels[level - 1] === undefined) {
      throw new Error(`技能[${skillConfigration.id}-${skillConfigration.name}]没有level.${level}的数据`);
    }
    this.id = skillConfigration.id;
    this.name = skillConfigration.name;
    this.type = skillConfigration.type;
    this.description = skillConfigration.description;
    this.cooldown = skillConfigration.cooldown ?? 0;
    this.currCooldown = 0;
    this.level = level;
    this.data = skillConfigration.levels[level - 1];
    this.target = skillConfigration.target ?? SkillTarget.NON_TARGET;

    this.owner = owner;

    if (this.type !== 'passive') {
      this.handler = SkillStore.getInstance().getHandler(id);
    }
  }

  async trigger(target: CharacterBattle): Promise<any> {
    if (!this.handler) {
      throw new Error(`技能[${this.id}]不能主动触发`);
    }
    // console.log(`[${this.owner.name}]对[${target.name}]施放了[${this.name}]`);
    await this.handler(this.data, this.owner, target);
    this.currCooldown = this.cooldown + 1; //包含本回合
  }

  getTargets(): Array<CharacterBattle> {
    if (this.isNonTarget) {
      return [];
    }

    let tempList: Array<CharacterBattle> = [];

    if (this.target & SkillTarget.SELF) {
      tempList.push(this.owner);
    }
    if (this.target & SkillTarget.TEAM_MATE) {
      tempList = [...tempList, ...this.owner.teammates];
    }
    if (this.target & SkillTarget.ENEMY) {
      tempList = [...tempList, ...this.owner.enemies];
    }
    if (!(this.target & SkillTarget.ALIVE)) {
      tempList = tempList.filter((each) => !each.isAlive);
    }
    if (!(this.target & SkillTarget.DEAD)) {
      tempList = tempList.filter((each) => each.isAlive);
    }

    return tempList;
  }

  get isNonTarget(): boolean {
    return Boolean(this.target & SkillTarget.NON_TARGET);
  }

  get isPassive(): boolean {
    return this.type === 'passive';
  }

  get isAttack(): boolean {
    return this.type === 'skill_attack' || this.type === 'attack';
  }

  get isTreat(): boolean {
    return this.type === 'skill_treat';
  }
}
