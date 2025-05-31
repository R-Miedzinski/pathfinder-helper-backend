import { EAbilities } from 'src/common/enums/abilities.enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  CharacterClassSavingThrowProficiencies,
  CharacterClassSkillProficiencies,
} from './chracter-class_proficiencies.entity';
import { CharacterClassProgressionTable } from './character-class_progression-table.entity';

@Entity('CharacterClass')
export class CharacterClass {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 1027 })
  description: string;

  @Column({ type: 'tinyint', unsigned: true, name: 'hit_points' })
  hitPoints: number;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'key_ability',
    transformer: {
      to: (value: EAbilities | EAbilities[]) => {
        if (Array.isArray(value)) {
          return '[' + value.join(',') + ']';
        }

        return value;
      },
      from: (value: string) => {
        if (value.charAt(0) === '[' && value.charAt(value.length - 1) === ']') {
          return value
            .slice(1, value.length - 1)
            .split(',')
            .map((v) => v.trim()) as EAbilities[];
        }

        return value as EAbilities;
      },
    },
  })
  keyAbility: EAbilities | EAbilities[];

  @OneToOne(
    () => CharacterClassSkillProficiencies,
    (skillProficiencies) => skillProficiencies.id,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'id' })
  skillProficiencies: CharacterClassSkillProficiencies;

  @OneToOne(
    () => CharacterClassSavingThrowProficiencies,
    (savingThrowProficiencies) => savingThrowProficiencies.id,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'id' })
  savingThrowProficiencies: CharacterClassSavingThrowProficiencies;

  @Column({ type: 'smallint', unsigned: true, name: 'bonus_proficiencies' })
  bonusProficiencies: number;

  @OneToMany(
    () => CharacterClassProgressionTable,
    (progession) => progession.class,
    {
      cascade: false,
    },
  )
  progressionTable: CharacterClassProgressionTable[];

  @Column({ type: 'varchar', length: 36, nullable: true })
  source: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'date_created',
  })
  dateCreated: Date;

  @Column({ type: 'boolean', nullable: false })
  active: boolean;
}
