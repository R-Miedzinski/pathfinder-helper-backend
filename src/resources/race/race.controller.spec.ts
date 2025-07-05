import { Test, TestingModule } from '@nestjs/testing';
import { RaceController } from './race.controller';
import { RaceService } from './race.service';
import { CreateRaceDto } from './dto/create-race.dto';

describe('RaceController', () => {
  let controller: RaceController;
  let raceService: RaceService;

  const mockRaceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RaceController],
      providers: [
        {
          provide: RaceService,
          useValue: mockRaceService,
        },
      ],
    }).compile();

    controller = module.get<RaceController>(RaceController);
    raceService = module.get<RaceService>(RaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call create method of RaceService', async () => {
      const createRaceDto = { name: 'Elf' } as CreateRaceDto;

      await controller.create(createRaceDto);

      expect(raceService.create).toHaveBeenCalledWith(createRaceDto);
    });
  });

  describe('findAll', () => {
    it('should call findAll method of RaceService', async () => {
      await controller.findAll();

      expect(raceService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call findOne method of RaceService with correct id', async () => {
      const id = '123';
      await controller.findOne(id);

      expect(raceService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call update method of RaceService with correct id and dto', async () => {
      const id = '123';
      const updateRaceDto = { name: 'Updated Elf' } as CreateRaceDto;

      await controller.update(id, updateRaceDto);

      expect(raceService.update).toHaveBeenCalledWith(id, updateRaceDto);
    });
  });

  describe('remove', () => {
    it('should call remove method of RaceService with correct id', async () => {
      const id = '123';
      await controller.remove(id);

      expect(raceService.remove).toHaveBeenCalledWith(id);
    });
  });
});
