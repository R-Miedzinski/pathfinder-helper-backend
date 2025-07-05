import { Test, TestingModule } from '@nestjs/testing';
import { BackgroundController } from './background.controller';
import { BackgroundService } from './background.service';
import { CreateBackgroundDto } from './dto/create-background.dto';

describe('BackgroundController', () => {
  let controller: BackgroundController;
  let backgroundService: BackgroundService;

  const mockBackgroundService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackgroundController],
      providers: [
        { provide: BackgroundService, useValue: mockBackgroundService },
      ],
    }).compile();

    controller = module.get<BackgroundController>(BackgroundController);
    backgroundService = module.get<BackgroundService>(BackgroundService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call create method of BackgroundService', async () => {
      const createBackgroundDto = {
        name: 'Test Background',
      } as CreateBackgroundDto;

      await controller.create(createBackgroundDto);

      expect(backgroundService.create).toHaveBeenCalledWith(
        createBackgroundDto,
      );
    });
  });

  describe('findAll', () => {
    it('should call findAll method of BackgroundService', async () => {
      await controller.findAll();

      expect(backgroundService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call findOne method of BackgroundService with correct id', async () => {
      const id = '123';
      await controller.findOne(id);

      expect(backgroundService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call update method of BackgroundService with correct id and dto', async () => {
      const id = '123';
      const updateBackgroundDto = { name: 'Updated Background' };

      await controller.update(id, updateBackgroundDto);

      expect(backgroundService.update).toHaveBeenCalledWith(
        id,
        updateBackgroundDto,
      );
    });
  });

  describe('remove', () => {
    it('should call remove method of BackgroundService with correct id', async () => {
      const id = '123';
      await controller.remove(id);

      expect(mockBackgroundService.remove).toHaveBeenCalledWith(id);
    });
  });
});
