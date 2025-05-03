import { Module } from '@nestjs/common';
import { TraitService } from './trait.service';
import { TraitController } from './trait.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trait } from './entities/trait.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trait])],
  controllers: [TraitController],
  providers: [TraitService],
})
export class TraitModule {}
