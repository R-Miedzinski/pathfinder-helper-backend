import { Test, TestingModule } from '@nestjs/testing';
import { FeatController } from './feat.controller';
import { FeatService } from './feat.service';
import { CreateFeatDto } from './dto/create-feat.dto';

describe('FeatController', () => {
  let controller: FeatController;

  let featServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatController],
      providers: [
        {
          provide: FeatService,
          useValue: featServiceMock,
        },
      ],
    }).compile();

    controller = module.get<FeatController>(FeatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call featService.create with the correct parameters', async () => {
      const createFeatDto = { name: 'Test Feat' } as CreateFeatDto;

      await controller.create(createFeatDto);

      expect(featServiceMock.create).toHaveBeenCalledWith(createFeatDto);
    });
  });

  describe('findAll', () => {
    it('should call featService.findAll', async () => {
      await controller.findAll();

      expect(featServiceMock.findAll).toHaveBeenCalledWith();
    });

    it('should call featService.findAll with search parameters', async () => {
      const search = JSON.stringify({ name: 'Test' });

      await controller.findAll(search);

      expect(featServiceMock.findAll).toHaveBeenCalledWith(JSON.parse(search));
    });
  });

  describe('findOne', () => {
    it('should call featService.findOne with the correct id', async () => {
      const id = '123';

      await controller.findOne(id);

      expect(featServiceMock.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call featService.update with the correct parameters', async () => {
      const id = '123';
      const updateFeatDto = { name: 'Updated Feat' };

      await controller.update(id, updateFeatDto);

      expect(featServiceMock.update).toHaveBeenCalledWith(id, updateFeatDto);
    });
  });

  describe('remove', () => {
    it('should call featService.remove with the correct id', async () => {
      const id = '123';

      await controller.remove(id);

      expect(featServiceMock.remove).toHaveBeenCalledWith(id);
    });
  });
});
