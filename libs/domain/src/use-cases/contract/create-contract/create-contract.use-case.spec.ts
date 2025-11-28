import { Client } from 'src/entities/client/client.entity';
import { Contract } from 'src/entities/contract';
import { ContractStatus } from 'src/entities/contract/enum';
import { Vehicle } from 'src/entities/vehicle/vehicle.entity';
import {
  FuelType,
  MotorizationType,
  VehicleStatus,
} from 'src/entities/vehicle/enum';
import type { ClientRepository } from 'src/repositories/client.repository';
import type { ContractRepository } from 'src/repositories/contract.repository';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';

import { CreateContractUseCase } from '.';
import { CLIENT_FIXTURE } from 'src/test/fixtures/client/client.fixture';
import { VEHICLE_FIXTURE } from 'src/test/fixtures/vehicle/vehicle.fixture';
import {
  CONTRACT_FIXTURE,
  CONTRACT_FIXTURE_NO_ID,
} from 'src/test/fixtures/contract/contract.fixture';

describe('CreateContractUseCase', () => {
  let createContractUseCase: CreateContractUseCase;
  let contractRepository: ContractRepository;
  let vehicleRepository: VehicleRepository;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    contractRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    vehicleRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      create: jest.fn(),
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
      vehicleId: 'vehicle-1',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2020-01-01'),
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
        vehicleId: contractData.vehicleId,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
      },
    );

    expect(contractRepository.create).toHaveBeenCalledWith({
      ...CONTRACT_FIXTURE_NO_ID,
      ...contractData,
      status: ContractStatus.PENDING,
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
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-10'),
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
