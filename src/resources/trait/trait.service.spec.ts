import { Test, TestingModule } from '@nestjs/testing';
import { TraitService } from './trait.service';
import { Repository } from 'typeorm';
import { Trait } from './entities/trait.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ETraitContext } from 'src/common/enums/trait-context.enum';

describe('TraitService', () => {
  let service: TraitService;
  let repository: Repository<Trait>;

  // Mock repository
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TraitService,
        {
          provide: getRepositoryToken(Trait), // Provide the mock repository
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TraitService>(TraitService);
    repository = module.get<Repository<Trait>>(getRepositoryToken(Trait));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize the contextToKeyMap', () => {
    expect(service['contextToKeyMap']).toEqual({
      [ETraitContext.DEFAULT]: 'default_description',
      [ETraitContext.FEAT]: 'feat_description',
      [ETraitContext.ITEM]: 'item_description',
      [ETraitContext.CLASS]: 'class_description',
      [ETraitContext.SPELL]: 'spell_description',
      [ETraitContext.ACTION]: 'action_description',
      [ETraitContext.RACE]: 'race_description',
    });
  });

  describe('#create', () => {
    it('should create a trait', async () => {
      expect(true).toBe(true); // Placeholder for actual test
    });
  });

  describe('#findAll', () => {
    it('should return an array of traits', async () => {
      const result = [new Trait()];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
      expect(repository.find).toHaveBeenCalledWith({ where: { active: true } });
    });
  });

  describe('#findOne', () => {
    it('should return a trait if found', async () => {
      const trait = new Trait();
      trait.id = '1';
      trait.name = 'Test Trait';
      trait.active = true;
      jest.spyOn(repository, 'findOne').mockResolvedValue(trait);

      expect(await service.findOne('1')).toBe(trait);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1', active: true },
      });
    });

    it('should return null if not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      expect(await service.findOne('1')).toBe(null);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1', active: true },
      });
    });
  });

  describe('#findOneByContext', () => {
    it('should return a TraitDtio with the correct context if found', async () => {
      const trait = new Trait();
      trait.id = '1';
      trait.name = 'Test Trait';
      trait.default_description = 'Default Description';
      trait.feat_description = 'Feat Description';
      jest.spyOn(service, 'findOne').mockResolvedValue(trait);

      const result = await service.findOneByContext('1', ETraitContext.FEAT);

      expect(result).toEqual({
        id: '1',
        name: 'Test Trait',
        description: 'Feat Description',
        context: ETraitContext.FEAT,
      });
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should return null if not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      expect(await service.findOneByContext('1', ETraitContext.DEFAULT)).toBe(
        null,
      );
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should return a TraitDto with default description if context is not found', async () => {
      const trait = new Trait();
      trait.id = '1';
      trait.name = 'Test Trait';
      trait.default_description = 'Default Description';
      trait.feat_description = null; // Simulating a missing context
      jest.spyOn(service, 'findOne').mockResolvedValue(trait);

      const result = await service.findOneByContext('1', ETraitContext.FEAT);

      expect(result).toEqual({
        id: '1',
        name: 'Test Trait',
        description: 'Default Description',
        context: ETraitContext.FEAT,
      });
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('#update', () => {
    it('should update a trait', async () => {
      const trait = new Trait();
      trait.id = '1';
      trait.name = 'Trait Name';
      jest.spyOn(repository, 'findOne').mockResolvedValue(trait);
      jest
        .spyOn(repository, 'save')
        .mockImplementation(async (item: Trait) => Promise.resolve(item));
      const newName = 'New Trait Name';

      const result = await service.update('1', { name: newName });

      expect(repository.save).toHaveBeenCalledWith({
        ...trait,
        name: newName,
      });
      expect(result).toEqual({
        id: '1',
        name: newName,
      });
    });
  });

  describe('#remove', () => {
    it('should deactivate a trait', async () => {
      const trait = new Trait();
      trait.id = '1';
      trait.name = 'Trait Name';
      trait.active = true;
      jest.spyOn(service, 'findOne').mockResolvedValue(trait);
      jest
        .spyOn(service, 'update')
        .mockImplementation(async (id: string, updateTraitDto: any) =>
          Promise.resolve({ ...trait, ...updateTraitDto }),
        );

      const result = await service.remove('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(service.update).toHaveBeenCalledWith('1', { active: false });
      expect(result).toEqual('Trait with ID 1 has been deactivated');
    });

    it('should throw an error if the trait is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(
        'Trait with ID 1 not found',
      );
    });
  });
});
