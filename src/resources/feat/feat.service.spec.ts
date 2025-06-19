import { Test, TestingModule } from '@nestjs/testing';
import { FeatService } from './feat.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Feat } from './entities/feat.entity';
import { get } from 'http';
import { FeatProficiencies } from './entities/feat-proficiencies.entity';
import { FeatChoice } from './entities/feat-choice.entity';
import { CreateFeatDto } from './dto/create-feat.dto';
import { createQueryBuilder } from 'typeorm';
import { of } from 'rxjs';
import { create } from 'domain';

jest.mock('uuid', () => ({
  v4: jest.fn().mockImplementation(() => '1234'),
}));

describe('FeatService', () => {
  let service: FeatService;

  let featRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    relation: jest.fn().mockReturnThis(),
    of: jest.fn().mockReturnThis(),
    set: jest.fn(),
    add: jest.fn(),
  };

  let featProficienciesRepositoryMock = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  let featChoiceRepositoryMock = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatService,
        {
          provide: getRepositoryToken(Feat),
          useValue: featRepositoryMock,
        },
        {
          provide: getRepositoryToken(FeatProficiencies),
          useValue: featProficienciesRepositoryMock,
        },
        {
          provide: getRepositoryToken(FeatChoice),
          useValue: featChoiceRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<FeatService>(FeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new feat', async () => {
      const createFeatDto = { name: 'Test Feat' } as CreateFeatDto;
      const expectedFeat = {
        ...createFeatDto,
        id: '1234',
        active: true,
        dateCreated: new Date(),
      };

      featRepositoryMock.save.mockResolvedValue(expectedFeat);

      const result = await service.create(createFeatDto);
      expect(result).toEqual(expectedFeat);
      expect(featRepositoryMock.create).toHaveBeenCalledWith({
        ...expectedFeat,
        dateCreated: expect.any(Date),
      });
      expect(featRepositoryMock.save).toHaveBeenCalledWith({
        ...expectedFeat,
        dateCreated: expect.any(Date),
      });
    });

    it('should handle OneToOne relationships', async () => {
      const createFeatDto = {
        name: 'Test Feat',
        featProficiencies: {},
      } as CreateFeatDto;
      const expectedFeat = {
        ...createFeatDto,
        id: '1234',
        active: true,
        dateCreated: new Date(),
      };

      featRepositoryMock.save.mockResolvedValue(expectedFeat);
      featProficienciesRepositoryMock.save.mockResolvedValue({ id: '1234' });

      const result = await service.create(createFeatDto);
      expect(result).toEqual({
        ...expectedFeat,
        dateCreated: expect.any(Date),
      });
      expect(featProficienciesRepositoryMock.save).toHaveBeenCalled();
      expect(featRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(featRepositoryMock.relation).toHaveBeenCalledWith(
        Feat,
        'featProficiencies',
      );
      expect(featRepositoryMock.of).toHaveBeenCalledWith(expectedFeat);
      expect(featRepositoryMock.set).toHaveBeenCalledWith({ id: '1234' });
    });

    it('should handle OneToMany relationships', async () => {
      const createFeatDto = {
        name: 'Test Feat',
        featChoices: [{}],
      } as CreateFeatDto;
      const expectedFeat = {
        ...createFeatDto,
        id: '1234',
        active: true,
        dateCreated: new Date(),
      };

      featRepositoryMock.save.mockResolvedValue(expectedFeat);
      featChoiceRepositoryMock.save.mockResolvedValue([{ id: '1234' }]);

      const result = await service.create(createFeatDto);
      expect(result).toEqual({
        ...expectedFeat,
        dateCreated: expect.any(Date),
      });
      expect(featChoiceRepositoryMock.save).toHaveBeenCalled();
      expect(featRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(featRepositoryMock.relation).toHaveBeenCalledWith(
        Feat,
        'featChoices',
      );
      expect(featRepositoryMock.of).toHaveBeenCalledWith(expectedFeat);
      expect(featRepositoryMock.add).toHaveBeenCalledWith(['1234']);
    });
  });

  describe('findAll', () => {
    it('should return all active feats', async () => {
      const expectedFeats = [new Feat(), new Feat()];
      featRepositoryMock.find.mockResolvedValue(expectedFeats);

      const result = await service.findAll();
      expect(result).toEqual(expectedFeats);
      expect(featRepositoryMock.find).toHaveBeenCalledWith({
        where: { active: true },
        relations: [
          'traits',
          'actionsGranted',
          'spellsGranted',
          'featProficiencies',
          'featChoices',
        ],
      });
    });

    it('should return feats based on search parameters', async () => {
      const searchParams = { name: 'Test' };
      const expectedFeats = [new Feat()];
      featRepositoryMock.find.mockResolvedValue(expectedFeats);

      const result = await service.findAll(searchParams);
      expect(result).toEqual(expectedFeats);
      expect(featRepositoryMock.find).toHaveBeenCalledWith({
        where: { ...searchParams, active: true },
        relations: [
          'traits',
          'actionsGranted',
          'spellsGranted',
          'featProficiencies',
          'featChoices',
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return a feat by id', async () => {
      const id = '1234';
      const expectedFeat = new Feat();
      featRepositoryMock.findOne.mockResolvedValue(expectedFeat);

      const result = await service.findOne(id);
      expect(result).toEqual(expectedFeat);
      expect(featRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id, active: true },
        relations: [
          'traits',
          'actionsGranted',
          'spellsGranted',
          'featProficiencies',
          'featChoices',
        ],
      });
    });
  });

  describe('update', () => {
    it('should update a feat', async () => {
      const id = '1234';
      const updateFeatDto = { name: 'Updated Feat' };
      const existingFeat = new Feat();
      existingFeat.id = id;

      featRepositoryMock.findOne.mockResolvedValue(existingFeat);
      featRepositoryMock.save.mockResolvedValue({
        ...existingFeat,
        ...updateFeatDto,
      });

      const result = await service.update(id, updateFeatDto);
      expect(result).toEqual({ ...existingFeat, ...updateFeatDto });
      expect(featRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(featRepositoryMock.save).toHaveBeenCalledWith({
        ...existingFeat,
        ...updateFeatDto,
      });
    });

    it('should throw an error if feat not found', async () => {
      const id = '1234';
      const updateFeatDto = { name: 'Updated Feat' };

      featRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.update(id, updateFeatDto)).rejects.toBe(
        `Feat with id ${id} not found`,
      );
    });
  });

  describe('remove', () => {
    it('should deactivaet a feat by id', async () => {
      const id = '1234';
      service.update = jest.fn().mockResolvedValue({
        id,
        active: false,
      });

      const result = await service.remove(id);
      expect(result).toEqual(`Feat with id ${id} has been deactivated`);
    });
  });
});
