import { EAbilities } from 'src/common/enums/abilities.enum';
import { Action } from 'src/resources/action/entities/action.entity';
import { Spell } from 'src/resources/spell/entities/spell.entity';
import { Trait } from 'src/resources/trait/entities/trait.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FeatChoice } from './feat-choice.entity';
import { FeatProficiencies } from './feat-proficiencies.entity';

@Entity('Feat')
export class Feat {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 1027 })
  description: string;

  @Column({ type: 'tinyint', unsigned: true })
  level: number;

  @ManyToMany(() => Trait)
  @JoinTable({
    name: 'Feat_Trait',
    joinColumn: { name: 'feat_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'trait_id', referencedColumnName: 'id' },
  })
  traits: Trait[];

  @ManyToMany(() => Action)
  @JoinTable({
    name: 'Feat_Action',
    joinColumn: { name: 'feat_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'action_id', referencedColumnName: 'id' },
  })
  actionsGranted: Action[];

  @ManyToMany(() => Spell)
  @JoinTable({
    name: 'Feat_Spell',
    joinColumn: { name: 'feat_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'spell_id', referencedColumnName: 'id' },
  })
  spellsGranted: Spell[];

  @OneToOne(() => FeatProficiencies, (featProficiency) => featProficiency.id)
  featProficiencies: FeatProficiencies;

  @Column({
    type: 'varchar',
    length: 1027,
    name: 'ability_boosts',
    transformer: {
      to: (value: EAbilities[]) => (value?.length ? value.join(',') : null),
      from: (value: string) =>
        value.split(',').map((ability) => ability.trim() as EAbilities),
    },
  })
  abilityBoosts: EAbilities[];

  @Column({
    type: 'varchar',
    length: 1027,
    name: 'ability_flaws',
    transformer: {
      to: (value: EAbilities[]) => (value?.length ? value.join(',') : null),
      from: (value: string) =>
        value.split(',').map((ability) => ability.trim() as EAbilities),
    },
  })
  abilityFlaws: EAbilities[];

  @OneToMany(() => FeatChoice, (featChoice) => featChoice.feat)
  featChoices: FeatChoice[];

  @Column({ type: 'varchar', length: 36 })
  source: string;

  @Column({ type: 'timestamp', name: 'date_created' })
  dateCreated: Date;

  @Column({ type: 'boolean' })
  active: boolean;
}
