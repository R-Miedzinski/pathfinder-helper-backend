import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feat } from './feat.entity';

@Entity('Feat_Choice')
export class FeatChoice {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Feat, (feat) => feat.featChoices)
  @JoinColumn({
    name: 'feat',
    referencedColumnName: 'id',
  })
  feat: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 1027 })
  description: string;
}
