import { Client } from 'src/entities/client.entity';
import { Contract, ContractStatus } from 'src/entities/contract.entity';
import {
  FuelType,
  MotorizationType,
  Vehicle,
  VehicleStatus,
} from 'src/entities/vehicle.entity';
import type { ClientRepository } from 'src/repositories/client.repository';
import type { ContractRepository } from 'src/repositories/contract.repository';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';

import { CreateContractUseCase } from '.';

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
      save: jest.fn(),
    };
    vehicleRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      save: jest.fn(),
    };
    clientRepository = {
      create: jest.fn(),
      delete: jest.fn(),
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
      clientId: '1',
      endDate: new Date('2025-12-10'),
      startDate: new Date('2025-12-01'),
      vehicleId: '1',
    };
    const client = new Client({ id: '1' });
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
    const contract = new Contract({
      ...contractData,
      status: ContractStatus.PENDING,
    });

    (clientRepository.findById as jest.Mock).mockResolvedValue(client);
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);
    (
      contractRepository.findByVehicleIdAndDateRange as jest.Mock
    ).mockResolvedValue([]);
    (contractRepository.save as jest.Mock).mockResolvedValue(contract);

    const result = await createContractUseCase.execute(contractData);

    expect(clientRepository.findById).toHaveBeenCalledWith(
      contractData.clientId,
    );
    expect(vehicleRepository.findById).toHaveBeenCalledWith(
      contractData.vehicleId,
    );
    expect(contractRepository.findByVehicleIdAndDateRange).toHaveBeenCalledWith(
      contractData.vehicleId,
      contractData.startDate,
      contractData.endDate,
    );
    expect(contractRepository.save).toHaveBeenCalledWith(expect.any(Contract));
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
    (clientRepository.findById as jest.Mock).mockResolvedValue(
      new Client({ id: '1' }),
    );
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
    (clientRepository.findById as jest.Mock).mockResolvedValue(
      new Client({ id: '1' }),
    );
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
    (clientRepository.findById as jest.Mock).mockResolvedValue(new Client());
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);
    (
      contractRepository.findByVehicleIdAndDateRange as jest.Mock
    ).mockResolvedValue([new Contract()]);

    await expect(createContractUseCase.execute(contractData)).rejects.toThrow(
      'Vehicle is already leased for the selected period.',
    );
  });
});
