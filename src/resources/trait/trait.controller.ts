import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TraitService } from './trait.service';
import { CreateTraitDto } from './dto/create-trait.dto';
import { UpdateTraitDto } from './dto/update-trait.dto';
import { EUserRoles } from 'src/common/enums/user-roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('trait')
export class TraitController {
  constructor(private readonly traitService: TraitService) {}

  @Post()
  @Roles(EUserRoles.ADMIN)
  public create(@Body() createTraitDto: CreateTraitDto) {
    return this.traitService.create(createTraitDto);
  }

  @Get()
  public findAll() {
    return this.traitService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.traitService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRoles.ADMIN)
  public update(
    @Param('id') id: string,
    @Body() updateTraitDto: UpdateTraitDto,
  ) {
    return this.traitService.update(id, updateTraitDto);
  }

  @Delete(':id')
  @Roles(EUserRoles.ADMIN)
  public remove(@Param('id') id: string) {
    return this.traitService.remove(id);
  }
}
