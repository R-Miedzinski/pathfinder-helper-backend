import { Module } from '@nestjs/common';
import { CharacterClassService } from './character-class.service';
import { CharacterClassController } from './character-class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterClass } from './entities/character-class.entity';
import {
  CharacterClassSavingThrowProficiencies,
  CharacterClassSkillProficiencies,
} from './entities/chracter-class_proficiencies.entity';
import { CharacterClassProgressionTable } from './entities/character-class_progression-table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CharacterClass,
      CharacterClassSkillProficiencies,
      CharacterClassSavingThrowProficiencies,
      CharacterClassProgressionTable,
    ]),
  ],
  controllers: [CharacterClassController],
  providers: [CharacterClassService],
})
export class CharacterClassModule {}
