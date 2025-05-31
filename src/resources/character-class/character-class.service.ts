import { Injectable } from '@nestjs/common';
import { CreateCharacterClassDto } from './dto/create-character-class.dto';
import { UpdateCharacterClassDto } from './dto/update-character-class.dto';
import { CharacterClass } from './entities/character-class.entity';
import { CharacterClassDto } from './dto/character-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import {
  CharacterClassSavingThrowProficiencies,
  CharacterClassSkillProficiencies,
} from './entities/chracter-class_proficiencies.entity';
import { CharacterClassProgressionTable } from './entities/character-class_progression-table.entity';
import { UpdateCharacterClassProgressionTableDto } from './dto/update-character-class-progression-table.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CharacterClassService {
  constructor(
    @InjectRepository(CharacterClass)
    private readonly characterClassRepository: Repository<CharacterClass>,
    @InjectRepository(CharacterClassSkillProficiencies)
    private readonly characterClassSkillProficienciesRepository: Repository<CharacterClassSkillProficiencies>,
    @InjectRepository(CharacterClassSavingThrowProficiencies)
    private readonly characterClassSavingThrowProficienciesRepository: Repository<CharacterClassSavingThrowProficiencies>,
    @InjectRepository(CharacterClassProgressionTable)
    private readonly characterClassProgressionTableRepository: Repository<CharacterClassProgressionTable>,
  ) {}

  /**
   * Create a new character class
   * @param createCharacterClassDto The character class data to create
   * @returns The created character class
   */
  public create(
    createCharacterClassDto: CreateCharacterClassDto,
  ): Promise<CharacterClass> {
    // Extract progression table and proficiencies
    const { progressionTable, proficiencies, ...characterClassData } =
      createCharacterClassDto;

    // Create new character class id, and create entity
    const characterClass = this.characterClassRepository.create({
      ...characterClassData,
      id: uuidv4(),
      active: true,
      dateCreated: new Date(),
    });

    // Create the progression table
    const progressionEntries = (progressionTable ?? []).map((entry) => ({
      ...entry,
      id: uuidv4(),
      class: { id: characterClass.id },
    }));

    const progressionTableEntities =
      this.characterClassProgressionTableRepository.create(progressionEntries);

    // Create the skill proficiency tables
    const { reflex, fortitude, will, ...skills } = proficiencies ?? {};

    const savingThrowProficiencies =
      this.characterClassSavingThrowProficienciesRepository.create({
        reflex: reflex ?? null,
        fortitude: fortitude ?? null,
        will: will ?? null,
        id: characterClass.id,
      });

    const skillProficiencies =
      this.characterClassSkillProficienciesRepository.create({
        ...skills,
        id: characterClass.id,
      });

    // Save all entities in parallel, first character class, then the rest
    return this.characterClassRepository
      .save(characterClass)
      .then((savedClass) => {
        return Promise.all([
          this.characterClassProgressionTableRepository.save(
            progressionTableEntities,
          ),
          this.characterClassSavingThrowProficienciesRepository.save(
            savingThrowProficiencies,
          ),
          this.characterClassSkillProficienciesRepository.save(
            skillProficiencies,
          ),
        ]).then(() => savedClass);
      });
  }

  /**
   * Find all character classes
   * @param raw Whether to return raw data or DTOs (optional)
   * @returns An array of character classes or DTOs
   */
  public findAll(): Promise<CharacterClass[]> {
    return this.characterClassRepository.find({
      where: { active: true },
      relations: [
        'skillProficiencies',
        'savingThrowProficiencies',
        'progressionTable',
      ],
    });
  }

  /**
   * Find a character class by ID
   * @param id The ID of the character class to find
   * @param raw Whether to return raw data or DTO (optional)
   * @returns The found character class or DTO
   */
  public findOne(id: string): Promise<CharacterClass> {
    return this.characterClassRepository
      .findOne({
        where: { id, active: true },
        relations: [
          'skillProficiencies',
          'savingThrowProficiencies',
          'progressionTable',
        ],
      })
      .then((characterClass) => {
        if (!characterClass) {
          throw new Error(`Character class with ID ${id} not found`);
        }
        return characterClass;
      });
  }

  /**
   * Update a character class by ID
   * @param id The ID of the character class to update
   * @param updateCharacterClassDto The updated character class data
   * @returns The updated character class
   */
  public update(
    id: string,
    updateCharacterClassDto: UpdateCharacterClassDto,
  ): Promise<CharacterClass> {
    const { progressionTable, proficiencies, ...characterClassData } =
      updateCharacterClassDto;

    // Find the existing character class
    return this.characterClassRepository
      .findOne({ where: { id } })
      .then((characterClass) => {
        if (!characterClass) {
          throw new Error(`Character class with ID ${id} not found`);
        }

        // Update character class data
        Object.assign(characterClass, characterClassData);

        // Save updated character class
        return this.characterClassRepository
          .save(characterClass)
          .then((updatedClass) => {
            const promises = [];

            // Update progression table if provided
            if (progressionTable) {
              promises.push(
                this.updateProgressionTable(updatedClass.id, progressionTable),
              );
            }

            // Update skill proficiencies if provided
            if (proficiencies) {
              const { reflex, fortitude, will, ...skills } = proficiencies;

              promises.push(
                this.updateSkillProficiencies(updatedClass.id, skills),
              );

              promises.push(
                this.updateSavingThrowProficiencies(updatedClass.id, {
                  reflex,
                  fortitude,
                  will,
                }),
              );
            }

            // Wait for all updates to complete
            return Promise.all(promises)
              .then((results) => {
                // Extract results
                const progressionTableResult = (results[0] ||
                  []) as CharacterClassProgressionTable[];
                const skillProficienciesResult =
                  results[1] as CharacterClassSkillProficiencies;
                const savingThrowProficienciesResult =
                  results[2] as CharacterClassSavingThrowProficiencies;

                // Assign results to the updated class
                updatedClass.progressionTable = progressionTableResult;
                updatedClass.skillProficiencies = skillProficienciesResult;
                updatedClass.savingThrowProficiencies =
                  savingThrowProficienciesResult;

                return updatedClass;
              })
              .catch((error) => {
                throw new Error(`Failed to update character class: ${error}`);
              });
          });
      });
  }

  /**
   * Deactivate a character class by ID
   * @param id The ID of the character class to deactivate
   * @returns A message indicating the deactivation status
   */
  public remove(id: string): Promise<string> {
    return this.update(id, { active: false }).then(() => {
      return `Character Class with ID ${id} has been deactivated.`;
    });
  }

  /**
   * Update the progression table for a character class
   * @param classId The ID of the character class
   * @param progressionTable The updated progression table entries
   * @returns The updated progression table entries
   */
  private async updateProgressionTable(
    classId: string,
    progressionTable: UpdateCharacterClassProgressionTableDto[],
  ): Promise<CharacterClassProgressionTable[]> {
    const currentTable =
      await this.characterClassProgressionTableRepository.find({
        where: { class: { id: classId } },
      });

    const updatedTable: Promise<CharacterClassProgressionTable>[] = [];

    for (const entry of progressionTable) {
      const existingEntry = currentTable.find((e) => e.level === entry.level);
      if (existingEntry) {
        // Update existing entry
        Object.assign(existingEntry, entry);

        console.log(existingEntry);
        updatedTable.push(
          this.characterClassProgressionTableRepository.save(existingEntry),
        );
      } else {
        // Create new entry
        const newEntry = this.characterClassProgressionTableRepository.create({
          ...entry,
          id: uuidv4(),
          class: { id: classId },
        });

        console.log(newEntry);
        updatedTable.push(
          this.characterClassProgressionTableRepository.save(newEntry),
        );
      }
    }

    return Promise.all(updatedTable);
  }

  /**
   * Update skill proficiencies for a character class
   * @param classId The ID of the character class
   * @param proficiencies The updated skill proficiencies
   * @returns The updated skill proficiencies entity
   */
  private async updateSkillProficiencies(
    classId: string,
    proficiencies: DeepPartial<CharacterClassSkillProficiencies>,
  ): Promise<CharacterClassSkillProficiencies> {
    const existingProficiencies =
      await this.characterClassSkillProficienciesRepository.findOne({
        where: { id: classId },
      });

    if (!existingProficiencies) {
      throw new Error(`Skill proficiencies for class ID ${classId} not found`);
    }

    // Update existing proficiencies
    const { id, ...data } = proficiencies;
    Object.assign(existingProficiencies, data);

    return this.characterClassSkillProficienciesRepository
      .update({ id: existingProficiencies.id }, existingProficiencies)
      .then((result) => result.raw[0] as CharacterClassSkillProficiencies);
  }

  /**
   * Update saving throw proficiencies for a character class
   * @param classId The ID of the character class
   * @param proficiencies The updated saving throw proficiencies
   * @returns The updated saving throw proficiencies entity
   */
  private async updateSavingThrowProficiencies(
    classId: string,
    proficiencies: DeepPartial<CharacterClassSavingThrowProficiencies>,
  ): Promise<CharacterClassSavingThrowProficiencies> {
    const existingProficiencies =
      await this.characterClassSavingThrowProficienciesRepository.findOne({
        where: { id: classId },
      });

    if (!existingProficiencies) {
      throw new Error(
        `Saving throw proficiencies for class ID ${classId} not found`,
      );
    }

    // Update existing proficiencies
    const { id, ...data } = proficiencies;
    Object.assign(existingProficiencies, data);

    return this.characterClassSavingThrowProficienciesRepository
      .update({ id: existingProficiencies.id }, existingProficiencies)
      .then(
        (result) => result.raw[0] as CharacterClassSavingThrowProficiencies,
      );
  }
}
