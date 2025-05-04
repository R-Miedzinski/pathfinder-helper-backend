import { Test, TestingModule } from '@nestjs/testing';
import { SpellController } from './spell.controller';
import { SpellService } from './spell.service';
import { find } from 'rxjs';
import { Spell } from './entities/spell.entity';
import { CreateSpellDto } from './dto/create-spell.dto';
import { SpellDto } from './dto/spell.dto';

describe('SpellController', () => {
  let controller: SpellController;
  let service: SpellService;

  // Mock service
  const mockSpellService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllWithContext: jest.fn(),
    findOne: jest.fn(),
    findOneWithContext: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks(); // Clear all mocks before each test

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpellController],
      providers: [
        {
          provide: SpellService,
          useValue: mockSpellService,
        },
      ],
    }).compile();

    controller = module.get<SpellController>(SpellController);
    service = module.get<SpellService>(SpellService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#create', () => {
    it('should call the create method of the service', async () => {
      const createSpellDto = { name: 'Fireball' } as unknown as CreateSpellDto;
      const spell = { ...createSpellDto, id: '1' } as unknown as Spell;
      jest.spyOn(service, 'create').mockResolvedValue(spell);

      const result = await controller.create(createSpellDto);

      expect(result).toEqual(spell);
      expect(service.create).toHaveBeenCalledWith(createSpellDto);
    });
  });

  describe('#findAll', () => {
    it('should call the findAllWithContext method of the service by default', async () => {
      const spells = [{ id: '1', name: 'Fireball' }] as unknown as Spell[];
      const spellsDto = [
        { id: '1', name: 'Fireball' },
      ] as unknown as SpellDto[];
      jest.spyOn(service, 'findAll').mockResolvedValue(spells);
      jest.spyOn(service, 'findAllWithContext').mockResolvedValue(spellsDto);

      const result = await controller.findAll();

      expect(result).toEqual(spellsDto);
      expect(service.findAll).not.toHaveBeenCalled();
      expect(service.findAllWithContext).toHaveBeenCalled();
    });

    it('should call the findAll method of the service when raw parameter is true', async () => {
      const spells = [{ id: '1', name: 'Fireball' }] as unknown as Spell[];
      const spellsDto = [
        { id: '1', name: 'Fireball' },
      ] as unknown as SpellDto[];
      jest.spyOn(service, 'findAll').mockResolvedValue(spells);
      jest.spyOn(service, 'findAllWithContext').mockResolvedValue(spellsDto);

      const result = await controller.findAll('true');

      expect(result).toEqual(spells);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAllWithContext).not.toHaveBeenCalled();
    });
  });

  describe('#findOne', () => {
    it('should call the findOneWithContext method of the service by default', async () => {
      const spell = { id: '1', name: 'Fireball' } as unknown as Spell;
      const spellDto = { id: '1', name: 'Fireball' } as unknown as SpellDto;
      jest.spyOn(service, 'findOne').mockResolvedValue(spell);
      jest.spyOn(service, 'findOneWithContext').mockResolvedValue(spellDto);

      const result = await controller.findOne('1');

      expect(result).toEqual(spellDto);
      expect(service.findOne).not.toHaveBeenCalled();
      expect(service.findOneWithContext).toHaveBeenCalledWith('1');
    });

    it('should call the findOne method of the service when raw parameter is true', async () => {
      const spell = { id: '1', name: 'Fireball' } as unknown as Spell;
      const spellDto = { id: '1', name: 'Fireball' } as unknown as SpellDto;
      jest.spyOn(service, 'findOne').mockResolvedValue(spell);
      jest.spyOn(service, 'findOneWithContext').mockResolvedValue(spellDto);

      const result = await controller.findOne('1', 'true');

      expect(result).toEqual(spell);
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(service.findOneWithContext).not.toHaveBeenCalled();
    });
  });

  describe('#update', () => {
    it('should call the update method of the service', async () => {
      const updateSpellDto = { name: 'Fireball' } as unknown as CreateSpellDto;
      const spell = { ...updateSpellDto, id: '1' } as unknown as Spell;
      jest.spyOn(service, 'update').mockResolvedValue(spell);

      const result = await controller.update('1', updateSpellDto);

      expect(result).toEqual(spell);
      expect(service.update).toHaveBeenCalledWith('1', updateSpellDto);
    });
  });

  describe('#remove', () => {
    it('should call the remove method of the service', async () => {
      const spellId = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(spellId);

      const result = await controller.remove(spellId);

      expect(result).toEqual(spellId);
      expect(service.remove).toHaveBeenCalledWith(spellId);
    });
  });
});
