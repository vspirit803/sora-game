/*
 * @Author: vspirit803
 * @Date: 2020-09-23 16:57:06
 * @Description:
 * @LastEditTime: 2021-06-30 18:05:45
 * @LastEditors: vspirit803
 */
import { UUID } from '@core/Common';
import { ItemEquipment } from '@core/Item';
import { ItemEquipmentSlot } from '@core/Item/ItemEquipmentSlot';
import { SkillNormal } from '@core/Skill';
import { ObjectId } from 'bson';

import { CharacterCenter } from './CharacterCenter';
import { CharacterConfiguration } from './CharacterConfiguration';
import { CharacterPropertyNormal } from './CharacterPropertyNormal';
import { CharacterPropertyType } from './CharacterPropertyType';
import { CharacterSave } from './CharacterSave';

function isCharacterSave(character: CharacterConfiguration | CharacterSave): character is CharacterSave {
  return 'uuid' in character;
}

/**
 * 角色类(平常状态)
 */
export class CharacterNormal implements UUID {
  uuid: string;
  id: string;
  name: string;
  level: number;
  properties: { [propName in CharacterPropertyType]: CharacterPropertyNormal };
  skills: Array<SkillNormal>;
  equipments: Array<ItemEquipmentSlot>;

  constructor(characterConfiguration: CharacterConfiguration);
  constructor(characterSave: CharacterSave);
  constructor(character: CharacterConfiguration | CharacterSave) {
    let characterConfiguration: CharacterConfiguration;
    if (isCharacterSave(character)) {
      characterConfiguration = CharacterCenter.getInstance().charactersConfigurationMap.get(character.id)!;
    } else {
      characterConfiguration = character;
    }

    this.uuid = new ObjectId().toHexString();
    this.id = character.id;
    this.name = character.name ?? characterConfiguration.name;
    this.level = isCharacterSave(character) ? character.level : 0;

    const properties: { [propName in CharacterPropertyType]?: CharacterPropertyNormal } = {};
    for (const eachPropName in characterConfiguration.properties) {
      const eachProperty = characterConfiguration.properties[eachPropName as CharacterPropertyType];
      properties[eachPropName as CharacterPropertyType] = new CharacterPropertyNormal({
        character: this,
        property: eachProperty,
      });
    }
    this.properties = properties as { [propName in CharacterPropertyType]: CharacterPropertyNormal };

    // this.skills = characterConfiguration.skills.map((eachId) => SkillFactory.getSkill(eachId));
    this.skills = characterConfiguration.skills.map((eachId) => new SkillNormal({ owner: this, id: eachId }));
    this.equipments = [];

    this.equipments.push(new ItemEquipmentSlot({ name: '武器', availableEquipmentTypes: ['Weapon'] }));
  }

  putOnEquipment(slot: ItemEquipmentSlot, equipment: ItemEquipment): void {
    if (!slot.availableEquipmentTypes.includes(equipment.equipmentType)) {
      throw new Error(
        `try to put on Equipment[${equipment.equipmentType}] to Slot[${Array.from(slot.availableEquipmentTypes).join(
          ',',
        )}]`,
      );
    }

    this.takeOffEquipment(slot);
    slot.equipment = equipment;
    equipment.setWearer(this);

    for (const [eachPropName, eachProperty] of Object.entries(equipment.properties)) {
      console.log(eachPropName, eachProperty);
      this.properties[eachPropName as CharacterPropertyType].equipmentValue += eachProperty!.value;
    }
  }

  takeOffEquipment(slot: ItemEquipmentSlot): void {
    if (!slot.equipment) {
      return;
    }

    const equipment = slot.equipment;
    equipment.setWearer(undefined);
    for (const [eachPropName, eachProperty] of Object.entries(equipment.properties)) {
      this.properties[eachPropName as CharacterPropertyType].equipmentValue -= eachProperty!.value;
    }
  }
}
