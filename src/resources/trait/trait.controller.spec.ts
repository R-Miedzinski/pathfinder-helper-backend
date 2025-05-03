import { Test, TestingModule } from '@nestjs/testing';
import { TraitController } from './trait.controller';
import { TraitService } from './trait.service';
import { CreateTraitDto } from './dto/create-trait.dto';
import { Trait } from './entities/trait.entity';

describe('TraitController', () => {
  let controller: TraitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TraitController],
      providers: [
        {
          provide: TraitService,
          useValue: {
            create: jest.fn((dto) => dto), // Mock implementation of the create method
            findAll: jest.fn(() => [new Trait()]),
            findOne: jest.fn((id) => {
              const trait = new Trait();
              trait.id = id;
              return trait;
            }),
            update: jest.fn((id, dto) => {
              const trait = new Trait();
              trait.id = id;
              Object.assign(trait, dto);
              return trait;
            }),
            remove: jest.fn((id) => {
              return `Trait with ID ${id} has been deactivated`;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<TraitController>(TraitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#create', () => {
    it('should create a trait', async () => {
      const createTraitDto: CreateTraitDto = {
        name: 'Test Trait',
        default_description: 'This is a test trait',
        feat_description: null,
        spell_description: null,
        item_description: null,
        race_description: null,
        action_description: null,
        class_description: null,
        source: 'DEFAULT',
      };

      const result = await controller.create(createTraitDto);

      expect(result).toEqual(createTraitDto);
    });
  });

  describe('#findAll', () => {
    it('should return an array of traits', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([new Trait()]);
    });
  });

  describe('#findOne', () => {
    it('should return a trait by ID', async () => {
      const result = await controller.findOne('1');

      expect(result).toBeInstanceOf(Trait);
      expect(result?.id).toBe('1');
    });
  });

  describe('#update', () => {
    it('should update a trait', async () => {
      const result = await controller.update('1', { name: 'Updated Trait' });

      expect(result).toBeInstanceOf(Trait);
      expect(result?.id).toBe('1');
      expect(result?.name).toBe('Updated Trait');
    });
  });

  describe('#remove', () => {
    it('should deactivate a trait', async () => {
      const result = await controller.remove('1');

      expect(result).toBe('Trait with ID 1 has been deactivated');
    });
  });
});
