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
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EUserRoles } from 'src/common/enums/user-roles.enum';
import { Action } from './entities/action.entity';
import { ActionDto } from './dto/action.dto';

@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  @Roles(EUserRoles.ADMIN)
  public create(@Body() createActionDto: CreateActionDto): Promise<Action> {
    return this.actionService.create(createActionDto);
  }

  @Get()
  public findAll(
    @Query('raw') raw: string = '',
  ): Promise<Action[] | ActionDto[]> {
    if (raw.toLowerCase() === 'true') {
      return this.actionService.findAll();
    }

    return this.actionService.findAllWithContext();
  }

  @Get(':id')
  public findOne(
    @Param('id') id: string,
    @Query('raw') raw: string = '',
  ): Promise<Action | ActionDto> {
    if (raw.toLowerCase() === 'true') {
      return this.actionService.findOne(id);
    }

    return this.actionService.findOneWithContext(id);
  }

  @Patch(':id')
  @Roles(EUserRoles.ADMIN)
  public update(
    @Param('id') id: string,
    @Body() updateActionDto: UpdateActionDto,
  ): Promise<Action> {
    return this.actionService.update(id, updateActionDto);
  }

  @Delete(':id')
  @Roles(EUserRoles.ADMIN)
  public remove(@Param('id') id: string): Promise<string> {
    return this.actionService.remove(id);
  }
}
