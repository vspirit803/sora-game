/*
 * @Author: vspirit803
 * @Date: 2020-09-25 10:47:53
 * @Description: 技能(普通状态)
 * @LastEditTime: 2021-06-29 09:58:06
 * @LastEditors: vspirit803
 */
import { CharacterNormal } from '@core/Character';

import { SkillCenter } from './SkillCenter';
import { SkillData } from './SkillData';
import * as SkillTarget from './SkillTarget';
import { SkillTargetType } from './SkillTarget';
import { SkillType } from './SkillType';

/**
 * 技能(普通状态)
 */
export class SkillNormal {
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
  owner: CharacterNormal;
  /**可选目标 */
  target: SkillTargetType;

  constructor({ owner, id, level = 1 }: { owner: CharacterNormal; id: string; level?: number }) {
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
    this.level = level;
    this.description = skillConfigration.description;
    this.data = skillConfigration.levels[this.level - 1];
    this.cooldown = skillConfigration.cooldown ?? 0;
    this.target = skillConfigration.target ?? SkillTarget.NON_TARGET;

    this.owner = owner;
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
