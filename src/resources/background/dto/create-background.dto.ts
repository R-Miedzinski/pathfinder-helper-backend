import { EAbilities } from 'src/common/enums/abilities.enum';
import { ESkills } from 'src/common/enums/skills.enum';
import { Feat } from 'src/resources/feat/entities/feat.entity';

export class CreateBackgroundDto {
  name: string;
  description: string;
  abilityBoosts: EAbilities[];
  skills: ESkills[];
  feat: Feat;
  source: string;
}
