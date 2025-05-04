import { ESavingThrows } from 'src/common/enums/saving-throws.enum';
import { TraitDto } from 'src/resources/trait/dto/trait.dto';
import { Spell } from '../entities/spell.entity';

export class SpellDto {
  id: string;
  name: string;
  description: string;
  level: number;
  traits: TraitDto[];
  tradition: string;
  cast: string | null;
  cost: string | null;
  requirements: string | null;
  range: string | null;
  target: string | null;
  area: string | null;
  savingThrow: ESavingThrows | null;
  duration: string | null;
  heightened: string | null;
  source: string | null;

  //   optional constructor
  constructor(spell?: Spell) {
    if (spell) {
      this.id = spell.id;
      this.name = spell.name;
      this.description = spell.description;
      this.level = spell.level;
      this.traits = [];
      this.tradition = spell.tradition;
      this.cast = spell.cast;
      this.cost = spell.cost;
      this.requirements = spell.requirements;
      this.range = spell.range;
      this.target = spell.target;
      this.area = spell.area;
      this.savingThrow = spell.savingThrow;
      this.duration = spell.duration;
      this.heightened = spell.heightened;
      this.source = spell.source;
    }
  }
}
