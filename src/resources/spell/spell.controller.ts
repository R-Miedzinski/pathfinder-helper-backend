import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SpellService } from './spell.service';
import { CreateSpellDto } from './dto/create-spell.dto';
import { UpdateSpellDto } from './dto/update-spell.dto';
import { Spell } from './entities/spell.entity';
import { SpellDto } from './dto/spell.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EUserRoles } from 'src/common/enums/user-roles.enum';

@Controller('spell')
export class SpellController {
  constructor(private readonly spellService: SpellService) {}

  @Post()
  @Roles(EUserRoles.ADMIN)
  public create(@Body() createSpellDto: CreateSpellDto): Promise<Spell> {
    return this.spellService.create(createSpellDto);
  }

  @Get()
  public findAll(@Query('raw') raw?: string): Promise<Spell[] | SpellDto[]> {
    if (raw?.toLowerCase() === 'true') {
      return this.spellService.findAll();
    } else {
      return this.spellService.findAllWithContext();
    }
  }

  @Get(':id')
  public findOne(
    @Param('id') id: string,
    @Query('raw') raw?: string,
  ): Promise<Spell | SpellDto> {
    if (raw?.toLowerCase() === 'true') {
      return this.spellService.findOne(id);
    } else {
      return this.spellService.findOneWithContext(id);
    }
  }

  @Patch(':id')
  @Roles(EUserRoles.ADMIN)
  public update(
    @Param('id') id: string,
    @Body() updateSpellDto: UpdateSpellDto,
  ): Promise<Spell> {
    return this.spellService.update(id, updateSpellDto);
  }

  @Delete(':id')
  @Roles(EUserRoles.ADMIN)
  public remove(@Param('id') id: string): Promise<string> {
    return this.spellService.remove(id);
  }
}
