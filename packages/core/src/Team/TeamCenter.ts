/*
 * @Author: vspirit803
 * @Date: 2020-09-24 08:41:10
 * @Description: 队伍中心 单例模式
 * @LastEditTime: 2021-04-21 16:37:01
 * @LastEditors: vspirit803
 */
import { MAX_TEAMS_NUM } from '@core/Common';
import { SaveInterface } from '@core/Game';

import { TeamNormal } from './TeamNormal';
import { TeamSave } from './TeamSave';

/**
 * 队伍中心
 */
export class TeamCenter implements SaveInterface<Array<TeamSave>> {
  private static instance: TeamCenter;
  static getInstance(): TeamCenter {
    if (!TeamCenter.instance) {
      TeamCenter.instance = new TeamCenter();
    }
    return TeamCenter.instance;
  }

  teams: Array<TeamNormal>;

  private constructor() {
    this.teams = [];
  }

  /**载入存档 */
  loadSave(saveData: Array<TeamSave>): void {
    this.teams = [];
    for (const eachTeam of saveData) {
      const memberIds = eachTeam.members.map((eachMember) => ({
        id: eachMember,
      }));
      const team = new TeamNormal({ name: eachTeam.name, members: memberIds });
      this.teams.push(team);
    }
  }

  /**生成存档 */
  generateSave(): Array<TeamSave> {
    return this.teams.map((eachTeam) => ({
      name: eachTeam.name,
      members: eachTeam.members.map((eachMember) => eachMember.id),
    }));
  }

  canAddTeam(): boolean {
    return this.teams.length < MAX_TEAMS_NUM;
  }

  newTeam(): void {
    if (this.teams.length >= MAX_TEAMS_NUM) {
      return;
    }

    this.teams.push(new TeamNormal({ name: `Team ${this.teams.length.toString().padStart(2, '0')}`, members: [] }));
  }

  removeTeam(team: TeamNormal): void {
    this.teams.splice(this.teams.indexOf(team), 1);
  }
}
