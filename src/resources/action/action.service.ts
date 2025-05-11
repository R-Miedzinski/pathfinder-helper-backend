import { Injectable } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Action } from './entities/action.entity';
import { ActionDto } from './dto/action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionTrait } from './entities/action_trait.entity';
import { TraitService } from '../trait/trait.service';
import { ETraitContext } from 'src/common/enums/trait-context.enum';
import { transformUndefinedToNull } from 'src/common/functions/helpers';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
    @InjectRepository(ActionTrait)
    private readonly actionTraitRepository: Repository<ActionTrait>,
    private readonly traitService: TraitService,
  ) {}

  /**
   * Create a new action
   * @param createActionDto - The data to create the action
   * @returns The created action
   */
  public create(createActionDto: CreateActionDto): Promise<Action> {
    createActionDto = transformUndefinedToNull<CreateActionDto>(
      createActionDto,
      CreateActionDto,
    );

    // enrich the action with additional properties
    const enriched_action: Action = {
      ...createActionDto,
      traits: [],
      id: uuidv4(),
      active: true,
      dateCreated: new Date(),
    };

    // create the action and its traits relations
    const action = this.actionRepository.create(enriched_action);
    return this.actionRepository.save(action).then((createdAction) => {
      const traitIds = createActionDto.traits ?? [];
      const actionTraits = traitIds.map((traitId) =>
        this.actionTraitRepository.create({
          action_id: enriched_action.id,
          trait_id: traitId,
        }),
      );

      actionTraits.forEach((actionTrait) =>
        this.actionTraitRepository.save(actionTrait),
      );

      return createdAction;
    });
  }

  /**
   * Find aall actions
   * @returns An array of actions
   */
  public findAll(): Promise<Action[]> {
    return this.actionRepository.find({
      where: { active: true },
      relations: ['traits'],
    });
  }

  /**
   * Find all actions and transform traits to contextual DTOs
   * @returns An array of actions with their traits transformed to appropriate DTOs
   */
  public findAllWithContext(): Promise<ActionDto[]> {
    return this.findAll().then((actions) => {
      return actions.map((action) => {
        const actionDto = new ActionDto(action);
        actionDto.traits = action.traits.map((trait) =>
          this.traitService.toDtoWithContext(trait, ETraitContext.ACTION),
        );

        return actionDto;
      });
    });
  }

  /**
   * Find an action by its ID
   * @param id - The ID of the action to find
   * @returns The action with the specified ID
   */
  public findOne(id: string): Promise<Action> {
    return this.actionRepository
      .findOne({ where: { id, active: true }, relations: ['traits'] })
      .then((action) => {
        if (!action) {
          throw new Error(`Action with id ${id} not found`);
        }

        return action;
      });
  }

  /**
   * Find an action by its ID and transform traits to contextual DTOs
   * @param id - The ID of the action to find
   * @returns The action with its traits transformed to appropriate DTOs
   */
  public findOneWithContext(id: string): Promise<ActionDto> {
    return this.findOne(id).then((action) => {
      const actionDto = new ActionDto(action);
      actionDto.traits = action.traits.map((trait) =>
        this.traitService.toDtoWithContext(trait, ETraitContext.ACTION),
      );

      return actionDto;
    });
  }

  /**
   * Update an action by its ID
   * @param id - The ID of the action to update
   * @param updateActionDto - The data to update the action
   * @returns The updated action
   */
  public update(id: string, updateActionDto: UpdateActionDto): Promise<Action> {
    updateActionDto = transformUndefinedToNull<UpdateActionDto>(
      updateActionDto,
      UpdateActionDto,
    );
    const traitIds = updateActionDto.traits ?? [];
    const updatedAction = {
      ...updateActionDto,
    };

    return this.actionRepository
      .findOne({ where: { id }, relations: ['traits'] })
      .then((action) => {
        if (!action) {
          throw new Error(`Action with id ${id} not found`);
        }

        const updated_action = {
          ...action,
          ...updatedAction,
          traits: action.traits,
        };

        // TODO: handle removal of traits
        // this.actionTraitRepository.delete({ action_id: id });

        // create new action traits
        const actionTraits = traitIds
          .map((traitId) => {
            if (action.traits.some((trait) => trait.id === traitId)) {
              return null;
            }

            return this.actionTraitRepository.create({
              action_id: updated_action.id,
              trait_id: traitId,
            });
          })
          .filter((actionTrait) => actionTrait !== null) as ActionTrait[]; // filter out null values

        actionTraits.forEach((actionTrait) =>
          this.actionTraitRepository.save(actionTrait),
        );

        return this.actionRepository.save(updated_action);
      });
  }

  /**
   * Deactivate an action by its ID
   * @param id - The ID of the action to be deactivated
   * @returns A message indicating the action has been deactivated
   */
  public remove(id: string): Promise<string> {
    return this.update(id, { active: false })
      .then(() => {
        return `Action with id ${id} has been deactivated`;
      })
      .catch((error) => {
        throw new Error(
          `Error removing action with id ${id}: ${error.message}`,
        );
      });
  }
}
