import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { InMessagesService } from './in-messages.service';

describe('InMessagesService', () => {
  let service: InMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InMessagesService],
    }).compile();

    service = module.get<InMessagesService>(InMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
