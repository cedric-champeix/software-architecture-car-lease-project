import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { InCronService } from './in-cron.service';

describe('InCronService', () => {
  let service: InCronService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InCronService],
    }).compile();

    service = module.get<InCronService>(InCronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
