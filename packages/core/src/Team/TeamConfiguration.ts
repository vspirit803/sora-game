import { CharacterConfiguration } from '@core/Character';

/**
 * 队伍(配置)
 */
export interface TeamConfiguration {
  name: string;
  members: Array<({ id: string } | CharacterConfiguration) & { level?: number }>;
}
