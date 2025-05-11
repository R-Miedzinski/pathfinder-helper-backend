import { EActionCost } from 'src/common/enums/action-cost.enum';
import { EActionType } from 'src/common/enums/action-type.enum';
import { Trait } from 'src/resources/trait/entities/trait.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Action')
export class Action {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 1027 })
  description: string;

  @ManyToMany(() => Trait)
  @JoinTable({
    name: 'Action_Trait',
    joinColumn: {
      name: 'action_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'trait_id',
      referencedColumnName: 'id',
    },
  })
  traits: Trait[];

  @Column({ type: 'tinyint', unsigned: true })
  cost: EActionCost;

  @Column({ type: 'varchar', length: 255, nullable: true })
  trigger: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  requirement: string | null;

  @Column({ type: 'varchar', length: 255 })
  type: EActionType;

  @Column({
    type: 'varchar',
    length: 1027,
    nullable: true,
    transformer: {
      to: (value: string[]) =>
        value.length ? '[' + value.join(',') + ']' : null,
      from: (value: string | null) =>
        value ? value.slice(1, value.length - 1).split(',') : value,
    },
  })
  tags: string[];

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
