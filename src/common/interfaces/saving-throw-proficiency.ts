import { EProficiencies } from '../enums/proficiencies.enum';
import { ESavingThrows } from '../enums/saving-throws.enum';

export interface ISavingThrowProficiency {
  savingThrow: ESavingThrows;
  proficiency: EProficiencies;
}
