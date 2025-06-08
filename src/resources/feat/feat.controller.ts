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
import { FeatService } from './feat.service';
import { CreateFeatDto } from './dto/create-feat.dto';
import { UpdateFeatDto } from './dto/update-feat.dto';
import { EUserRoles } from 'src/common/enums/user-roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Feat } from './entities/feat.entity';
import { FindOptionsWhere } from 'typeorm';

@Controller('feat')
export class FeatController {
  constructor(private readonly featService: FeatService) {}

  @Post()
  @Roles(EUserRoles.ADMIN)
  public create(@Body() createFeatDto: CreateFeatDto): Promise<Feat> {
    return this.featService.create(createFeatDto);
  }

  @Get()
  public findAll(@Query('search') search?: string): Promise<Feat[]> {
    if (!search) {
      return this.featService.findAll();
    }

    let searchParams = undefined;

    try {
      searchParams = JSON.parse(search) as FindOptionsWhere<Feat>;
    } catch {
      console.error('Invalid search query format:', search);
    }

    return this.featService.findAll(searchParams);
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<Feat> {
    return this.featService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRoles.ADMIN)
  public update(
    @Param('id') id: string,
    @Body() updateFeatDto: UpdateFeatDto,
  ): Promise<Feat> {
    return this.featService.update(id, updateFeatDto);
  }

  @Delete(':id')
  @Roles(EUserRoles.ADMIN)
  public remove(@Param('id') id: string): Promise<string> {
    return this.featService.remove(id);
  }
}
