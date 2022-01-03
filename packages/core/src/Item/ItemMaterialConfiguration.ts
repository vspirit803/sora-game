import { ItemConfiguration } from './ItemConfiguration';
import { Material } from './ItemType';

/**
 * 材料配置接口
 */
export interface ItemMaterialConfiguration extends ItemConfiguration {
  isStackable: boolean;
  type: typeof Material;
}
