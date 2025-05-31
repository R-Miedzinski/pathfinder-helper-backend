import { PartialType } from '@nestjs/mapped-types';
import { CreateCharacterClassDto } from './create-character-class.dto';

export class UpdateCharacterClassDto extends PartialType(
  CreateCharacterClassDto,
) {
  active?: boolean;
}
