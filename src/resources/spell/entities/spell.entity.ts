import { ESavingThrows } from 'src/common/enums/saving-throws.enum';
import { Trait } from 'src/resources/trait/entities/trait.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Spell')
export class Spell {
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
    name: 'Spell_Trait',
    joinColumn: {
      name: 'spell_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'trait_id',
      referencedColumnName: 'id',
    },
  })
  traits: Trait[];

  @Column({ type: 'varchar', length: 255 })
  tradition: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cast: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cost: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  requirements: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  range: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  target: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  area: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'saving_throw',
  })
  savingThrow: ESavingThrows | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  duration: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  heightened: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true })
  source: string | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'date_created',
  })
  dateCreated: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;
}
