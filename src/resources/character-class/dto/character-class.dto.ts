import { EAbilities } from 'src/common/enums/abilities.enum';
import { EProficiencies } from 'src/common/enums/proficiencies.enum';
import { ISavingThrowProficiency } from 'src/common/interfaces/saving-throw-proficiency';
import { ISkillProficiency } from 'src/common/interfaces/skill-proficiency';
import { CharacterClass } from '../entities/character-class.entity';
import { ESkills } from 'src/common/enums/skills.enum';
import { ESavingThrows } from 'src/common/enums/saving-throws.enum';

export class CharacterClassDto {
  id: string;
  name: string;
  description: string;
  hitPoints: number;
  keyAbility: EAbilities | EAbilities[];
  perception: EProficiencies;
  savingThrows: ISavingThrowProficiency[];
  skills: ISkillProficiency[];
  classDC: EProficiencies;
  //   TODO: handle weapon and armor profficiencies
  //   attacks:
  //   defenses:

  constructor(characterClass: CharacterClass) {
    this.id = characterClass.id;
    this.name = characterClass.name;
    this.description = characterClass.description;
    this.hitPoints = characterClass.hitPoints;
    this.keyAbility = characterClass.keyAbility;
    this.perception =
      characterClass.skillProficiencies?.perception ?? EProficiencies.U;
    this.savingThrows = Object.entries(
      characterClass.savingThrowProficiencies,
    ).map(([savingThrow, proficiency]: [ESavingThrows, EProficiencies]) => ({
      savingThrow,
      proficiency,
    }));
    this.skills = Object.entries(characterClass.skillProficiencies)
      .filter(([skill, _]) => skill !== ESkills.PERCEPTION)
      .map(([skill, proficiency]: [ESkills, EProficiencies]) => ({
        skill,
        proficiency,
      }));
    //   TODO: handle classDC
    this.classDC = EProficiencies.T; // characterClass.classDC;
  }
}
