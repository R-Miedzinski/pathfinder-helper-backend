import { EProficiencies } from 'src/common/enums/proficiencies.enum';

export class CreateCharacterClassProgressionTableDto {
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
