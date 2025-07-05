import { EAbilities } from 'src/common/enums/abilities.enum';
import { Feat } from 'src/resources/feat/entities/feat.entity';
import { Trait } from 'src/resources/trait/entities/trait.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Race')
export class Race {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 1027 })
  description: string;

  @Column({ type: 'smallint', unsigned: true, name: 'hit_points' })
  hitPoints: number;

  @Column({ type: 'varchar', length: 255 })
  size: string;

  @Column({ type: 'varchar', length: 255 })
  speed: string;

  @Column({
    type: 'varchar',
    length: 1027,
    name: 'ability_boosts',
    transformer: {
      to: (value: EAbilities[]) => value.join(','),
      from: (value: string) => value.split(',').map((v) => v.trim()),
    },
  })
  abilityBoosts: EAbilities[];

  @Column({
    type: 'varchar',
    length: 1027,
    name: 'ability_flaws',
    transformer: {
      to: (value: EAbilities[]) => value.join(','),
      from: (value: string) => value.split(',').map((v) => v.trim()),
    },
  })
  abilityFlaws: EAbilities[];

  @Column({
    type: 'varchar',
    length: 1027,
    transformer: {
      to: (value: string[]) => value.join(','),
      from: (value: string) => value.split(',').map((v) => v.trim()),
    },
  })
  languages: string[];

  @ManyToOne(() => Feat, (feat) => feat.id, {
    onDelete: 'SET NULL',
    eager: true,
  })
  darkvision: Feat;

  @ManyToMany(() => Trait, (trait) => trait.id, {
    eager: true,
    cascade: true,
  })
  @JoinTable({
    name: 'Race_Trait',
    joinColumn: { name: 'race_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'trait_id', referencedColumnName: 'id' },
  })
  traits: Trait[];

  @Column({ type: 'varchar', length: 36 })
  source: string;

  @Column({
    type: 'datetime',
    name: 'date_created',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreated: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;
}
