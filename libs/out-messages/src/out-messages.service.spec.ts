import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { OutMessagesService } from './out-messages.service';

describe('OutMessagesService', () => {
  let service: OutMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutMessagesService],
    }).compile();

    service = module.get<OutMessagesService>(OutMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
