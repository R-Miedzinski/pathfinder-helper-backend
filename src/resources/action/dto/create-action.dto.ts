import { EActionCost } from 'src/common/enums/action-cost.enum';
import { EActionType } from 'src/common/enums/action-type.enum';

export class CreateActionDto {
  name: string;
  description: string;
  traits: string[];
  cost: EActionCost;
  trigger: string | null;
  requirement: string | null;
  type: EActionType;
  tags: string[];
  source: string;
}
