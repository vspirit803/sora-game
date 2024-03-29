import { Battle } from '@core/Battle';
import { Buff, SILENCE, Status, StatusBuffItem, STUNNED } from '@core/Buff';
import { UUID } from '@core/Common';
import {
  EventDataActionEnd,
  EventDataAttacked,
  EventDataAttacking,
  EventDataDamaged,
  EventDataDamaging,
  EventDataKilled,
  EventDataKilling,
  EventDataSkillSelect,
  EventDataTreated,
  EventDataTreating,
  Listen,
  Listener,
  RemoveAllListeners,
} from '@core/Event';
import { FactionBattle } from '@core/Faction';
import { SkillBattle } from '@core/Skill';
import { TeamBattle } from '@core/Team';
import { RandomGenerator } from '@core/Utils';
import { ObjectId } from 'bson';

import { CharacterCenter } from './CharacterCenter';
import { CharacterNormal } from './CharacterNormal';
import { CharacterPropertyBattle } from './CharacterPropertyBattle';
import { CharacterPropertyType } from './CharacterPropertyType';

/**
 * 角色类(战斗状态)
 */
@Listener()
export class CharacterBattle extends CharacterNormal implements UUID {
  uuid: string;
  id: string;
  name: string;
  level: number;
  /**角色所处的队伍 */
  team: TeamBattle;
  /**角色所处的阵营 */
  faction: FactionBattle;
  /**角色所处的战斗 */
  battle: Battle;
  /**角色的属性(战斗模式) */
  properties: { [propName in CharacterPropertyType]: CharacterPropertyBattle };
  /**当前血量 */
  currHp: number;
  /**是否存活 */
  isAlive: boolean;
  /**基本战斗事件订阅者 */
  baseBattleEventSubscribers: { [eventName: string]: any };
  /**状态数组 */
  buffs: Array<Buff>;

  skills: Array<SkillBattle>;

  constructor(character: CharacterNormal, team: TeamBattle) {
    super(CharacterCenter.getInstance().charactersConfigurationMap.get(character.id)!);
    this.id = character.id;
    this.name = character.name;
    this.level = character.level;
    this.uuid = character.uuid;
    this.uuid = new ObjectId().toHexString();

    this.team = team;
    this.faction = team.faction;
    this.battle = team.battle;

    this.skills = character.skills.map(
      (eachSkill) => new SkillBattle({ owner: this, id: eachSkill.id, level: eachSkill.level }),
    );

    const properties: { [propName in CharacterPropertyType]?: CharacterPropertyBattle } = {};
    for (const eachPropName in character.properties) {
      const eachProperty = character.properties[eachPropName as CharacterPropertyType];
      properties[eachPropName as CharacterPropertyType] = new CharacterPropertyBattle({
        character: this,
        property: eachProperty,
      });
    }
    this.properties = properties as { [propName in CharacterPropertyType]: CharacterPropertyBattle };
    this.currHp = this.properties.hp.battleValue;
    this.isAlive = true;
    this.baseBattleEventSubscribers = {};
    this.buffs = [];
  }

  /**是否玩家操控角色 */
  get isPlayerControl(): boolean {
    return this.faction === this.battle?.factions[0];
  }

  @Listen<EventDataAttacking>({ eventType: 'Attacking', priority: 2 })
  async onAttacking(data: EventDataAttacking): Promise<void> {
    const target = data.target;
    // console.log(`[${this.name}]🗡️[${target.name}]`);
    await this.battle.eventCenter.trigger(this, {
      eventType: 'Attacked',
      source: this,
      target,
    });
  }

  @Listen<EventDataAttacked>({ eventType: 'Attacked', priority: 2 })
  async onAttacked(data: EventDataAttacked): Promise<void> {
    const attackSource: CharacterBattle = data.source;
    const target = data.target;
    const damage = Math.round(attackSource.properties.atk.battleValue) - target.properties.def.battleValue;
    const newHp = target.currHp > damage ? target.currHp - damage : 0;
    // console.log(`[${target.name}]💔${damage} -> ${newHp}/${target.properties.hp.battleValue}`);
    target.currHp = newHp;
    if (target.currHp <= 0) {
      target.currHp = 0;
      await target.battle.eventCenter.trigger(target, {
        eventType: 'Killed',
        source: attackSource,
        target,
      });
    }
  }

  @Listen<EventDataDamaging>({ eventType: 'Damaging', priority: 2 })
  async onDamaging(data: EventDataDamaging): Promise<void> {
    const target = data.target;
    await target.battle.eventCenter.trigger(target, {
      ...data,
      eventType: 'Damaged',
    });
  }

  @Listen<EventDataDamaged>({ eventType: 'Damaged', priority: 2 })
  async onDamaged(data: EventDataDamaged): Promise<void> {
    const source = data.source;
    const target = data.target;
    const damage = data.damage;
    /**计算减伤和保底后的伤害 */
    const finalDamage = Math.round(
      Math.max(0.1 * source.properties.atk.battleValue, damage - target.properties.def.battleValue),
    );
    const actualDamage = Math.min(target.currHp, finalDamage); //真正造成的伤害
    const overflowDamage = finalDamage - actualDamage; //溢出伤害
    const newHp = target.currHp - actualDamage;
    // console.log(`[${target.name}]💔${actualDamage} -> ${newHp}/${target.properties.hp.battleValue}`);
    data.actualDamage = actualDamage;
    data.finalDamage = finalDamage;
    data.overflowDamage = overflowDamage;
    target.currHp = newHp;
    if (target.currHp <= 0) {
      target.currHp = 0;
      await target.battle.eventCenter.trigger(target, { ...data, eventType: 'Killed' });
    }
  }

  @Listen<EventDataTreating>({ eventType: 'Treating', priority: 2 })
  async onTreating(data: EventDataTreating): Promise<void> {
    const target = data.target;
    await target.battle.eventCenter.trigger(target, {
      ...data,
      eventType: 'Treated',
    });
  }

  @Listen<EventDataTreated>({ eventType: 'Treated', priority: 2 })
  async onTreated(data: EventDataTreated): Promise<void> {
    const target = data.target;
    const damage = data.damage;
    /**计算减伤和保底后的治疗 */
    const finalDamage = Math.round(Math.max(20, damage));
    const actualDamage = Math.min(target.properties.hp.battleValue - target.currHp, finalDamage); //真正造成的治疗
    const overflowDamage = finalDamage - actualDamage; //溢出治疗
    const newHp = target.currHp + actualDamage;
    // console.log(`[${target.name}]♥${actualDamage} -> ${newHp}/${target.properties.hp.battleValue}`);
    data.actualDamage = actualDamage;
    data.finalDamage = finalDamage;
    data.overflowDamage = overflowDamage;
    target.currHp = newHp;
  }

  @Listen<EventDataKilling>({ eventType: 'Killing', priority: 2 })
  async onKilling(data: EventDataKilling): Promise<void> {
    const target = data.target;
    // console.log(`[${this.name}]🗡️☠[${target.name}]`);
  }

  @Listen<EventDataKilled>({ eventType: 'Killed', priority: 2 })
  async onKilled(data: EventDataKilled): Promise<void> {
    const killSource = data.source;
    // console.log(`[${this.name}]☠`);
    await this.battle.eventCenter.trigger(killSource, { eventType: 'Killing', source: killSource, target: this });

    if (this.isAlive) {
      this.isAlive = false;
      this.battle.eventCenter.listen({
        eventType: 'ActionEnd',
        once: true,
        callback: async () => {
          while (this.buffs.length) {
            const eachStatus = this.buffs.pop()!;
            eachStatus.destroy();
          }
          this.unSubscribeBaseBattleEvent();
        },
      });
    }

    // while (this.buffs.length) {
    //   const eachStatus = this.buffs.pop()!;
    //   eachStatus.destroy();
    // }
    // this.unSubscribeBaseBattleEvent();
  }

  @Listen<EventDataActionEnd>({ eventType: 'ActionEnd', priority: 2 })
  async onActionEnd(data: EventDataActionEnd): Promise<void> {
    const character = data.source;
    character.skills.forEach((eachSkill) => {
      if (eachSkill.currCooldown !== 0) {
        eachSkill.currCooldown--;
      }
    });
  }

  /**移除订阅基本的战斗事件 */
  @RemoveAllListeners
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  unSubscribeBaseBattleEvent(): void {}

  async action(): Promise<void> {
    // console.log(`轮到${this.name}行动了`);

    const availableSkills = this.skills.filter((each) => each.type !== 'passive');
    let skill = this.randomGenerator.selectOneRandomly(availableSkills);
    const availableTargets = skill.getTargets();
    let target = this.randomGenerator.selectOneRandomly(availableTargets);

    if (this.isStunned()) {
      // console.log(`${this.name}处于眩晕状态,跳过回合`);
      await this.battle.eventCenter.trigger(this, { eventType: 'ActionEnd', source: this });
      return;
    }

    if (this.isPlayerControl && this.battle.autoMode) {
      if (skill.isAttack && this.battle.fireTarget && availableTargets.includes(this.battle.fireTarget)) {
        target = this.battle.fireTarget;
      } else if (skill.isTreat && this.battle.protectTarget && availableTargets.includes(this.battle.protectTarget)) {
        target = this.battle.protectTarget;
      }
    }

    if (!this.battle.autoMode && this.isPlayerControl) {
      const skillSelectData: EventDataSkillSelect = {
        eventType: 'SkillSelect',
        source: this,
        availableSkills,
        availableTargets,
        selectedSkill: undefined,
        selectedTarget: undefined,
      };

      await this.battle.eventCenter.trigger(this, skillSelectData);
      const { selectedSkill, selectedTarget } = skillSelectData;
      if (skill.currCooldown !== 0) {
        throw new Error(`技能[${skill.id} ${skill.name}]处于冷却中,不能选择`);
      }
      target = selectedTarget ?? target;
      skill = selectedSkill ?? skill;
    }

    await skill.trigger(target);
    await this.battle.eventCenter.trigger(this, { eventType: 'ActionEnd', source: this });
  }

  get enemies(): Array<CharacterBattle> {
    return this.battle.characters.filter((eachCharacter) => eachCharacter.faction !== this.faction);
  }

  get teammates(): Array<CharacterBattle> {
    return this.team.members.filter((each) => each !== this);
  }

  get randomGenerator(): RandomGenerator {
    return this.battle.randomGenerator;
  }

  isInStatus(status: Status): boolean {
    return this.buffs.some((each) =>
      each.buffItems.some((each) => each instanceof StatusBuffItem && each.status & status),
    );
  }

  isStunned(): boolean {
    return this.isInStatus(STUNNED);
  }

  isSilence(): boolean {
    return this.isInStatus(SILENCE);
  }
}
