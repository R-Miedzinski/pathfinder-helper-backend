import { Injectable } from '@nestjs/common';
import { CreateSpellDto } from './dto/create-spell.dto';
import { UpdateSpellDto } from './dto/update-spell.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spell } from './entities/spell.entity';
import { SpellTrait } from './entities/spell_trait.entity';
import { SpellDto } from './dto/spell.dto';
import { TraitService } from '../trait/trait.service';
import { ETraitContext } from 'src/common/enums/trait-context.enum';
import { v4 as uuidv4 } from 'uuid';
import { transformUndefinedToNull } from 'src/common/functions/helpers';

@Injectable()
export class SpellService {
  constructor(
    @InjectRepository(Spell)
    private readonly spellRepository: Repository<Spell>,
    @InjectRepository(SpellTrait)
    private readonly spellTraitRepository: Repository<SpellTrait>,
    private readonly traitService: TraitService,
  ) {}

  /**
   * Create a new spell
   * @param createSpellDto - The data to create the spell
   * @returns The created spell
   */
  public create(createSpellDto: CreateSpellDto): Promise<Spell> {
    createSpellDto = transformUndefinedToNull<CreateSpellDto>(
      createSpellDto,
      CreateSpellDto,
    );
    const traitIds = createSpellDto.traits ?? [];

    // enrich the spell with additional properties
    const enriched_spell: Spell = {
      ...createSpellDto,
      traits: [],
      id: uuidv4(),
      active: true,
      dateCreated: new Date(),
    };

    // create the spell and its traits realtions
    const spell = this.spellRepository.create(enriched_spell);

    return this.spellRepository.save(spell).then((createdSpell) => {
      const spellTraits = traitIds.map((traitId) =>
        this.spellTraitRepository.create({
          spell_id: enriched_spell.id,
          trait_id: traitId,
        }),
      );

      spellTraits.forEach((spellTrait) =>
        this.spellTraitRepository.save(spellTrait),
      );

      return createdSpell;
    });
  }

  /**
   * Find all spells in raw format
   * @returns An array of spells
   */
  public findAll(): Promise<Spell[]> {
    return this.spellRepository.find({
      where: { active: true },
      relations: ['traits'],
    });
  }

  /**
   * Find all spells and transforms traits to contextual DTOs
   * @returns An array of spells with their traits transformed to appropriate DTOs
   */
  public findAllWithContext(): Promise<SpellDto[]> {
    return this.findAll().then((spells) => {
      return spells.map((spell) => {
        const spellDto = new SpellDto(spell);
        spellDto.traits = spell.traits.map((trait) =>
          this.traitService.toDtoWithContext(trait, ETraitContext.SPELL),
        );
        return spellDto;
      });
    });
  }

  /**
   * Find a spell by its ID
   * @param id - The ID of the spell to find
   * @returns The spell if found, or throws an error if not found
   */
  public findOne(id: string): Promise<Spell> {
    return this.spellRepository
      .findOne({
        where: { id, active: true },
        relations: ['traits'],
      })
      .then((spell) => {
        if (!spell) {
          throw new Error(`Spell with id ${id} not found`);
        }

        return spell;
      });
  }

  /**
   * Find a spell by its ID and transforms traits to contextual DTOs
   * @param id - The ID of the spell to find
   * @returns The spell with its traits transformed to appropriate DTOs
   */
  public findOneWithContext(id: string): Promise<SpellDto> {
    return this.findOne(id).then((spell) => {
      const spellDto = new SpellDto(spell);
      spellDto.traits = spell.traits.map((trait) =>
        this.traitService.toDtoWithContext(trait, ETraitContext.SPELL),
      );

      return spellDto;
    });
  }

  /**
   * Update a spell by its ID
   * @param id - The ID of the spell to update
   * @param updateSpellDto - The data to update the spell with
   * @returns The updated spell
   */
  public update(id: string, updateSpellDto: UpdateSpellDto): Promise<Spell> {
    updateSpellDto = transformUndefinedToNull<UpdateSpellDto>(
      updateSpellDto,
      UpdateSpellDto,
    );
    const traitIds = updateSpellDto.traits ?? [];
    const updatedSpell = {
      ...updateSpellDto,
      traits: [],
    };

    return this.spellRepository
      .findOne({ where: { id }, relations: ['traits'] })
      .then((spell) => {
        if (!spell) {
          throw new Error(`Spell with ID ${id} not found`);
        }

        const updated_spell = { ...spell, ...updatedSpell };

        // TODO: handle removal of traits
        // this.spellTraitRepository.delete({ spell_id: id });

        // create new spell traits
        const spellTraits = traitIds
          .map((traitId) => {
            if (spell.traits.some((trait) => trait.id === traitId)) {
              return null;
            }

            return this.spellTraitRepository.create({
              spell_id: updated_spell.id,
              trait_id: traitId,
            });
          })
          .filter((spellTrait) => spellTrait !== null) as SpellTrait[]; // filter out null values

        spellTraits.forEach((spellTrait) =>
          this.spellTraitRepository.save(spellTrait),
        );
        return this.spellRepository.save(updated_spell);
      });
  }

  /**
   * Deactivates a spell by its ID
   * @param id - The ID of the spell to be deactivated
   * @returns A message indicating the spell has been deactivated
   */
  public remove(id: string): Promise<string> {
    return this.findOne(id).then((result) => {
      if (!result) {
        throw new Error(`Spell with ID ${id} not found`);
      }

      return this.update(id, { active: false }).then(() => {
        return `Spell with ID ${id} has been deactivated`;
      });
    });
  }
}
