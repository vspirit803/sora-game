/*
 * @Author: vspirit803
 * @Date: 2020-09-24 08:41:10
 * @Description: 队伍中心 单例模式
 * @LastEditTime: 2020-09-24 09:30:36
 * @LastEditors: vspirit803
 */
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
}
