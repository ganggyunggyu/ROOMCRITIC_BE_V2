import { Test, TestingModule } from '@nestjs/testing';
import { ContentWatchService } from './content-watch.service';

describe('ContentWatchService', () => {
  let service: ContentWatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentWatchService],
    }).compile();

    service = module.get<ContentWatchService>(ContentWatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
