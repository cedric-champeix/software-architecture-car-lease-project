import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { OutMongooseService } from './out-mongoose.service';

describe('OutMongooseService', () => {
  let service: OutMongooseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutMongooseService],
    }).compile();

    service = module.get<OutMongooseService>(OutMongooseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
