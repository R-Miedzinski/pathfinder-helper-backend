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
import { CharacterClassService } from './character-class.service';
import { CreateCharacterClassDto } from './dto/create-character-class.dto';
import { UpdateCharacterClassDto } from './dto/update-character-class.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EUserRoles } from 'src/common/enums/user-roles.enum';
import { CharacterClass } from './entities/character-class.entity';
import { CharacterClassDto } from './dto/character-class.dto';

@Controller('character-class')
export class CharacterClassController {
  constructor(private readonly characterClassService: CharacterClassService) {}

  @Roles(EUserRoles.ADMIN)
  @Post()
  public create(
    @Body() createCharacterClassDto: CreateCharacterClassDto,
  ): Promise<CharacterClass> {
    return this.characterClassService.create(createCharacterClassDto);
  }

  @Get()
  public findAll(): Promise<CharacterClass[]> {
    return this.characterClassService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<CharacterClass> {
    return this.characterClassService.findOne(id);
  }

  @Roles(EUserRoles.ADMIN)
  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() updateCharacterClassDto: UpdateCharacterClassDto,
  ): Promise<CharacterClass> {
    return this.characterClassService.update(id, updateCharacterClassDto);
  }

  @Roles(EUserRoles.ADMIN)
  @Delete(':id')
  public remove(@Param('id') id: string): Promise<string> {
    return this.characterClassService.remove(id);
  }
}
