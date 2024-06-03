import { Test, TestingModule } from '@nestjs/testing';
import { ContentWishService } from './content-wish.service';

describe('ContentWishService', () => {
  let service: ContentWishService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentWishService],
    }).compile();

    service = module.get<ContentWishService>(ContentWishService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
