export class CreateTraitDto {
  name: string;
  default_description: string;
  feat_description: string | null;
  spell_description: string | null;
  item_description: string | null;
  race_description: string | null;
  action_description: string | null;
  class_description: string | null;
  source: string;
}
