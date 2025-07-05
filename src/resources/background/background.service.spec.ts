import { Test, TestingModule } from '@nestjs/testing';
import { BackgroundService } from './background.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Background } from './entities/background.entity';
import { Repository } from 'typeorm';
import { CreateBackgroundDto } from './dto/create-background.dto';

jest.mock('uuid', () => ({
  v4: jest.fn().mockImplementation(() => '1234'),
}));

describe('BackgroundService', () => {
  let service: BackgroundService;
  let backgroundRepository: Repository<Background>;

  const mockBackgroundrepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackgroundService,
        {
          provide: getRepositoryToken(Background),
          useValue: mockBackgroundrepository,
        },
      ],
    }).compile();

    service = module.get<BackgroundService>(BackgroundService);
    backgroundRepository = module.get<Repository<Background>>(
      getRepositoryToken(Background),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new background', async () => {
      const createBackgroundDto = {
        name: 'Test Background',
      } as CreateBackgroundDto;
      const mockBackground = {
        ...createBackgroundDto,
        id: '1234',
        active: true,
        dateCreated: new Date(),
      };

      mockBackgroundrepository.create.mockReturnValue(mockBackground);
      mockBackgroundrepository.save.mockResolvedValue(mockBackground);

      const result = await service.create(createBackgroundDto);

      expect(result).toEqual({
        ...mockBackground,
        dateCreated: expect.any(Date),
      });
      expect(backgroundRepository.create).toHaveBeenCalledWith({
        ...mockBackground,
        dateCreated: expect.any(Date),
      });
      expect(backgroundRepository.save).toHaveBeenCalledWith({
        ...mockBackground,
        dateCreated: expect.any(Date),
      });
    });

    it('should throw an error if saving fails', async () => {
      const createBackgroundDto = {
        name: 'Test Background',
      } as CreateBackgroundDto;
      mockBackgroundrepository.create.mockImplementation((item) => item);
      mockBackgroundrepository.save.mockResolvedValue(null);

      await expect(service.create(createBackgroundDto)).rejects.toEqual(
        'Failed to create background with id 1234',
      );
    });
  });

  describe('findAll', () => {
    it('should return all active backgrounds', async () => {
      const mockBackgrounds = [
        { id: '1', name: 'Background 1', active: true },
        { id: '2', name: 'Background 2', active: true },
      ];
      mockBackgroundrepository.find.mockResolvedValue(mockBackgrounds);

      const result = await service.findAll();

      expect(result).toEqual(mockBackgrounds);
      expect(backgroundRepository.find).toHaveBeenCalledWith({
        where: { active: true },
        relations: ['feat'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a background by id', async () => {
      const mockBackground = { id: '1', name: 'Background 1', active: true };
      mockBackgroundrepository.findOne.mockResolvedValue(mockBackground);

      const result = await service.findOne('1');

      expect(result).toEqual(mockBackground);
      expect(backgroundRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', active: true },
        relations: ['feat'],
      });
    });

    it('should throw an error if background not found', async () => {
      mockBackgroundrepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(
        'Background with id 1 not found',
      );
    });
  });

  describe('update', () => {
    it('should update an existing background', async () => {
      const updateBackgroundDto = { name: 'Updated Background' };
      const mockBackground = { id: '1', name: 'Background 1', active: true };
      mockBackgroundrepository.findOne.mockResolvedValue(mockBackground);
      mockBackgroundrepository.save.mockResolvedValue({
        ...mockBackground,
        ...updateBackgroundDto,
      });

      const result = await service.update('1', updateBackgroundDto);

      expect(result).toEqual({
        ...mockBackground,
        ...updateBackgroundDto,
      });
      expect(backgroundRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(backgroundRepository.save).toHaveBeenCalledWith({
        ...mockBackground,
        ...updateBackgroundDto,
      });
    });

    it('should throw an error if background not found for update', async () => {
      mockBackgroundrepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('1', { name: 'Updated Background' }),
      ).rejects.toThrow('Background with id 1 not found');
    });
  });

  describe('remove', () => {
    it('should deactivate a background by id', async () => {
      const mockBackground = { id: '1', name: 'Background 1', active: true };
      jest.spyOn(service, 'update').mockResolvedValue({
        ...mockBackground,
        active: false,
      } as Background);

      const result = await service.remove('1');

      expect(result).toEqual(
        'Background with id 1 has been successfully deactivated',
      );
      expect(service.update).toHaveBeenCalledWith('1', { active: false });
    });

    it('should throw an error if deactivation fails', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('Failed to deactivate background'));

      await expect(service.remove('1')).rejects.toThrow(
        'Failed to deactivate background',
      );
    });
  });
});
