/*
 * @Author: vspirit803
 * @Date: 2021-10-27 14:08:06
 * @Description:
 * @LastEditTime: 2021-11-01 17:06:30
 * @LastEditors: vspirit803
 */
import { Game } from 'sora-game-core';
import { reactive } from 'vue';

export function useGame(): Game {
  return reactive(Game.getInstance());
}
