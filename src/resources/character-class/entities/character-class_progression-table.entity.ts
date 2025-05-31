import { EProficiencies } from 'src/common/enums/proficiencies.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterClass } from './character-class.entity';

@Entity('CharacterClass_ProgressionTable')
export class CharacterClassProgressionTable {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(
    () => CharacterClass,
    (characterClass) => characterClass.progressionTable,
  )
  // @Column({ type: 'varchar', length: 36 })
  @JoinColumn({ name: 'class' })
  class: CharacterClass;

  @Column({ type: 'tinyint', unsigned: true })
  level: number;

  @Column({ type: 'boolean', name: 'class_feat' })
  classFeat: boolean;

  @Column({ type: 'boolean', name: 'skill_feat' })
  skillFeat: boolean;

  @Column({ type: 'boolean', name: 'general_feat' })
  generalFeat: boolean;

  @Column({ type: 'boolean', name: 'ancestry_feat' })
  ancestryFeat: boolean;

  @Column({ type: 'boolean', name: 'ability_boost' })
  abilityBoost: boolean;

  @Column({
    type: 'varchar',
    length: 1027,
    name: 'feat_granted',
    transformer: {
      from: (value: string) => {
        if (value.charAt(0) === '[' && value.charAt(value.length - 1) === ']') {
          return value
            .slice(1, value.length - 1)
            .split(',')
            .map((v) => v.trim());
        }

        return [value];
      },
      to: (value: string[]) => {
        if (Array.isArray(value)) {
          return '[' + value.join(',') + ']';
        }

        return value;
      },
    },
  })
  featGranted: string[];

  @Column({ type: 'boolean', name: 'skill_increase' })
  skillIncrease: boolean;

  @Column({ type: 'varchar', length: 31, name: 'max_skill_level' })
  maxSkillLevel: EProficiencies;

  @Column({ type: 'boolean', name: 'class_dc_increase' })
  classDcIncrease: boolean;

  @Column({ type: 'varchar', length: 31, name: 'class_dc' })
  classDc: EProficiencies;
}
