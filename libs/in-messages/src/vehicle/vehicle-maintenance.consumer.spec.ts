import { CancelContractsForVehicleInMaintenanceUseCase } from '@lib/domain/use-cases/contract/cancel-contracts-for-vehicle-in-maintenance';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Job } from 'bullmq';

import { VehicleMaintenanceConsumer } from './vehicle-maintenance.consumer';

interface VehicleMaintenanceJobData {
  vehicleId: string;
}

describe('VehicleMaintenanceConsumer', () => {
  let consumer: VehicleMaintenanceConsumer;
  let useCase: CancelContractsForVehicleInMaintenanceUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleMaintenanceConsumer,
        {
          provide: CancelContractsForVehicleInMaintenanceUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    consumer = module.get<VehicleMaintenanceConsumer>(
      VehicleMaintenanceConsumer,
    );
    useCase = module.get<CancelContractsForVehicleInMaintenanceUseCase>(
      CancelContractsForVehicleInMaintenanceUseCase,
    );
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  it('should call execute with correct vehicleId', async () => {
    const vehicleId = 'test-vehicle-id';
    const job = {
      data: { vehicleId },
    } as Job<VehicleMaintenanceJobData, any, string>;

    await consumer.process(job);

    expect(useCase.execute).toHaveBeenCalledWith(vehicleId);
    expect(useCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should handle use case errors', async () => {
    const vehicleId = 'test-vehicle-id';
    const job = {
      data: { vehicleId },
    } as Job<VehicleMaintenanceJobData, any, string>;

    const error = new Error('Vehicle not found');
    jest.spyOn(useCase, 'execute').mockRejectedValue(error);

    await expect(consumer.process(job)).rejects.toThrow('Vehicle not found');
  });

  it('should process job with valid vehicle ID format', async () => {
    const vehicleId = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId
    const job = {
      data: { vehicleId },
    } as Job<VehicleMaintenanceJobData, any, string>;

    await consumer.process(job);

    expect(useCase.execute).toHaveBeenCalledWith(vehicleId);
  });
});
