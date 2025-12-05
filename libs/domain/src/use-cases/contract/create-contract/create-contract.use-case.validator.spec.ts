import { Contract } from '@lib/domain/entities/contract';
import { CreateContract } from '@lib/domain/entities/contract/create-contract.entity';
import { ContractStatus } from '@lib/domain/entities/contract/enum';
import { VehicleStatus } from '@lib/domain/entities/vehicle/enum';
import type { ClientRepository } from '@lib/domain/repositories/client.repository';
import type { ContractRepository } from '@lib/domain/repositories/contract.repository';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import { CLIENT_FIXTURE } from '@lib/domain/test/fixtures/client/client.fixture';
import {
  CONTRACT_FIXTURE,
  CONTRACT_FIXTURE_NO_ID,
} from '@lib/domain/test/fixtures/contract/contract.fixture';
import { VEHICLE_FIXTURE } from '@lib/domain/test/fixtures/vehicle/vehicle.fixture';
import type { CreateContractUseCaseInput } from '@lib/domain/use-cases/contract/create-contract';

import { CreateContractUseCaseValidator } from './create-contract.use-case.validator';

describe('CreateContractUseCaseValidator', () => {
  let createContractUseCase: CreateContractUseCaseValidator;
  let contractRepository: ContractRepository;
  let clientRepository: ClientRepository;
  let vehicleRepository: VehicleRepository;

  beforeEach(() => {
    contractRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as ContractRepository;

    clientRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as ClientRepository;

    vehicleRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as VehicleRepository;

    createContractUseCase = new CreateContractUseCaseValidator(
      contractRepository,
      clientRepository,
      vehicleRepository,
    );
  });

  describe('successful creation', () => {
    it('should create a new contract when all validations pass', async () => {
      const contractData: CreateContractUseCaseInput = {
        clientId: CLIENT_FIXTURE.id,
        endDate: CONTRACT_FIXTURE_NO_ID.endDate,
        startDate: CONTRACT_FIXTURE_NO_ID.startDate,
        vehicleId: VEHICLE_FIXTURE.id,
      };

      const contract = new Contract({
        ...CONTRACT_FIXTURE,
        status: ContractStatus.PENDING,
      });

      (clientRepository.findById as jest.Mock).mockResolvedValue(
        CLIENT_FIXTURE,
      );
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(
        VEHICLE_FIXTURE,
      );
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
      expect(
        contractRepository.findByVehicleIdAndDateRange,
      ).toHaveBeenCalledWith({
        endDate: contractData.endDate,
        startDate: contractData.startDate,
        vehicleId: contractData.vehicleId,
      });

      expect(contractRepository.create).toHaveBeenCalledWith({
        contract: new CreateContract({
          ...contractData,
          status: ContractStatus.PENDING,
        }),
      });

      expect(result).toEqual(contract);
    });
  });

  describe('client validation', () => {
    it('should throw an error when client does not exist', async () => {
      const contractData = {
        clientId: 'non-existent-client',
        endDate: new Date(),
        startDate: new Date(),
        vehicleId: VEHICLE_FIXTURE.id,
      };

      (clientRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(createContractUseCase.execute(contractData)).rejects.toThrow(
        'Client not found.',
      );

      expect(clientRepository.findById).toHaveBeenCalled();
      expect(contractRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('vehicle validation', () => {
    it('should throw an error when vehicle does not exist', async () => {
      const contractData = {
        clientId: CLIENT_FIXTURE.id,
        endDate: new Date(),
        startDate: new Date(),
        vehicleId: 'non-existent-vehicle',
      };

      (clientRepository.findById as jest.Mock).mockResolvedValue(
        CLIENT_FIXTURE,
      );
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(createContractUseCase.execute(contractData)).rejects.toThrow(
        'Vehicle not found.',
      );

      expect(vehicleRepository.findById).toHaveBeenCalled();
      expect(contractRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error when vehicle is in maintenance', async () => {
      const contractData = {
        clientId: CLIENT_FIXTURE.id,
        endDate: new Date(),
        startDate: new Date(),
        vehicleId: VEHICLE_FIXTURE.id,
      };

      const maintenanceVehicle = {
        ...VEHICLE_FIXTURE,
        status: VehicleStatus.MAINTENANCE,
      };

      (clientRepository.findById as jest.Mock).mockResolvedValue(
        CLIENT_FIXTURE,
      );
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(
        maintenanceVehicle,
      );

      await expect(createContractUseCase.execute(contractData)).rejects.toThrow(
        'Vehicle is under maintenance and cannot be leased.',
      );
      expect(contractRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('overlapping validation', () => {
    it('should throw an error when there are overlapping contracts', async () => {
      const contractData = {
        clientId: CLIENT_FIXTURE.id,
        endDate: new Date(),
        startDate: new Date(),
        vehicleId: VEHICLE_FIXTURE.id,
      };

      (clientRepository.findById as jest.Mock).mockResolvedValue(
        CLIENT_FIXTURE,
      );
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(
        VEHICLE_FIXTURE,
      );
      (
        contractRepository.findByVehicleIdAndDateRange as jest.Mock
      ).mockResolvedValue([CONTRACT_FIXTURE]);

      await expect(createContractUseCase.execute(contractData)).rejects.toThrow(
        'Vehicle is already leased for the selected period.',
      );
      expect(contractRepository.create).not.toHaveBeenCalled();
    });
  });
});
