/*
 * @Author: vspirit803
 * @Date: 2020-09-25 10:40:51
 * @Description:
 * @LastEditTime: 2021-06-21 17:02:42
 * @LastEditors: vspirit803
 */
import { BattleActionQueueBase, BattleActionQueueMHXY } from '@core/BattleActionQueue';
import { CharacterBattle } from '@core/Character';
import { UUID } from '@core/Common';
import { Condition } from '@core/Condition';
import { EventCenter } from '@core/Event';
import { FactionBattle } from '@core/Faction';
import { TeamBattle, TeamNormal } from '@core/Team';
import { RandomDecider, RandomGenerator, RandomUtil } from '@core/Utils';
import { ObjectId } from 'bson';

import { BattleConfiguration } from './BattleConfiguration';

/**
 * 战斗(战斗状态)
 */
export class Battle implements UUID {
  uuid: string;
  name: string;
  /**
   * 阵营,每个阵营都是互为敌人
   * 玩家所在的队伍固定为factions[0]的teams[0]
   */
  factions: Array<FactionBattle>;
  eventCenter: EventCenter;
  successCondition: Condition;
  battleActionQueue: BattleActionQueueBase;
  endFlag: boolean;
  randomGenerator: RandomGenerator;
  randomDecider: RandomDecider;

  /**
   * 自动模式
   */
  autoMode: boolean;
  /**集火目标 */
  fireTarget?: CharacterBattle;
  /**守护目标 */
  protectTarget?: CharacterBattle;

  setFireTarget(fireTarget: CharacterBattle): void {
    this.fireTarget = fireTarget;
  }

  setProtectTarget(protectTarget: CharacterBattle): void {
    this.protectTarget = protectTarget;
  }

  constructor(
    battleConfiguration: BattleConfiguration,
    playerTeam: TeamNormal,
    successCondition?: Condition,
    seed?: string,
  ) {
    this.uuid = new ObjectId().toHexString();
    this.name = battleConfiguration.name ?? '未留下名字的战斗';
    this.eventCenter = new EventCenter();
    this.successCondition = successCondition ?? new Condition();
    this.autoMode = false;
    this.endFlag = false;
    this.factions = battleConfiguration.factions.map(
      (eachFactionConfiguration) => new FactionBattle(eachFactionConfiguration, this),
    );
    this.factions[0].setPlayerTeam(new TeamBattle(playerTeam, this.factions[0]));
    this.battleActionQueue = new BattleActionQueueMHXY(this);

    this.randomGenerator = RandomUtil.getRandomGenerator(seed);
    this.randomDecider = RandomUtil.getRandomDecider(this.randomGenerator);
  }

  get characters(): Array<CharacterBattle> {
    return this.factions.flatMap((eachFaction) => eachFaction.characters);
  }

  async start(): Promise<boolean> {
    let result = false;
    await this.eventCenter.trigger(this, { eventType: 'BattleStart' });

    while (!this.endFlag) {
      const character = this.battleActionQueue.getNext();
      this.eventCenter.trigger(character, { eventType: 'ActionStart', source: character });

      await character.action();

      if (this.successCondition.isCompleted) {
        await this.eventCenter.trigger(this, {
          eventType: 'BattleSuccess',
          battle: this,
          round: this.battleActionQueue.roundCount,
          killed: this.characters
            .filter((eachCharacter) => eachCharacter.faction !== this.factions[0])
            .filter((eachCharacter) => !eachCharacter.isAlive),
        });
        result = true;
        break;
      }

      if (!this.factions[0].isAlive) {
        //所有友军死亡
        console.log('输了');
        break;
      }
    }

    this.cancelAllListeners();
    return result;
  }

  end(): void {
    this.endFlag = true;
  }

  cancelAllListeners(): void {
    this.characters.forEach((each) => each.unSubscribeBaseBattleEvent());
    this.eventCenter.listeners.forEach((eachListener) => this.eventCenter.cancelListen(eachListener));
  }
}
