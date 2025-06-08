import { Action } from 'src/resources/action/entities/action.entity';
import { Spell } from 'src/resources/spell/entities/spell.entity';
import { Trait } from 'src/resources/trait/entities/trait.entity';
import { FeatProficiencies } from '../entities/feat-proficiencies.entity';
import { EAbilities } from 'src/common/enums/abilities.enum';
import { FeatChoice } from '../entities/feat-choice.entity';

export class CreateFeatDto {
  name: string;
  description: string;
  level: number;
  traits: Trait[];
  actionsGranted: Action[];
  spellsGranted: Spell[];
  featProficiencies: FeatProficiencies;
  abilityBoosts: EAbilities[];
  abilityFlaws: EAbilities[];
  featChoices: FeatChoice[];
  source: string;
}
