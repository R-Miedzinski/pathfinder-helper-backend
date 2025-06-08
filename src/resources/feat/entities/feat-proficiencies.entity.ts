import { EProficiencies } from 'src/common/enums/proficiencies.enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feat } from './feat.entity';

@Entity('Feat_Proficiencies')
export class FeatProficiencies {
  @OneToOne(() => Feat, (feat) => feat.featProficiencies)
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'id',
  })
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 31, nullable: true })
  acrobatics: EProficiencies | null;

  @Column({
    type: 'varchar',
    length: 31,
    nullable: true,
    name: 'animal_handling',
  })
  animalHandling: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  arcana: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  athletics: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  crafting: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  deception: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  diplomacy: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  intimidation: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  perception: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  performance: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  religion: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  society: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  stealth: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  survival: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  thievery: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  fortitude: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  reflex: EProficiencies | null;

  @Column({ type: 'varchar', length: 31, nullable: true })
  will: EProficiencies | null;
}
