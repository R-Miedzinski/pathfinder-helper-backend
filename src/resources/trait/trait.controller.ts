import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TraitService } from './trait.service';
import { CreateTraitDto } from './dto/create-trait.dto';
import { UpdateTraitDto } from './dto/update-trait.dto';
import { RequireRoleGuard } from 'src/common/guards/require-role/require-role.guard';
import { EUserRoles } from 'src/common/enums/user-roles.enum';

@UseGuards(new RequireRoleGuard(EUserRoles.USER))
@Controller('trait')
export class TraitController {
  constructor(private readonly traitService: TraitService) {}

  @UseGuards(new RequireRoleGuard(EUserRoles.ADMIN))
  @Post()
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
  public update(
    @Param('id') id: string,
    @Body() updateTraitDto: UpdateTraitDto,
  ) {
    return this.traitService.update(id, updateTraitDto);
  }

  @UseGuards(new RequireRoleGuard(EUserRoles.ADMIN))
  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this.traitService.remove(id);
  }
}
