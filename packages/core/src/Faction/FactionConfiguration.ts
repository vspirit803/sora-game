import { TeamConfiguration } from '@core/Team';

/**
 * 阵营(配置)
 */

export interface FactionConfiguration {
  name: string;
  teams: Array<TeamConfiguration>;
}
