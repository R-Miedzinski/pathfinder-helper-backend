import { Module } from '@nestjs/common';
import { FeatService } from './feat.service';
import { FeatController } from './feat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feat } from './entities/feat.entity';
import { FeatProficiencies } from './entities/feat-proficiencies.entity';
import { FeatChoice } from './entities/feat-choice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feat, FeatProficiencies, FeatChoice])],
  controllers: [FeatController],
  providers: [FeatService],
})
export class FeatModule {}
