/*
 * @Author: vspirit803
 * @Date: 2020-09-24 08:41:10
 * @LastEditTime: 2021-04-13 11:42:55
 * @LastEditors: vspirit803
 * @Description:
 */

// import { BattleCenter } from '@core/Battle';
import packageJson from '@core/../package.json';
import { BattleCenter } from '@core/Battle';
import { CharacterCenter } from '@core/Character';
import { ItemCenter } from '@core/Item';
import { SkillCenter } from '@core/Skill';
// import { MapCenter } from '@core/Map';
// import { SkillFactory } from '@core/Skill';
// import { TaskCenter } from '@core/Task';
import { TeamCenter } from '@core/Team';
import { RandomDecider, RandomGenerator, RandomUtil } from '@core/Utils';

import { GameSave } from './GameSave';

/**
 * 游戏的实例
 */
export class Game {
  static instence: Game;
  static getInstence(): Game {
    if (!Game.instence) {
      Game.instence = new Game();
    }
    return Game.instence;
  }

  /**角色中心 */
  characterCenter: CharacterCenter;
  // /**任务中心  */
  // taskCenter: TaskCenter;
  /**背包 */
  backpack: ItemCenter;
  /**战斗中心 */
  battleCenter: BattleCenter;
  // /**地图中心 */
  // mapCenter: MapCenter;
  /**队伍中心 */
  teamCenter: TeamCenter;
  /**技能中心 */
  skillCenter: SkillCenter;

  randomGenerator: RandomGenerator;
  randomDecider: RandomDecider;

  private constructor() {
    this.characterCenter = CharacterCenter.getInstence();
    this.teamCenter = TeamCenter.getInstence();
    this.backpack = ItemCenter.getInstence();
    this.battleCenter = BattleCenter.getInstence();
    this.skillCenter = SkillCenter.getInstence();

    this.randomGenerator = RandomUtil.getRandomGenerator();
    this.randomDecider = RandomUtil.getRandomDecider(this.randomGenerator);
  }

  /**
   * 载入存档
   * @param gameSave 存档数据
   */
  loadSave(gameSave: GameSave): void {
    this.characterCenter.loadSave(gameSave.characters);
    this.backpack.loadSave(gameSave.backpack);
    // Game.mapCenter.loadSave(gameSave.maps);
    this.teamCenter.loadSave(gameSave.teams);
  }

  generateSave(): GameSave {
    return {
      version: packageJson.version,
      characters: this.characterCenter.generateSave(),
      backpack: this.backpack.generateSave(),
      // maps: Game.mapCenter.generateSave(),
      teams: this.teamCenter.generateSave(),
    };
  }
}
