import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Trait')
export class Trait {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 1027 })
  default_description: string;

  @Column({ type: 'varchar', length: 1027, nullable: true })
  feat_description: string | null;

  @Column({ type: 'varchar', length: 1027, nullable: true })
  spell_description: string | null;

  @Column({ type: 'varchar', length: 1027, nullable: true })
  item_description: string | null;

  @Column({ type: 'varchar', length: 1027, nullable: true })
  race_description: string | null;

  @Column({ type: 'varchar', length: 1027, nullable: true })
  action_description: string | null;

  @Column({ type: 'varchar', length: 1027, nullable: true })
  class_description: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true })
  source: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'date_created',
  })
  dateCreated: Date;
}
