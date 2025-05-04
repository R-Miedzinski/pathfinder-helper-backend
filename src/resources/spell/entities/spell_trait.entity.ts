import { Column, Entity } from 'typeorm';

@Entity('Spell_Trait')
export class SpellTrait {
  @Column({ type: 'varchar', length: 36, nullable: false, primary: true })
  spell_id: string;

  @Column({ type: 'varchar', length: 36, nullable: false, primary: true })
  trait_id: string;
}
