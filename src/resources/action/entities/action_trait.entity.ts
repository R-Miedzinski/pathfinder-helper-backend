import { Column, Entity } from 'typeorm';

@Entity('Action_Trait')
export class ActionTrait {
  @Column({ type: 'varchar', length: 36, primary: true })
  action_id: string;

  @Column({ type: 'varchar', length: 36, primary: true })
  trait_id: string;
}
