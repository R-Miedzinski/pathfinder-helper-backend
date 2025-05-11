import { Test, TestingModule } from '@nestjs/testing';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { Action } from './entities/action.entity';
import { ActionDto } from './dto/action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

describe('ActionController', () => {
  let controller: ActionController;
  let service: ActionService;

  const mockActionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllWithContext: jest.fn(),
    findOne: jest.fn(),
    findOneWithContext: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionController],
      providers: [
        {
          provide: ActionService,
          useValue: mockActionService,
        },
      ],
    }).compile();

    controller = module.get<ActionController>(ActionController);
    service = module.get<ActionService>(ActionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#create', () => {
    it('should call the create method of the service', async () => {
      const createActionDto = {
        name: 'Test Action',
      } as unknown as CreateActionDto;
      const action = { ...createActionDto, id: '1' } as unknown as Action;
      jest.spyOn(service, 'create').mockResolvedValue(action);

      const result = await controller.create(createActionDto);

      expect(result).toEqual(action);
      expect(service.create).toHaveBeenCalledWith(createActionDto);
    });
  });

  describe('#findAll', () => {
    it('should call the findAllWithContext method of the service by default', async () => {
      const actions = [
        { id: '1', name: 'Test Action' },
      ] as unknown as ActionDto[];
      jest.spyOn(service, 'findAllWithContext').mockResolvedValue(actions);

      const result = await controller.findAll();

      expect(result).toEqual(actions);
      expect(service.findAllWithContext).toHaveBeenCalled();
      expect(service.findAll).not.toHaveBeenCalled();
    });

    it('should call the findAll method of the service when raw is true', async () => {
      const actions = [{ id: '1', name: 'Test Action' }] as unknown as Action[];
      jest.spyOn(service, 'findAll').mockResolvedValue(actions);

      const result = await controller.findAll('true');

      expect(result).toEqual(actions);
      expect(service.findAllWithContext).not.toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('#findOne', () => {
    it('should call the findOneWithContext method of the service by default', async () => {
      const action = { id: '1', name: 'Test Action' } as unknown as ActionDto;
      jest.spyOn(service, 'findOneWithContext').mockResolvedValue(action);

      const result = await controller.findOne('1');

      expect(result).toEqual(action);
      expect(service.findOneWithContext).toHaveBeenCalledWith('1');
      expect(service.findOne).not.toHaveBeenCalled();
    });

    it('should call the findOne method of the service when raw is true', async () => {
      const action = { id: '1', name: 'Test Action' } as unknown as Action;
      jest.spyOn(service, 'findOne').mockResolvedValue(action);

      const result = await controller.findOne('1', 'true');

      expect(result).toEqual(action);
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(service.findOneWithContext).not.toHaveBeenCalled();
    });
  });

  describe('#update', () => {
    it('should call the update method of the service', async () => {
      const updateActionDto = {
        name: 'Updated Action',
      } as unknown as UpdateActionDto;
      const action = { ...updateActionDto, id: '1' } as unknown as Action;
      jest.spyOn(service, 'update').mockResolvedValue(action);

      const result = await controller.update('1', updateActionDto);

      expect(result).toEqual(action);
      expect(service.update).toHaveBeenCalledWith('1', updateActionDto);
    });
  });

  describe('#remove', () => {
    it('should call the remove method of the service', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue('action removed');

      const result = await controller.remove('1');

      expect(result).toEqual('action removed');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
