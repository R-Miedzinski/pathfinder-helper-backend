import { ESavingThrows } from 'src/common/enums/saving-throws.enum';

export class CreateSpellDto {
  name: string;
  description: string;
  level: number;
  traits: string[];
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
}
