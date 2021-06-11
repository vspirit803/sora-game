/*
 * @Author: vspirit803
 * @Date: 2020-09-27 10:36:03
 * @Description:
 * @LastEditTime: 2021-06-18 13:30:40
 * @LastEditors: vspirit803
 */
import 'reflect-metadata';

import { CharacterBattle } from '@core/Character';

import { SkillData } from './SkillData';

function DefineSkill(key: any): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(key, descriptor.value!, target);
    return;
  };
}

export class SkillStore {
  private static instance: SkillStore;
  static getInstance(): SkillStore {
    if (!SkillStore.instance) {
      SkillStore.instance = new SkillStore();
    }
    return SkillStore.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  getHandler(id: string): (skillData: SkillData, source: CharacterBattle, target: CharacterBattle) => Promise<void> {
    const handler = Reflect.getMetadata(id, this);
    if (typeof handler !== 'function') {
      throw new Error(`技能[${id}]的处理函数不存在`);
    }
    return handler;
  }

  @DefineSkill('S00000')
  async skill00000(skillData: SkillData, source: CharacterBattle, target: CharacterBattle): Promise<void> {
    const battle = source.battle;
    const ratio = skillData.ratio;
    const isCrit = battle.randomDecider.prdDecider(source, source.properties.critRate.battleValue);
    const damage = Math.round(
      source.properties.atk.battleValue *
        (isCrit ? source.properties.critMultiplier.battleValue : 1) *
        ratio *
        battle.randomGenerator.getRandomFloat(),
    );
    await battle.eventCenter.trigger(source, { eventType: 'Damaging', source, target, damage, isCrit });
  }

  @DefineSkill('S00001')
  async skill00001(skillData: SkillData, source: CharacterBattle, target: CharacterBattle): Promise<void> {
    const battle = source.battle;
    const ratio = skillData.ratio;
    const isCrit = battle.randomDecider.prdDecider(source, source.properties.critRate.battleValue);
    const damage = Math.round(
      source.properties.atk.battleValue *
        (isCrit ? source.properties.critMultiplier.battleValue : 1) *
        ratio *
        battle.randomGenerator.getRandomFloat(),
    );
    await battle.eventCenter.trigger(source, { eventType: 'Damaging', source, target, damage, isCrit });
  }

  //地狱之手 茨木大招
  @DefineSkill('S00003')
  async skill00003(skillData: SkillData, source: CharacterBattle, target: CharacterBattle): Promise<void> {
    const battle = source.battle;
    const ratio = skillData.ratio;
    const isCrit = battle.randomDecider.prdDecider(source, source.properties.critRate.battleValue);
    const damage = Math.round(
      source.properties.atk.battleValue *
        (isCrit ? source.properties.critMultiplier.battleValue : 1) *
        ratio *
        battle.randomGenerator.getRandomFloat(),
    );
    await battle.eventCenter.trigger(source, { eventType: 'Damaging', source, target, damage, isCrit });
  }

  //窒碍短匕
  @DefineSkill('S00004')
  async skill00004(skillData: SkillData, source: CharacterBattle, target: CharacterBattle): Promise<void> {
    const battle = source.battle;
    const ratio = skillData.ratio;
    const isCrit = battle.randomDecider.prdDecider(source, source.properties.critRate.battleValue);
    const damage = Math.round(
      source.properties.atk.battleValue *
        (isCrit ? source.properties.critMultiplier.battleValue : 1) *
        ratio *
        battle.randomGenerator.getRandomFloat(),
    );
    await battle.eventCenter.trigger(source, { eventType: 'Damaging', source, target, damage, isCrit });
  }

  //幻影突袭
  @DefineSkill('S00005')
  async skill00005(skillData: SkillData, source: CharacterBattle, target: CharacterBattle): Promise<void> {
    const battle = source.battle;
    const { ratio, times } = skillData;
    for (let i = 0; i < times; i++) {
      const isCrit = battle.randomDecider.prdDecider(source, source.properties.critRate.battleValue);
      const damage = Math.round(
        source.properties.atk.battleValue *
          (isCrit ? source.properties.critMultiplier.battleValue : 1) *
          ratio *
          battle.randomGenerator.getRandomFloat(),
      );

      const data = { eventType: 'Damaging' as const, source, target, damage, isCrit };
      await battle.eventCenter.trigger(source, data);
    }
  }

  //恩赐解脱
  @DefineSkill('S00007')
  async skill00007(skillData: SkillData, source: CharacterBattle, target: CharacterBattle): Promise<void> {
    const battle = source.battle;
    const ratio = skillData.ratio;
    const isCrit = battle.randomDecider.prdDecider(source, source.properties.critRate.battleValue);
    const damage = Math.round(
      source.properties.atk.battleValue *
        (isCrit ? source.properties.critMultiplier.battleValue : 1) *
        ratio *
        battle.randomGenerator.getRandomFloat(),
    );

    await battle.eventCenter.trigger(source, { eventType: 'Damaging', source, target, damage, isCrit });
  }

  //羽刃暴风
  @DefineSkill('S00008')
  async skill00008(skillData: SkillData, source: CharacterBattle, target: CharacterBattle): Promise<void> {
    const battle = source.battle;
    const ratio = skillData.ratio;
    const targets = target.team.members.filter((each) => each.isAlive);

    for (let i = 0; i < 4; i++) {
      for (const eachTarget of targets) {
        const isCrit = battle.randomDecider.prdDecider(source, source.properties.critRate.battleValue);
        const damage = Math.round(
          source.properties.atk.battleValue *
            (isCrit ? source.properties.critMultiplier.battleValue : 1) *
            ratio *
            battle.randomGenerator.getRandomFloat(),
        );

        await battle.eventCenter.trigger(source, { eventType: 'Damaging', source, target: eachTarget, damage, isCrit });
      }
    }
  }

  //砂风甘霖术
  @DefineSkill('S00009')
  async skill00009(skillData: SkillData, source: CharacterBattle, target: CharacterBattle): Promise<void> {
    const battle = source.battle;
    const ratio = skillData.ratio;
    const targets = target.team.members.filter((each) => each.isAlive);

    for (const eachTarget of targets) {
      const isCrit = battle.randomDecider.prdDecider(source, source.properties.critRate.battleValue);
      const damage = Math.round(
        source.properties.atk.battleValue *
          (isCrit ? source.properties.critMultiplier.battleValue : 1) *
          ratio *
          battle.randomGenerator.getRandomFloat(),
      );

      await battle.eventCenter.trigger(source, { eventType: 'Treating', source, target: eachTarget, damage, isCrit });
    }
  }

  //刺针扫射
  @DefineSkill('S00010')
  async skill00010(skillData: SkillData, source: CharacterBattle, target: CharacterBattle): Promise<void> {
    const battle = source.battle;
    const ratio = skillData.ratio;
    const targets = target.team.members.filter((each) => each.isAlive);

    for (const eachTarget of targets) {
      const isCrit = battle.randomDecider.prdDecider(source, source.properties.critRate.battleValue);
      const damage = Math.round(
        source.properties.atk.battleValue *
          (isCrit ? source.properties.critMultiplier.battleValue : 1) *
          ratio *
          battle.randomGenerator.getRandomFloat(),
      );

      await battle.eventCenter.trigger(source, { eventType: 'Damaging', source, target: eachTarget, damage, isCrit });
    }
  }
}
