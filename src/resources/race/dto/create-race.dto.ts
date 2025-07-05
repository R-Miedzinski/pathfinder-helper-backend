import { EAbilities } from 'src/common/enums/abilities.enum';
import { Feat } from 'src/resources/feat/entities/feat.entity';
import { Trait } from 'src/resources/trait/entities/trait.entity';

export class CreateRaceDto {
  name: string;
  description: string;
  hitPoints: number;
  size: string;
  speed: string;
  abilityBoosts: EAbilities[];
  abilityFlaws: EAbilities[];
  languages: string[];
  traits: Trait[];
  darkvision: Feat;
  source: string;
}
