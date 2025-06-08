import { PartialType } from '@nestjs/mapped-types';
import { CreateFeatDto } from './create-feat.dto';

export class UpdateFeatDto extends PartialType(CreateFeatDto) {
  active?: boolean;
}
