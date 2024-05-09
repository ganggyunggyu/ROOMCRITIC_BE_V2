import { Test, TestingModule } from '@nestjs/testing';
import { GenreScoreService } from './genre-score.service';

describe('GenreScoreService', () => {
  let service: GenreScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenreScoreService],
    }).compile();

    service = module.get<GenreScoreService>(GenreScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
