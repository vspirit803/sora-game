/*
 * @Author: vspirit803
 * @Date: 2021-05-20 15:11:14
 * @Description:
 * @LastEditTime: 2021-06-07 16:54:16
 * @LastEditors: vspirit803
 */
import { TeamConfiguration } from '@core/Team';

/**
 * 阵营(配置)
 */

export interface FactionConfiguration {
  name: string;
  teams: Array<TeamConfiguration>;
  familyPattern: string;
}
