import { PartialType } from '@nestjs/mapped-types';
import { CreateCharacterClassProgressionTableDto } from './create-character-class-progression-table.dto';

export class UpdateCharacterClassProgressionTableDto extends PartialType(
  CreateCharacterClassProgressionTableDto,
) {
  id?: string;
  class?: string;
}
