import { EAbilities } from 'src/common/enums/abilities.enum';
import { ESkills } from 'src/common/enums/skills.enum';
import { Feat } from 'src/resources/feat/entities/feat.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Background')
export class Background {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 1027 })
  description: string;

  @Column({
    type: 'varchar',
    length: 1027,
    name: 'abilit_boosts',
    transformer: {
      to: (value: EAbilities[]) => {
        return value.join(',');
      },
      from: (value: string) => {
        return value.split(',').map((v) => v.trim());
      },
    },
  })
  abilityBoosts: EAbilities[];

  @Column({
    type: 'varchar',
    length: 1027,
    name: 'skills',
    transformer: {
      to: (value: ESkills[]) => {
        return value.join(',');
      },
      from: (value: string) => {
        return value.split(',').map((v) => v.trim());
      },
    },
  })
  skills: ESkills[];

  @ManyToOne(() => Feat, (feat) => feat.id, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn()
  feat: Feat;

  @Column({ type: 'varchar', length: 36 })
  source: string;

  @Column({
    type: 'datetime',
    name: 'date_created',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreated: Date;

  @Column({ type: 'boolean' })
  active: boolean;
}
