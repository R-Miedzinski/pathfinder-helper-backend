import { Injectable } from '@nestjs/common';
import { CreateTraitDto } from './dto/create-trait.dto';
import { UpdateTraitDto } from './dto/update-trait.dto';
import { Trait } from './entities/trait.entity';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ETraitContext } from 'src/common/enums/trait-context.enum';
import { TraitDto } from './dto/trait.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TraitService {
  private contextToKeyMap: { [key in ETraitContext]: keyof Trait };

  constructor(
    @InjectRepository(Trait)
    private readonly traitRepository: Repository<Trait>,
  ) {
    this.contextToKeyMap = {
      [ETraitContext.DEFAULT]: 'default_description',
      [ETraitContext.FEAT]: 'feat_description',
      [ETraitContext.ITEM]: 'item_description',
      [ETraitContext.CLASS]: 'class_description',
      [ETraitContext.SPELL]: 'spell_description',
      [ETraitContext.ACTION]: 'action_description',
      [ETraitContext.RACE]: 'race_description',
    };
  }

  /**
   * Creates a new trait in the database.
   * @param createTraitDto - The data transfer object containing the trait details.
   * @returns The created Trait entity.
   *
   * This method enriches the trait with additional properties: uuid, active status, and creation date timestamp.
   */
  public create(createTraitDto: CreateTraitDto): Promise<Trait> {
    const enriched_trait: Trait = {
      ...createTraitDto,
      id: uuidv4(),
      active: true,
      dateCreated: new Date(),
    };

    const trait = this.traitRepository.create(enriched_trait);

    return this.traitRepository.save(trait);
  }

  /**
   * Finds all traits in the database.
   * @returns An array of Trait entities.
   */
  public findAll(): Promise<Trait[]> {
    return this.traitRepository.find({ where: { active: true } });
  }

  /**
   * Finds all traits by their IDs and returns them with the specified context.
   * @param ids - An array of trait IDs.
   * @param context - The context in which to find the traits.
   * @returns An array of TraitDto objects containing the traits' details.
   */
  public findAllWithContext(
    ids: string[],
    context: ETraitContext,
  ): Promise<TraitDto[]> {
    return this.traitRepository
      .findBy({ id: In(ids), active: true })
      .then((traits) => {
        return traits.map((trait) => {
          return this.toDtoWithContext(trait, context);
        });
      });
  }

  /**
   * Finds a trait by its ID.
   * @param id - The ID of the trait to find.
   * @returns The Trait entity if found, or null if not found.
   */
  public findOne(id: string): Promise<Trait | null> {
    return this.traitRepository
      .findOne({ where: { id, active: true } })
      .then((trait) => {
        if (!trait) {
          return null;
        }

        return trait;
      });
  }

  /**
   * Finds a trait by its ID and context, returning the description only for that context.
   * If the context is not valid, it falls back to the default description.
   *
   * @param id - The ID of the trait.
   * @param context - The context in which to find the trait.
   * @returns The TraitDto object containing the trait's details or null if not found.
   */
  public findOneByContext(
    id: string,
    context: ETraitContext,
  ): Promise<TraitDto | null> {
    return this.findOne(id).then((trait) => {
      // Check if the trait exists
      if (!trait) {
        return null;
      }

      return this.toDtoWithContext(trait, context);
    });
  }

  /**
   * Updates a trait by its ID.
   * @param id - The ID of the trait to update.
   * @param updateTraitDto - The data transfer object containing the updated trait details.
   * @returns The updated Trait entity.
   */
  public update(id: string, updateTraitDto: UpdateTraitDto): Promise<Trait> {
    return this.traitRepository.findOne({ where: { id } }).then((trait) => {
      if (!trait) {
        throw new Error(`Trait with ID ${id} not found`);
      }

      const updated_trait = { ...trait, ...updateTraitDto };

      return this.traitRepository.save(updated_trait);
    });
  }

  /**
   * Deactivates a trait by its ID.
   * @param id - The ID of the trait to deactivate.
   * @returns A message indicating the result of the operation.
   */
  public remove(id: string) {
    return this.findOne(id).then((result) => {
      if (!result) {
        throw new Error(`Trait with ID ${id} not found`);
      }

      return this.update(id, { active: false }).then(() => {
        return `Trait with ID ${id} has been deactivated`;
      });
    });
  }

  /**
   * Converts a Trait entity to a TraitDto object.
   * @param trait - The Trait entity to convert.
   * @param context - The context in which to convert the trait.
   * @returns The converted TraitDto object.
   */
  public toDtoWithContext(trait: Trait, context: ETraitContext): TraitDto {
    let traitDescription = trait[this.contextToKeyMap[context]];

    // Check if the context is valid
    if (!traitDescription) {
      traitDescription = trait.default_description;
    }

    return {
      id: trait.id,
      name: trait.name,
      description: traitDescription,
      context,
    } as TraitDto;
  }
}
