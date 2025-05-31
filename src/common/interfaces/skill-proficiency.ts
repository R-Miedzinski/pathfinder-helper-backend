import { EProficiencies } from '../enums/proficiencies.enum';
import { ESkills } from '../enums/skills.enum';

export interface ISkillProficiency {
  skill: ESkills;
  proficiency: EProficiencies;
}
