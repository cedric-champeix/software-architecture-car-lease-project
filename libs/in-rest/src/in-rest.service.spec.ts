import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { InRestService } from './in-rest.service';

describe('InRestService', () => {
  let service: InRestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InRestService],
    }).compile();

    service = module.get<InRestService>(InRestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
