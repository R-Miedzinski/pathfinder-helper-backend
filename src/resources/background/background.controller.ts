import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BackgroundService } from './background.service';
import { CreateBackgroundDto } from './dto/create-background.dto';
import { UpdateBackgroundDto } from './dto/update-background.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EUserRoles } from 'src/common/enums/user-roles.enum';
import { Background } from './entities/background.entity';

@Controller('background')
export class BackgroundController {
  constructor(private readonly backgroundService: BackgroundService) {}

  @Roles(EUserRoles.ADMIN)
  @Post()
  public create(
    @Body() createBackgroundDto: CreateBackgroundDto,
  ): Promise<Background> {
    return this.backgroundService.create(createBackgroundDto);
  }

  @Get()
  public findAll(): Promise<Background[]> {
    return this.backgroundService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<Background> {
    return this.backgroundService.findOne(id);
  }

  @Roles(EUserRoles.ADMIN)
  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() updateBackgroundDto: UpdateBackgroundDto,
  ): Promise<Background> {
    return this.backgroundService.update(id, updateBackgroundDto);
  }

  @Roles(EUserRoles.ADMIN)
  @Delete(':id')
  public remove(@Param('id') id: string): Promise<string> {
    return this.backgroundService.remove(id);
  }
}
