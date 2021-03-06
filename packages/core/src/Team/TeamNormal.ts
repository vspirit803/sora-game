/*
 * @Author: vspirit803
 * @Date: 2020-09-24 08:41:10
 * @Description:
 * @LastEditTime: 2021-04-15 13:52:10
 * @LastEditors: vspirit803
 */
import { CharacterNormal } from '@core/Character';
import { MAX_TEAM_MEMBERS_NUM, UUID } from '@core/Common';
import { Game } from '@core/Game';
import { ObjectId } from 'bson';

import { TeamConfiguration } from './TeamConfiguration';

/**
 * 队伍(平常状态)
 */
export class TeamNormal implements UUID {
  /**队伍名称 */
  name: string;
  /**队伍id */
  uuid: string;
  /**队伍成员 */
  members: Array<CharacterNormal>;

  constructor(data: Array<CharacterNormal>);
  constructor(data: TeamConfiguration);
  constructor(data: TeamConfiguration | Array<CharacterNormal>) {
    this.uuid = new ObjectId().toHexString();
    if (Array.isArray(data)) {
      this.name = '玩家队伍';
      this.members = data;
      return;
    }
    this.name = data.name;
    this.members = data.members.map((eachMember) => {
      let character;
      if ('properties' in eachMember) {
        //配置
        character = new CharacterNormal(eachMember);
      } else {
        //id
        character = Game.getInstance().characterCenter.getCharacter(eachMember.id);
      }

      if (eachMember.level) {
        character.level = eachMember.level;
      }
      return character;
    });
  }

  includes(id: string): boolean {
    return this.members.map((each) => each.id).includes(id);
  }

  addMember(member: CharacterNormal): void {
    if (this.members.includes(member)) {
      throw new Error(`[${member.id}]${member.name}已在队伍中`);
    }

    if (this.members.length >= MAX_TEAM_MEMBERS_NUM) {
      throw new Error(`队伍成员数已达上限(${MAX_TEAM_MEMBERS_NUM})`);
    }

    this.members.push(member);
  }

  removeMember(member: CharacterNormal): void {
    if (!this.members.includes(member)) {
      throw new Error(`[${member.id}]${member.name}不在队伍中`);
    }

    this.members.splice(this.members.indexOf(member), 1);
  }

  swapMember(memberA: CharacterNormal, memberB: CharacterNormal): void {
    if (!this.members.includes(memberA)) {
      throw new Error(`[${memberA.id}]${memberA.name}不在队伍中`);
    }

    if (!this.members.includes(memberB)) {
      throw new Error(`[${memberB.id}]${memberB.name}不在队伍中`);
    }

    const indexA = this.members.indexOf(memberA);
    const indexB = this.members.indexOf(memberB);
    this.members.splice(indexA, 1, memberB);
    this.members.splice(indexB, 1, memberA);
  }

  replaceMember(memberBefore: CharacterNormal, memberAfter: CharacterNormal): void {
    if (!this.members.includes(memberBefore)) {
      throw new Error(`[${memberBefore.id}]${memberBefore.name}不在队伍中`);
    }

    if (this.members.includes(memberAfter)) {
      this.swapMember(memberBefore, memberAfter);
      return;
    }

    this.members.splice(this.members.indexOf(memberBefore), 1, memberAfter);
  }
}
