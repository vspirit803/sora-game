/*
 * @Author: vspirit803
 * @Date: 2020-09-23 16:54:06
 * @Description:
 * @LastEditTime: 2020-09-27 13:52:20
 * @LastEditors: vspirit803
 */

import { battles, characters, items, sav001, skills } from 'sora-game-assets';

import { Game } from './Game';
import { ItemConfigurations } from './Item';
import { SkillConfiguration } from './Skill';

const game = Game.getInstance();
//加载配置
game.skillCenter.loadConfiguration(skills as Array<SkillConfiguration>);
game.backpack.loadConfigurations(items as ItemConfigurations);
game.characterCenter.loadConfiguration(characters);
game.battleCenter.loadConfiguration(battles);

//载入存档
game.loadSave(sav001);

const team = game.teamCenter.teams[0];
const battle = game.battleCenter.generateBattle('Battle00001', team);
battle.autoMode = true;
const promise = battle.start();

console.log('hello world');
promise.then(() => {
  console.log('battle end');
});
