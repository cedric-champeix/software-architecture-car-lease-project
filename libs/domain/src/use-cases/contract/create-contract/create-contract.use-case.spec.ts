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
  let vehicleRepository: VehicleRepository;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    contractRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
      update: jest.fn(),
    };
    vehicleRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      update: jest.fn(),
    };
    clientRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };
    createContractUseCase = new CreateContractUseCase(
      contractRepository,
      clientRepository,
      vehicleRepository,
    );
  });

  it('should create a new contract', async () => {
    const contractData = {
      clientId: 'client-1',
      endDate: new Date('2020-01-01'),
      startDate: new Date('2020-01-01'),
      vehicleId: 'vehicle-1',
    };

    const client = new Client({ ...CLIENT_FIXTURE });

    const vehicle = new Vehicle({ ...VEHICLE_FIXTURE });

    const contract = new Contract({
      ...CONTRACT_FIXTURE,
      ...contractData,
      status: ContractStatus.PENDING,
    });

    (clientRepository.findById as jest.Mock).mockResolvedValue(client);

    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);

    (
      contractRepository.findByVehicleIdAndDateRange as jest.Mock
    ).mockResolvedValue([]);

    (contractRepository.create as jest.Mock).mockResolvedValue(contract);

    const result = await createContractUseCase.execute(contractData);

    expect(clientRepository.findById).toHaveBeenCalledWith({
      id: contractData.clientId,
    });

    expect(vehicleRepository.findById).toHaveBeenCalledWith({
      id: contractData.vehicleId,
    });

    expect(contractRepository.findByVehicleIdAndDateRange).toHaveBeenCalledWith(
      {
        endDate: contractData.endDate,
        startDate: contractData.startDate,
        vehicleId: contractData.vehicleId,
      },
    );

    expect(contractRepository.create).toHaveBeenCalledWith({
      contract: new CreateContract({
        ...contractData,
        status: ContractStatus.PENDING,
      }),
    });

    expect(result).toEqual(contract);
  });

  it('should throw an error if client not found', async () => {
    const contractData = {
      clientId: '1',
      endDate: new Date('2025-12-10'),
      startDate: new Date('2025-12-01'),
      vehicleId: '1',
    };
    (clientRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(createContractUseCase.execute(contractData)).rejects.toThrow(
      'Client not found.',
    );
  });

  it('should throw an error if vehicle not found', async () => {
    const contractData = {
      clientId: '1',
      endDate: new Date('2025-12-10'),
      startDate: new Date('2025-12-01'),
      vehicleId: '1',
    };

    const client = new Client({ ...CLIENT_FIXTURE });

    (clientRepository.findById as jest.Mock).mockResolvedValue(client);
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(createContractUseCase.execute(contractData)).rejects.toThrow(
      'Vehicle not found.',
    );
  });

  it('should throw an error if vehicle is under maintenance', async () => {
    const contractData = {
      clientId: '1',
      endDate: new Date('2025-12-10'),
      startDate: new Date('2025-12-01'),
      vehicleId: '1',
    };

    const vehicle = new Vehicle({
      acquiredDate: new Date('2020-01-01'),
      color: 'Blue',
      fuelType: FuelType.PETROL,
      id: '1',
      licensePlate: 'ABC-1234',
      make: 'Toyota',
      model: 'Corolla',
      motorizationType: MotorizationType.INTERNAL_COMBUSTION,
      status: VehicleStatus.MAINTENANCE,
    });

    const client = new Client({ ...CLIENT_FIXTURE });

    (clientRepository.findById as jest.Mock).mockResolvedValue(client);

    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);

    (
      contractRepository.findByVehicleIdAndDateRange as jest.Mock
    ).mockResolvedValue([]);

    await expect(createContractUseCase.execute(contractData)).rejects.toThrow(
      'Vehicle is under maintenance and cannot be leased.',
    );
  });

  it('should throw an error if vehicle is already leased during the period', async () => {
    const contractData = {
      clientId: '1',
      endDate: new Date('2025-12-10'),
      startDate: new Date('2025-12-01'),
      vehicleId: '1',
    };

    const vehicle = new Vehicle({
      acquiredDate: new Date('2020-01-01'),
      color: 'Blue',
      fuelType: FuelType.PETROL,
      id: '1',
      licensePlate: 'ABC-1234',
      make: 'Toyota',
      model: 'Corolla',
      motorizationType: MotorizationType.INTERNAL_COMBUSTION,
      status: VehicleStatus.AVAILABLE,
    });

    const client = new Client({ ...CLIENT_FIXTURE });

    const contract = new Contract({
      ...CONTRACT_FIXTURE,
      ...contractData,
      status: ContractStatus.PENDING,
    });

    (clientRepository.findById as jest.Mock).mockResolvedValue(client);
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);
    (
      contractRepository.findByVehicleIdAndDateRange as jest.Mock
    ).mockResolvedValue([contract]);

    await expect(createContractUseCase.execute(contractData)).rejects.toThrow(
      'Vehicle is already leased for the selected period.',
    );
  });
});
