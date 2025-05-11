import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './entities/action.entity';
import { ActionTrait } from './entities/action_trait.entity';
import { TraitModule } from '../trait/trait.module';

@Module({
  imports: [TypeOrmModule.forFeature([Action, ActionTrait]), TraitModule],
  controllers: [ActionController],
  providers: [ActionService],
})
export class ActionModule {}
