import { EProficiencies } from 'src/common/enums/proficiencies.enum';

export class CharacterClassProgressionTableDto {
  id: string;
  class: string;
  level: number;
  skillFeat: boolean;
  classFeat: boolean;
  generalFeat: boolean;
  ancestryFeat: boolean;
  abilityBoost: boolean;
  featGranted: string[];
  skillIncrease: boolean;
  maxSkillLevel: EProficiencies;
  classIncrease: boolean;
  classDC: EProficiencies;
}
