import { EActionCost } from 'src/common/enums/action-cost.enum';
import { EActionType } from 'src/common/enums/action-type.enum';
import { TraitDto } from 'src/resources/trait/dto/trait.dto';
import { Action } from '../entities/action.entity';

export class ActionDto {
  id: string;
  name: string;
  description: string;
  traits: TraitDto[];
  cost: EActionCost;
  trigger: string | null;
  requirement: string | null;
  type: EActionType;
  tags: string[];

  constructor(action: Action) {
    this.id = action.id;
    this.name = action.name;
    this.description = action.description;
    this.cost = action.cost;
    this.trigger = action.trigger;
    this.requirement = action.requirement;
    this.type = action.type;
    this.tags = action.tags;
  }
}
