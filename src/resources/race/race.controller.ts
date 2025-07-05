import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RaceService } from './race.service';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EUserRoles } from 'src/common/enums/user-roles.enum';
import { Race } from './entities/race.entity';

@Controller('race')
export class RaceController {
  constructor(private readonly raceService: RaceService) {}

  @Roles(EUserRoles.ADMIN)
  @Post()
  public create(@Body() createRaceDto: CreateRaceDto): Promise<Race> {
    return this.raceService.create(createRaceDto);
  }

  @Get()
  public findAll(): Promise<Race[]> {
    return this.raceService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<Race> {
    return this.raceService.findOne(id);
  }

  @Roles(EUserRoles.ADMIN)
  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() updateRaceDto: UpdateRaceDto,
  ): Promise<Race> {
    return this.raceService.update(id, updateRaceDto);
  }

  @Roles(EUserRoles.ADMIN)
  @Delete(':id')
  public remove(@Param('id') id: string): Promise<string> {
    return this.raceService.remove(id);
  }
}
