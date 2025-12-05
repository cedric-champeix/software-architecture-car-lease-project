import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let health: HealthCheckService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mongoose: MongooseHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: MongooseHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    health = module.get<HealthCheckService>(HealthCheckService);
    mongoose = module.get<MongooseHealthIndicator>(MongooseHealthIndicator);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should check health', async () => {
    const healthResult = {
      details: { mongoose: { status: 'up' } },
      error: {},
      info: { mongoose: { status: 'up' } },
      status: 'ok',
    };
    (health.check as jest.Mock).mockResolvedValue(healthResult);

    expect(await controller.check()).toEqual(healthResult);
    expect(health.check).toHaveBeenCalled();
  });
});
