import { EAbilities } from 'src/common/enums/abilities.enum';
import { EProficiencies } from 'src/common/enums/proficiencies.enum';
import { ESavingThrows } from 'src/common/enums/saving-throws.enum';
import { ESkills } from 'src/common/enums/skills.enum';
import { CreateCharacterClassProgressionTableDto } from './create-character-class-progression-table.dto';

export class CreateCharacterClassDto {
  name: string;
  description: string;
  hitPoints: number;
  keyAbility: EAbilities | EAbilities[];
  proficiencies: {
    [key in Lowercase<keyof typeof ESkills | ESavingThrows>]?: EProficiencies;
  };
  bonusProficiencies: number;
  progressionTable: CreateCharacterClassProgressionTableDto[];
  source: string;
}
