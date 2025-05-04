import { Test, TestingModule } from '@nestjs/testing';
import { SpellService } from './spell.service';
import { Repository } from 'typeorm';
import { Spell } from './entities/spell.entity';
import { SpellTrait } from './entities/spell_trait.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TraitService } from '../trait/trait.service';
import { transformUndefinedToNull } from 'src/common/functions/helpers';
import { v4 } from 'uuid';
import { CreateSpellDto } from './dto/create-spell.dto';
import { TraitDto } from '../trait/dto/trait.dto';
import { Trait } from '../trait/entities/trait.entity';
import { SpellDto } from './dto/spell.dto';

jest.mock('src/common/functions/helpers', () => ({
  transformUndefinedToNull: jest
    .fn()
    .mockImplementation((data, constructor) => data),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockImplementation(() => '1234'),
}));

describe('SpellService', () => {
  let service: SpellService;
  let spellRepository: Repository<Spell>;
  let spellTraitRepository: Repository<SpellTrait>;
  let traitService: TraitService;

  // Mock repository
  const mockSpellRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  // Mock spell_trait repository
  const mockSpellTraitRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  // Mock trait service
  const mockTraitService = {
    toDtoWithContext: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpellService,
        {
          provide: getRepositoryToken(Spell),
          useValue: mockSpellRepository,
        },
        {
          provide: getRepositoryToken(SpellTrait),
          useValue: mockSpellTraitRepository,
        },
        {
          provide: TraitService,
          useValue: mockTraitService,
        },
      ],
    }).compile();

    service = module.get<SpellService>(SpellService);
    spellRepository = module.get<Repository<Spell>>(getRepositoryToken(Spell));
    spellTraitRepository = module.get<Repository<SpellTrait>>(
      getRepositoryToken(SpellTrait),
    );
    traitService = module.get<TraitService>(TraitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#create', () => {
    it('should create a spell', async () => {
      const createSpellDto: CreateSpellDto = {
        name: 'Test Spell',
        level: 1,
        description: 'Test Description',
        traits: ['trait1', 'trait2'],
      } as CreateSpellDto;

      const spell = {
        ...createSpellDto,
        traits: [],
        id: '1234',
        active: true,
        dateCreated: new Date(),
      } as Spell;

      jest.spyOn(spellRepository, 'create').mockReturnValue(spell);
      jest.spyOn(spellRepository, 'save').mockResolvedValue(spell);

      const result = await service.create(createSpellDto);

      expect(result).toEqual(spell);
      expect(spellRepository.create).toHaveBeenCalledWith({
        ...spell,
        dateCreated: expect.any(Date),
      });
      expect(spellRepository.save).toHaveBeenCalledWith(spell);
      expect(spellTraitRepository.create).toHaveBeenCalledWith({
        spell_id: '1234',
        trait_id: 'trait1',
      });
      expect(spellTraitRepository.create).toHaveBeenCalledWith({
        spell_id: '1234',
        trait_id: 'trait2',
      });
      expect(spellTraitRepository.save).toHaveBeenCalledTimes(2);
    });
  });

  describe('#findAll', () => {
    it('should return an array of spells', async () => {
      const spellArray = [new Spell(), new Spell()];
      jest.spyOn(spellRepository, 'find').mockResolvedValue(spellArray);

      const result = await service.findAll();

      expect(result).toEqual(spellArray);
      expect(spellRepository.find).toHaveBeenCalledWith({
        where: { active: true },
        relations: ['traits'],
      });
    });
  });

  describe('#findAllWithContext', () => {
    it('should return an array of spells with their traits transformed to appropriate DTOs', async () => {
      const spellArray = [new Spell(), new Spell()];
      spellArray[0].traits = [{ id: '1', name: 'Trait 1' } as Trait];
      spellArray[1].traits = [];
      const traitDto = new TraitDto();

      jest.spyOn(spellRepository, 'find').mockResolvedValue(spellArray);
      jest.spyOn(traitService, 'toDtoWithContext').mockReturnValue(traitDto);

      const result = await service.findAllWithContext();

      expect(result).toEqual(
        spellArray.map((spell, idx) => {
          const spellDto = new SpellDto(spell);

          if (idx === 0) {
            spellDto.traits = [traitDto];
          }

          return spellDto;
        }),
      );
      expect(spellRepository.find).toHaveBeenCalled();
    });
  });

  describe('#findOne', () => {
    it('should return a spell if found', async () => {
      const spell = new Spell();
      spell.id = '1';
      spell.name = 'Test Spell';
      spell.active = true;
      jest.spyOn(spellRepository, 'findOne').mockResolvedValue(spell);

      const result = await service.findOne('1');

      expect(result).toEqual(spell);
      expect(spellRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', active: true },
        relations: ['traits'],
      });
    });

    it('should throw an error if not found', async () => {
      jest.spyOn(spellRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(
        'Spell with id 1 not found',
      );

      expect(spellRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', active: true },
        relations: ['traits'],
      });
    });
  });

  describe('#findOneWithContext', () => {
    it('should return a spell with its traits transformed to appropriate DTOs', async () => {
      const spell = new Spell();
      spell.id = '1';
      spell.name = 'Test Spell';
      spell.active = true;
      spell.traits = [{ id: '1', name: 'Trait 1' } as Trait];
      const traitDto = new TraitDto();

      jest.spyOn(spellRepository, 'findOne').mockResolvedValue(spell);
      jest.spyOn(traitService, 'toDtoWithContext').mockReturnValue(traitDto);

      const spellDto = new SpellDto(spell);
      spellDto.traits = [traitDto];

      const result = await service.findOneWithContext('1');

      expect(result).toEqual(spellDto);
    });
  });

  describe('#update', () => {
    it('should update a spell', async () => {
      const spell = new Spell();
      spell.id = '1';
      spell.name = 'Test Spell';
      spell.active = true;
      jest.spyOn(spellRepository, 'findOne').mockResolvedValue(spell);
      jest
        .spyOn(spellRepository, 'save')
        .mockImplementation(async (item: Spell) => Promise.resolve(item));
      const updateSpellDto = { name: 'Updated Spell' };

      const result = await service.update('1', updateSpellDto);

      expect(result).toEqual({
        ...spell,
        traits: [],
        ...updateSpellDto,
      });
    });
  });

  describe('#remove', () => {
    it('should deactivate a spell', async () => {
      const spell = new Spell();
      spell.id = '1';
      spell.name = 'Test Spell';
      spell.active = true;
      jest.spyOn(service, 'findOne').mockResolvedValue(spell);
      jest
        .spyOn(service, 'update')
        .mockImplementation(async (id: string, updateSpellDto: any) =>
          Promise.resolve({ ...spell, ...updateSpellDto }),
        );

      const result = await service.remove('1');

      expect(result).toEqual('Spell with ID 1 has been deactivated');
    });

    it('should throw an error if the spell is not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(null as unknown as Spell);

      await expect(service.remove('1')).rejects.toThrow(
        'Spell with ID 1 not found',
      );
    });
  });
});
