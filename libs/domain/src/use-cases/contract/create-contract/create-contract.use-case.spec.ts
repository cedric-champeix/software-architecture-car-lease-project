import { Client } from '@lib/domain/entities/client/client.entity';
import { Contract } from '@lib/domain/entities/contract';
import { CreateContract } from '@lib/domain/entities/contract';
import { ContractStatus } from '@lib/domain/entities/contract/enum';
import {
  FuelType,
  MotorizationType,
  VehicleStatus,
} from '@lib/domain/entities/vehicle/enum';
import { Vehicle } from '@lib/domain/entities/vehicle/vehicle.entity';
import type { ClientRepository } from '@lib/domain/repositories/client.repository';
import type { ContractRepository } from '@lib/domain/repositories/contract.repository';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import { CLIENT_FIXTURE } from '@lib/domain/test/fixtures/client/client.fixture';
import { CONTRACT_FIXTURE } from '@lib/domain/test/fixtures/contract/contract.fixture';
import { VEHICLE_FIXTURE } from '@lib/domain/test/fixtures/vehicle/vehicle.fixture';

import { CreateContractUseCase } from './create-contract.use-case';

describe('CreateContractUseCase', () => {
  let createContractUseCase: CreateContractUseCase;
  let contractRepository: ContractRepository;

  beforeEach(() => {
    contractRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
      update: jest.fn(),
    };
    createContractUseCase = new CreateContractUseCase(contractRepository);
  });

  it('should create a new contract', async () => {
    const contractData = {
      clientId: 'client-1',
      endDate: new Date('2020-01-01'),
      startDate: new Date('2020-01-01'),
      vehicleId: 'vehicle-1',
    };

    const contract = new Contract({
      ...CONTRACT_FIXTURE,
      ...contractData,
      status: ContractStatus.PENDING,
    });

    (contractRepository.create as jest.Mock).mockResolvedValue(contract);

    const result = await createContractUseCase.execute(contractData);

    expect(contractRepository.create).toHaveBeenCalledWith({
      contract: new CreateContract({
        ...contractData,
        status: ContractStatus.PENDING,
      }),
    });

    expect(result).toEqual(contract);
  });
});
