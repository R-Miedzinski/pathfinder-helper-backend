import { Test, TestingModule } from '@nestjs/testing';
import { CharacterClassService } from './character-class.service';
import { Repository } from 'typeorm';
import { CharacterClass } from './entities/character-class.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  CharacterClassSavingThrowProficiencies,
  CharacterClassSkillProficiencies,
} from './entities/chracter-class_proficiencies.entity';
import { CharacterClassProgressionTable } from './entities/character-class_progression-table.entity';
import { CreateCharacterClassDto } from './dto/create-character-class.dto';
import { CharacterClassDto } from './dto/character-class.dto';

jest.mock('uuid', () => ({
  v4: jest.fn().mockImplementation(() => '1234'),
}));

describe('CharacterClassService', () => {
  let service: CharacterClassService;
  let characterClassRepository: Repository<CharacterClass>;
  let characterClassSkillProficienciesRepository: Repository<CharacterClassSkillProficiencies>;
  let characterClassSavingThrowProficienciesRepository: Repository<CharacterClassSavingThrowProficiencies>;
  let characterClassProgressionTableRepository: Repository<CharacterClassProgressionTable>;

  const chracterClassRepositoryMock = {
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const characterClassSkillProficienciesRepositoryMock = {
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const characterClassSavingThrowProficienciesRepositoryMock = {
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const characterClassProgressionTableRepositoryMock = {
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterClassService,
        {
          provide: getRepositoryToken(CharacterClass),
          useValue: chracterClassRepositoryMock,
        },
        {
          provide: getRepositoryToken(CharacterClassSkillProficiencies),
          useValue: characterClassSkillProficienciesRepositoryMock,
        },
        {
          provide: getRepositoryToken(CharacterClassSavingThrowProficiencies),
          useValue: characterClassSavingThrowProficienciesRepositoryMock,
        },
        {
          provide: getRepositoryToken(CharacterClassProgressionTable),
          useValue: characterClassProgressionTableRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CharacterClassService>(CharacterClassService);

    characterClassRepository = module.get<Repository<CharacterClass>>(
      getRepositoryToken(CharacterClass),
    );

    characterClassSkillProficienciesRepository = module.get<
      Repository<CharacterClassSkillProficiencies>
    >(getRepositoryToken(CharacterClassSkillProficiencies));

    characterClassSavingThrowProficienciesRepository = module.get<
      Repository<CharacterClassSavingThrowProficiencies>
    >(getRepositoryToken(CharacterClassSavingThrowProficiencies));

    characterClassProgressionTableRepository = module.get<
      Repository<CharacterClassProgressionTable>
    >(getRepositoryToken(CharacterClassProgressionTable));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#create', () => {
    it('should create a new character class', async () => {
      const dto = { name: 'Warrior' } as CreateCharacterClassDto;
      const createdClass = {
        ...dto,
        id: '1234',
        active: true,
      } as unknown as CharacterClass;

      jest
        .spyOn(characterClassRepository, 'create')
        .mockImplementation((item) => item as CharacterClass);
      jest
        .spyOn(characterClassRepository, 'save')
        .mockImplementation(
          (item) => Promise.resolve(item) as Promise<CharacterClass>,
        );

      const result = await service.create(dto);

      expect(result).toEqual({
        ...createdClass,
        dateCreated: expect.any(Date),
      });
      expect(characterClassRepository.create).toHaveBeenCalledWith({
        ...createdClass,
        dateCreated: expect.any(Date),
      });
      expect(characterClassRepository.save).toHaveBeenCalledWith({
        ...createdClass,
        dateCreated: expect.any(Date),
      });
    });
  });

  describe('#findAll', () => {
    it('should return all character classes as Dto', async () => {
      const classes = [
        { id: '1234', name: 'Warrior' },
      ] as unknown as CharacterClass[];

      jest.spyOn(characterClassRepository, 'find').mockResolvedValue(classes);

      const result = await service.findAll();

      expect(result).toEqual(classes);
      expect(characterClassRepository.find).toHaveBeenCalledWith({
        where: { active: true },
        relations: [
          'skillProficiencies',
          'savingThrowProficiencies',
          'progressionTable',
        ],
      });
    });
  });

  describe('#findOne', () => {
    it('should return a character class by id', async () => {
      const id = '1234';
      const characterClass = {
        id,
        name: 'Warrior',
      } as unknown as CharacterClass;

      jest
        .spyOn(characterClassRepository, 'findOne')
        .mockResolvedValue(characterClass);

      const result = await service.findOne(id);

      expect(result).toEqual(characterClass);
      expect(characterClassRepository.findOne).toHaveBeenCalledWith({
        where: { active: true, id },
        relations: [
          'skillProficiencies',
          'savingThrowProficiencies',
          'progressionTable',
        ],
      });
    });
  });

  describe('#update', () => {
    it('should update a character class by id', async () => {
      const id = '1234';
      const updateDto = { name: 'Updated Warrior' } as CreateCharacterClassDto;
      const updatedClass = {
        ...updateDto,
        id,
        active: true,
      } as unknown as CharacterClass;

      jest
        .spyOn(characterClassRepository, 'findOne')
        .mockResolvedValue(updatedClass);
      jest
        .spyOn(characterClassRepository, 'save')
        .mockResolvedValue(updatedClass);

      const result = await service.update(id, updateDto);

      expect(result).toEqual(updatedClass);
      expect(characterClassRepository.findOne).toHaveBeenCalledWith({
        where: { active: true, id },
      });
      expect(characterClassRepository.save).toHaveBeenCalledWith({
        ...updatedClass,
        dateCreated: expect.any(Date),
      });
    });
  });

  describe('#remove', () => {
    it('should deactivate a character class by id', async () => {
      const id = '1234';
      const characterClass = {
        id,
        name: 'Warrior',
        active: true,
      } as unknown as CharacterClass;

      service.update = jest.fn().mockImplementation(
        (id, update) =>
          Promise.resolve({
            ...characterClass,
            ...update,
          }) as unknown as Promise<CharacterClass>,
      );

      const result = await service.remove(id);

      expect(result).toEqual(
        `Character Class with ID ${characterClass.id} has been deactivated`,
      );
      expect(service.findOne).toHaveBeenCalledWith(id, { active: false });
    });
  });
});
