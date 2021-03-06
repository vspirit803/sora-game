import { UUID } from '@core/Common';

/**
 * 角色存档
 */
export interface CharacterSave extends UUID {
  uuid: string;
  id: string;
  level: number;
  name?: string;
}
