/*
 * @Author: vspirit803
 * @Date: 2020-09-25 10:41:28
 * @Description:
 * @LastEditTime: 2021-06-11 17:15:35
 * @LastEditors: vspirit803
 */
import { Buff, PropertyBuffItem } from '@core/Buff';
import { Condition, ConditionItem, Or } from '@core/Condition';
import { EventDataDamaged } from '@core/Event';
import { TeamNormal } from '@core/Team';

import { Battle } from './Battle';
import { BattleConfiguration } from './BattleConfiguration';

/**
 * 战斗中心
 */
export class BattleCenter {
  private static instance: BattleCenter;
  static getInstance(): BattleCenter {
    if (!BattleCenter.instance) {
      BattleCenter.instance = new BattleCenter();
    }
    return BattleCenter.instance;
  }

  battles: Array<BattleConfiguration>;
  battlesMap: Map<string, BattleConfiguration>;
  currBattle?: Battle;

  private constructor() {
    this.battles = [];
    this.battlesMap = new Map<string, BattleConfiguration>();
  }

  /**
   * 载入战斗配置
   * @param battles 战斗配置数组
   */
  loadConfiguration(battles: Array<BattleConfiguration>): void {
    for (const eachBattle of battles) {
      this.battles.push(eachBattle);
      this.battlesMap.set(eachBattle.id, eachBattle);
    }
  }

  generateBattle(id: string, team: TeamNormal): Battle {
    if (this.currBattle) {
      this.currBattle.end();
      this.currBattle.cancelAllListeners();
    }

    const battleConfiguration = this.battlesMap.get(id);
    if (battleConfiguration === undefined) {
      throw new Error(`id为[${id}]的战斗配置不存在`);
    }

    const conditionItemKillJCYY: ConditionItem<Battle> = new ConditionItem<Battle>({
      testFunction: (battle: Battle): boolean => {
        return !(battle.characters.find((eachCharacter) => eachCharacter.id === 'Enemy0001')?.isAlive ?? true);
      },
      description: '击杀[今川义元]',
    });
    const conditionItemKillAll: ConditionItem<Battle> = new ConditionItem<Battle>({
      testFunction: (battle: Battle): boolean => {
        return !battle.factions
          .filter((eachFaction) => eachFaction !== battle.factions[0])
          .some((eachFaction) => eachFaction.isAlive);
      },
      description: '击杀所有敌人',
    });

    const conditionItemNobuAlive: ConditionItem<Battle> = new ConditionItem<Battle>({
      testFunction: (battle: Battle): boolean => {
        return battle.characters.find((eachCharacter) => eachCharacter.id === 'C0001')?.isAlive ?? true;
      },
      description: '[织田信长]存活',
    });

    const conditionItemRound5: ConditionItem<Battle> = new ConditionItem<Battle>({
      testFunction: (battle: Battle): boolean => {
        return battle.battleActionQueue.roundCount > 5;
      },
      description: '坚持5个回合',
    });

    const successCondition = new Condition({
      logicOperator: Or,
      conditionItems: [
        conditionItemKillJCYY,
        conditionItemKillAll,
        // new Condition({
        //     logicOperator: LogicOperator.And,
        //     conditionItems: [conditionItemNobuAlive, conditionItemRound5],
        // }),
      ],
    });

    const battle = new Battle(battleConfiguration, team, successCondition);
    conditionItemKillJCYY.setTestInstance(battle);
    conditionItemKillAll.setTestInstance(battle);
    conditionItemNobuAlive.setTestInstance(battle);
    conditionItemRound5.setTestInstance(battle);

    const 弓兵 = battle.characters.find((each) => each.id === 'Enemy0002');

    if (弓兵) {
      弓兵.team.members.forEach((eachMember) => {
        battle.eventCenter.listen({
          eventType: 'Damaged',
          priority: 3,
          filter: eachMember,
          callback: async (eventData: EventDataDamaged) => {
            if (eventData.isConductive) {
              return;
            }

            const 分摊目标 = eachMember.team.members.filter((each) => each.isAlive);
            const number = 分摊目标.length;
            const damage = eventData.damage / number;
            eventData.damage = damage;
            eventData.isConductive = true;

            for (const each of 分摊目标) {
              if (each !== eachMember) {
                await battle.eventCenter.trigger(each, {
                  ...eventData,
                  target: each,
                  eventType: 'Damaged',
                });
              }
            }
          },
        });
      });
    }

    const 风樱雪 = battle.characters.find((each) => each.id === 'C0001');

    if (风樱雪) {
      battle.eventCenter.listen({
        eventType: 'Damaged',
        priority: 1.9,
        filter: 风樱雪,
        callback: async () => {
          const buff = new Buff({
            id: 'Buff1001',
            name: '越战越勇',
            source: 风樱雪,
            target: 风樱雪,
            duration: 'forever',
            visible: false,
            properties: [{ name: 'atk', percent: 25, value: 0 }],
            maxOverlayTimes: 4,
          });

          buff.start();
        },
      });
    }

    this.currBattle = battle;
    return battle;
  }
}
