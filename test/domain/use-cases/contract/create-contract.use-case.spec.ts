import { CreateContractUseCase } from 'src/domain/use-cases/contract/create-contract.use-case';
import { ContractRepository } from 'src/domain/repositories/contract.repository';
import { VehicleRepository } from 'src/domain/repositories/vehicle.repository';
import { ClientRepository } from 'src/domain/repositories/client.repository';
import { Contract, ContractStatus } from 'src/domain/entities/contract.entity';
import { Vehicle, VehicleStatus } from 'src/domain/entities/vehicle.entity';
import { Client } from 'src/domain/entities/client.entity';

describe('CreateContractUseCase', () => {
  let createContractUseCase: CreateContractUseCase;
  let contractRepository: ContractRepository;
  let vehicleRepository: VehicleRepository;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    contractRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
    };
    vehicleRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findByLicensePlate: jest.fn(),
    };
    clientRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    createContractUseCase = new CreateContractUseCase(
      contractRepository,
      vehicleRepository,
      clientRepository,
    );
  });

  it('should create a new contract', async () => {
    const contractData = {
      vehicleId: '1',
      clientId: '1',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-10'),
    };
    const client = new Client({ id: '1' });
    const vehicle = new Vehicle({ id: '1', status: VehicleStatus.AVAILABLE });
    const contract = new Contract({ ...contractData, status: ContractStatus.PENDING });

    (clientRepository.findById as jest.Mock).mockResolvedValue(client);
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);
    (contractRepository.findByVehicleIdAndDateRange as jest.Mock).mockResolvedValue([]);
    (contractRepository.save as jest.Mock).mockResolvedValue(contract);

    const result = await createContractUseCase.execute(contractData);

    expect(clientRepository.findById).toHaveBeenCalledWith({ id: contractData.clientId });
    expect(vehicleRepository.findById).toHaveBeenCalledWith(contractData.vehicleId);
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
      vehicleId: '1',
      clientId: '1',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-10'),
    };
    (clientRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(createContractUseCase.execute(contractData)).rejects.toThrow('Client not found.');
  });

  it('should throw an error if vehicle not found', async () => {
    const contractData = {
      vehicleId: '1',
      clientId: '1',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-10'),
    };
    (clientRepository.findById as jest.Mock).mockResolvedValue(new Client());
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(createContractUseCase.execute(contractData)).rejects.toThrow('Vehicle not found.');
  });

  it('should throw an error if vehicle is under maintenance', async () => {
    const contractData = {
      vehicleId: '1',
      clientId: '1',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-10'),
    };
    const vehicle = new Vehicle({ id: '1', status: VehicleStatus.MAINTENANCE });
    (clientRepository.findById as jest.Mock).mockResolvedValue(new Client());
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);

    await expect(createContractUseCase.execute(contractData)).rejects.toThrow(
      'Vehicle is under maintenance and cannot be leased.',
    );
  });

  it('should throw an error if vehicle is already leased for the selected period', async () => {
    const contractData = {
      vehicleId: '1',
      clientId: '1',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-10'),
    };
    const vehicle = new Vehicle({ id: '1', status: VehicleStatus.AVAILABLE });
    (clientRepository.findById as jest.Mock).mockResolvedValue(new Client());
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);
    (contractRepository.findByVehicleIdAndDateRange as jest.Mock).mockResolvedValue([new Contract()]);

    await expect(createContractUseCase.execute(contractData)).rejects.toThrow(
      'Vehicle is already leased for the selected period.',
    );
  });
});
