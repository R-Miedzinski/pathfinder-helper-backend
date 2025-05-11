import { Test, TestingModule } from '@nestjs/testing';
import { ActionService } from './action.service';
import { TraitService } from '../trait/trait.service';
import { Action } from './entities/action.entity';
import { ActionTrait } from './entities/action_trait.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateActionDto } from './dto/create-action.dto';
import { ActionDto } from './dto/action.dto';
import { ETraitContext } from 'src/common/enums/trait-context.enum';

jest.mock('src/common/functions/helpers', () => ({
  transformUndefinedToNull: jest
    .fn()
    .mockImplementation((data, constructor) => data),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockImplementation(() => '1234'),
}));

describe('ActionService', () => {
  let service: ActionService;
  let actionRepository: Repository<Action>;
  let actionTraitRepository: Repository<ActionTrait>;
  let traitService: TraitService;

  const mockActionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockActionTraitRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockTraitService = {
    toDtoWithContext: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionService,
        {
          provide: getRepositoryToken(Action),
          useValue: mockActionRepository,
        },
        {
          provide: getRepositoryToken(ActionTrait),
          useValue: mockActionTraitRepository,
        },
        { provide: TraitService, useValue: mockTraitService },
      ],
    }).compile();

    service = module.get<ActionService>(ActionService);
    actionRepository = module.get<Repository<Action>>(
      getRepositoryToken(Action),
    );
    actionTraitRepository = module.get<Repository<ActionTrait>>(
      getRepositoryToken(ActionTrait),
    );
    traitService = module.get<TraitService>(TraitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#create', () => {
    it('should create and save an action', async () => {
      const createActionDto = {
        name: 'Test Action',
        traits: ['trait1', 'trait2'],
      } as unknown as CreateActionDto;
      const action = { ...createActionDto, id: '1234' } as unknown as Action;
      jest
        .spyOn(actionRepository, 'create')
        .mockImplementation((item) => item as unknown as Action);
      jest.spyOn(actionRepository, 'save').mockResolvedValue(action);

      const result = await service.create(createActionDto);

      expect(result).toEqual(action);
      expect(actionRepository.create).toHaveBeenCalledWith({
        ...action,
        traits: [],
        dateCreated: expect.any(Date),
        active: true,
      });
      expect(actionRepository.save).toHaveBeenCalledWith({
        ...action,
        traits: [],
        dateCreated: expect.any(Date),
        active: true,
      });
      expect(actionTraitRepository.create).toHaveBeenCalledWith({
        action_id: '1234',
        trait_id: 'trait1',
      });
      expect(actionTraitRepository.create).toHaveBeenCalledWith({
        action_id: '1234',
        trait_id: 'trait2',
      });
    });
  });

  describe('#findAll', () => {
    it('should find all actions', async () => {
      const actions = [
        { id: '1234', name: 'Test Action' },
      ] as unknown as Action[];
      jest.spyOn(actionRepository, 'find').mockResolvedValue(actions);

      const result = await service.findAll();

      expect(result).toEqual(actions);
      expect(actionRepository.find).toHaveBeenCalledWith({
        where: { active: true },
        relations: ['traits'],
      });
    });
  });

  describe('#findAllWithContext', () => {
    it('should find all actions and transform traits to DTOs', async () => {
      const actions = [
        { id: '1234', name: 'Test Action', traits: ['1234'] },
      ] as unknown as Action[];
      jest.spyOn(service, 'findAll').mockResolvedValue(actions);
      jest.spyOn(traitService, 'toDtoWithContext').mockReturnValue({
        id: '1234',
        name: 'mock trait',
        description: 'mock action desc',
        context: ETraitContext.ACTION,
      });
      const actionDto = {
        id: '1234',
        name: 'Test Action',
        traits: [
          {
            id: '1234',
            name: 'mock trait',
            description: 'mock action desc',
            context: ETraitContext.ACTION,
          },
        ],
      } as unknown as ActionDto[];

      const result = await service.findAllWithContext();

      expect(result).toEqual([actionDto]);
      expect(service.findAll).toHaveBeenCalled();
      expect(traitService.toDtoWithContext).toHaveBeenCalledWith(
        '1234',
        ETraitContext.ACTION,
      );
    });
  });

  describe('#findOne', () => {
    it('should find an action by ID', async () => {
      const action = { id: '1234', name: 'Test Action' } as unknown as Action;
      jest.spyOn(actionRepository, 'findOne').mockResolvedValue(action);

      const result = await service.findOne('1234');

      expect(result).toEqual(action);
      expect(actionRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1234', active: true },
        relations: ['traits'],
      });
    });
  });

  describe('#findOneWithContext', () => {
    it('should find an action by ID and transform traits to DTOs', async () => {
      const action = {
        id: '1234',
        name: 'Test Action',
        traits: ['1234'],
      } as unknown as Action;
      jest.spyOn(service, 'findOne').mockResolvedValue(action);
      jest.spyOn(traitService, 'toDtoWithContext').mockReturnValue({
        id: '1234',
        name: 'mock trait',
        description: 'mock action desc',
        context: ETraitContext.ACTION,
      });
      const actionDto = {
        id: '1234',
        name: 'Test Action',
        traits: [
          {
            id: '1234',
            name: 'mock trait',
            description: 'mock action desc',
            context: ETraitContext.ACTION,
          },
        ],
      } as unknown as ActionDto;

      const result = await service.findOneWithContext('1234');

      expect(result).toEqual(actionDto);
      expect(service.findOne).toHaveBeenCalledWith('1234');
      expect(traitService.toDtoWithContext).toHaveBeenCalledWith(
        '1234',
        ETraitContext.ACTION,
      );
    });
  });

  describe('#update', () => {
    it('should update an action by ID', async () => {
      const action = {
        id: '1234',
        name: 'Test Action',
        traits: [],
      } as unknown as Action;
      const updateActionDto = { name: 'Updated Action' };
      jest.spyOn(actionRepository, 'findOne').mockResolvedValue(action);
      jest.spyOn(actionRepository, 'save').mockResolvedValue({
        ...action,
        ...updateActionDto,
      });

      const result = await service.update('1234', updateActionDto);

      expect(result).toEqual({
        ...action,
        ...updateActionDto,
      });
      expect(actionRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1234' },
        relations: ['traits'],
      });
      expect(actionRepository.save).toHaveBeenCalledWith({
        ...action,
        ...updateActionDto,
      });
    });
  });

  describe('#remove', () => {
    it('should deactivate an action by ID', async () => {
      const action = {
        id: '1234',
        name: 'Test Action',
        active: true,
      } as unknown as Action;
      jest.spyOn(service, 'update').mockImplementation(
        (id, update) =>
          Promise.resolve({
            ...action,
            ...update,
          }) as unknown as Promise<Action>,
      );

      const result = await service.remove('1234');

      expect(result).toEqual(
        `Action with id ${action.id} has been deactivated`,
      );
      expect(service.update).toHaveBeenCalledWith('1234', { active: false });
    });
  });
});
