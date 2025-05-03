import { Test, TestingModule } from '@nestjs/testing';
import { TraitService } from './trait.service';

describe('TraitService', () => {
  let service: TraitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TraitService],
    }).compile();

    service = module.get<TraitService>(TraitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
