/*
 * @Author: vspirit803
 * @Date: 2020-09-25 10:41:07
 * @Description:
 * @LastEditTime: 2021-04-14 14:40:22
 * @LastEditors: vspirit803
 */
import { Battle } from '@core/Battle';
import { CharacterBattle } from '@core/Character';
import { TeamBattle, TeamNormal } from '@core/Team';

import { FactionConfiguration } from './FactionConfiguration';

/**
 * 阵营(战斗状态)
 */
export class FactionBattle {
  teams: Array<TeamBattle>;
  name: string;
  /**阵营所处的战斗 */
  battle: Battle;
  constructor(factionConfiguration: FactionConfiguration, battle: Battle) {
    this.name = factionConfiguration.name;
    this.battle = battle;

    this.teams = [];
    this.addTeams(
      ...factionConfiguration.teams.map(
        (eachTeamConfiguration) => new TeamBattle(new TeamNormal(eachTeamConfiguration), this),
      ),
    );
  }

  /** 阵营是否"存活",只要阵营至少有一队伍存活,则阵营存活 */
  get isAlive(): boolean {
    return this.teams.some((eachTeam) => eachTeam.isAlive);
  }

  get characters(): Array<CharacterBattle> {
    return this.teams
      .map((eachTeam) => {
        return eachTeam.members;
      })
      .reduce((prev, curr) => {
        return [...prev, ...curr];
      });
  }

  addTeams(...teams: Array<TeamBattle>): void {
    teams.forEach((eachTeam) => {
      this.teams.push(eachTeam);
    });
  }

  /**
   * 设置玩家队伍
   * @param team 玩家的队伍
   */
  setPlayerTeam(team: TeamBattle): void {
    this.teams[0] = team;
  }
}
