import { Test, TestingModule } from '@nestjs/testing';
import { CharacterClassController } from './character-class.controller';
import { CharacterClassService } from './character-class.service';
import { CreateCharacterClassDto } from './dto/create-character-class.dto';

describe('CharacterClassController', () => {
  let controller: CharacterClassController;

  let characterClassServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacterClassController],
      providers: [
        { provide: CharacterClassService, useValue: characterClassServiceMock },
      ],
    }).compile();

    controller = module.get<CharacterClassController>(CharacterClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#create', () => {
    it('should call characterClassService.create with the correct DTO', async () => {
      const dto = { name: 'Warrior' } as CreateCharacterClassDto;

      await controller.create(dto);

      expect(characterClassServiceMock.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('#findAll', () => {
    it('should call characterClassService.findAll', async () => {
      await controller.findAll();

      expect(characterClassServiceMock.findAll).toHaveBeenCalledWith();
    });
  });

  describe('#findOne', () => {
    it('should call characterClassService.findOne with id', async () => {
      const id = '1';

      await controller.findOne(id);

      expect(characterClassServiceMock.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('#update', () => {
    it('should call characterClassService.update with id and update DTO', async () => {
      const id = '1';
      const updateDto = { name: 'Updated Warrior' };

      await controller.update(id, updateDto);

      expect(characterClassServiceMock.update).toHaveBeenCalledWith(
        id,
        updateDto,
      );
    });
  });

  describe('#remove', () => {
    it('should call characterClassService.remove with id', async () => {
      const id = '1';

      await controller.remove(id);

      expect(characterClassServiceMock.remove).toHaveBeenCalledWith(id);
    });
  });
});
