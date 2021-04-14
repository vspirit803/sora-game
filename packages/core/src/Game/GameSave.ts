/*
 * @Author: vspirit803
 * @Date: 2020-09-23 17:32:35
 * @Description:
 * @LastEditTime: 2020-09-24 14:13:04
 * @LastEditors: vspirit803
 */
import { CharacterSave } from '@core/Character';
import { BackpackSave } from '@core/Item';
// import { MapSave } from '@core/Map';
import { TeamSave } from '@core/Team';

/**
 * 游戏存档
 */
export interface GameSave {
  /**存档版本 */
  version: string;
  /**角色存档 */
  characters: Array<CharacterSave>;
  /**背包存档 */
  backpack: BackpackSave;
  // /**地图存档 */
  // maps: MapSave;
  /**队伍 */
  teams: Array<TeamSave>;
}
