import { Test, TestingModule } from '@nestjs/testing';
import { RaceService } from './race.service';
import { Repository } from 'typeorm';
import { Race } from './entities/race.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRaceDto } from './dto/create-race.dto';

jest.mock('uuid', () => ({
  v4: jest.fn().mockImplementation(() => '1234'),
}));

describe('RaceService', () => {
  let service: RaceService;
  let raceRepository: Repository<Race>;

  const mockRaceRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RaceService,
        {
          provide: getRepositoryToken(Race),
          useValue: mockRaceRepository,
        },
      ],
    }).compile();

    service = module.get<RaceService>(RaceService);
    raceRepository = module.get<Repository<Race>>(getRepositoryToken(Race));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new race', () => {
      const createRaceDto = { name: 'Elf' } as CreateRaceDto;
      const mockRace = {
        ...createRaceDto,
        id: '1234',
        active: true,
        dateCreated: new Date(),
      };

      mockRaceRepository.create.mockReturnValue(mockRace);
      mockRaceRepository.save.mockResolvedValue(mockRace);

      expect(service.create(createRaceDto)).resolves.toEqual({
        ...mockRace,
        dateCreated: expect.any(Date),
      });
      expect(raceRepository.create).toHaveBeenCalledWith({
        ...mockRace,
        dateCreated: expect.any(Date),
      });
      expect(raceRepository.save).toHaveBeenCalledWith({
        ...mockRace,
        dateCreated: expect.any(Date),
      });
    });

    it('should return an error if saving fails', async () => {
      const createRaceDto = { name: 'Elf' } as CreateRaceDto;
      mockRaceRepository.create.mockImplementation((item) => item);
      mockRaceRepository.save.mockResolvedValue(null);

      await expect(service.create(createRaceDto)).rejects.toEqual(
        'Failed to create race with id 1234',
      );
    });
  });

  describe('findAll', () => {
    it('should return all races', async () => {
      const mockRaces = [
        { id: '1', name: 'Elf', active: true, dateCreated: new Date() },
        { id: '2', name: 'Dwarf', active: true, dateCreated: new Date() },
      ];
      mockRaceRepository.find.mockResolvedValue(mockRaces);

      const result = await service.findAll();

      expect(result).toEqual(mockRaces);
      expect(raceRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { active: true },
          relations: ['darkvision', 'traits'],
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return the race with given id', async () => {
      const mockRace = {
        id: '1',
        name: 'Elf',
        active: true,
        dateCreated: new Date(),
      };
      mockRaceRepository.findOne.mockResolvedValue(mockRace);

      const result = await service.findOne('1');

      expect(result).toEqual(mockRace);
      expect(raceRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', active: true },
        relations: ['darkvision', 'traits'],
      });
    });

    it('should return error when no race is not found', async () => {
      mockRaceRepository.findOne.mockResolvedValue(null);

      const result = service.findOne('non-existing-id');

      expect(result).rejects.toThrow('Race with id non-existing-id not found');
    });
  });

  describe('update', () => {
    it('should update a race with provided values', async () => {
      const mockRace = {
        id: '1',
        name: 'Elf',
        active: true,
        dateCreated: new Date(),
      };
      const updateRaceDto = { name: 'Updated Elf' };
      mockRaceRepository.findOne.mockResolvedValue(mockRace);

      mockRaceRepository.save.mockResolvedValue({
        ...mockRace,
        ...updateRaceDto,
      });

      const result = await service.update('1', updateRaceDto);

      expect(result).toEqual({
        ...mockRace,
        ...updateRaceDto,
      });
      expect(raceRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw error if the race is not found', async () => {
      mockRaceRepository.findOne.mockResolvedValue(null);
      const updateRaceDto = { name: 'Updated Elf' };

      const result = service.update('non-existing-id', updateRaceDto);

      expect(result).rejects.toThrow('Race with id non-existing-id not found');
    });
  });

  describe('remove', () => {
    it('should deactivate the race with given id', async () => {
      const mockRace = {
        id: '1',
        name: 'Elf',
        active: true,
        dateCreated: new Date(),
      };
      service.update = jest.fn().mockResolvedValue({
        ...mockRace,
        active: false,
      });

      const result = await service.remove('1');

      expect(result).toEqual(
        `Race with id ${mockRace.id} has been deactivated`,
      );
      expect(service.update).toHaveBeenCalledWith(mockRace.id, {
        active: false,
      });
    });

    it('should throw an error if deactivation fails', async () => {
      service.update = jest
        .fn()
        .mockRejectedValue({ message: 'Error message' });

      const result = service.remove('non-existing-id');

      expect(result).rejects.toThrow(
        'Failed to deactivate race with id non-existing-id: Error message',
      );
    });
  });
});
