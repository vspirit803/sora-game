/*
 * @Author: vspirit803
 * @Date: 2020-09-25 10:41:07
 * @Description:
 * @LastEditTime: 2021-06-07 17:04:09
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
  familyPattern: string;
  /**阵营所处的战斗 */
  battle: Battle;
  constructor(factionConfiguration: FactionConfiguration, battle: Battle) {
    this.battle = battle;
    this.name = factionConfiguration.name;
    this.familyPattern = factionConfiguration.familyPattern;

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
    return this.teams.flatMap((eachTeam) => eachTeam.members);
  }

  get hasMultipleTeams(): boolean {
    return this.teams.length > 1;
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
