import { Module } from '@nestjs/common';
import { SpellService } from './spell.service';
import { SpellController } from './spell.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spell } from './entities/spell.entity';
import { SpellTrait } from './entities/spell_trait.entity';
import { TraitModule } from '../trait/trait.module';

@Module({
  imports: [TypeOrmModule.forFeature([Spell, SpellTrait]), TraitModule],
  controllers: [SpellController],
  providers: [SpellService],
})
export class SpellModule {}
