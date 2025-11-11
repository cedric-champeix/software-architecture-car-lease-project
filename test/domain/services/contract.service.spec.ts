import { ContractService } from 'src/domain/services/contract.service';
import { ContractRepository } from 'src/domain/repositories/contract.repository';
import { Contract, ContractStatus } from 'src/domain/entities/contract.entity';
import { Vehicle, VehicleStatus } from 'src/domain/entities/vehicle.entity';

describe('ContractService', () => {
  let contractService: ContractService;
  let contractRepository: ContractRepository;

  beforeEach(() => {
    contractRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
    };
    contractService = new ContractService(contractRepository);
  });

  describe('cancelContractsForVehicleInMaintenance', () => {
    it('should cancel pending contracts for a vehicle in maintenance', async () => {
      const vehicle = new Vehicle({ id: '1', status: VehicleStatus.MAINTENANCE });
      const contracts = [
        new Contract({ id: '1', status: ContractStatus.PENDING }),
        new Contract({ id: '2', status: ContractStatus.ACTIVE }),
      ];
      (contractRepository.findByVehicleIdAndDateRange as jest.Mock).mockResolvedValue(contracts);

      await contractService.cancelContractsForVehicleInMaintenance(vehicle);

      expect(contractRepository.findByVehicleIdAndDateRange).toHaveBeenCalledWith(
        vehicle.id,
        expect.any(Date),
        expect.any(Date),
      );
      expect(contractRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1', status: ContractStatus.CANCELED }),
      );
      expect(contractRepository.save).not.toHaveBeenCalledWith(
        expect.objectContaining({ id: '2' }),
      );
    });

    it('should not do anything if vehicle is not in maintenance', async () => {
      const vehicle = new Vehicle({ id: '1', status: VehicleStatus.AVAILABLE });

      await contractService.cancelContractsForVehicleInMaintenance(vehicle);

      expect(contractRepository.findByVehicleIdAndDateRange).not.toHaveBeenCalled();
      expect(contractRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('handleOverdueContracts', () => {
    it('should mark overdue contracts as OVERDUE', async () => {
      const now = new Date();
      const contracts = [
        new Contract({
          id: '1',
          status: ContractStatus.ACTIVE,
          endDate: new Date(now.getTime() - 1000),
          vehicleId: '1',
        }),
        new Contract({
          id: '2',
          status: ContractStatus.ACTIVE,
          endDate: new Date(now.getTime() + 1000),
          vehicleId: '2',
        }),
      ];
      (contractRepository.findAll as jest.Mock).mockResolvedValue(contracts);
      (contractRepository.findByVehicleIdAndDateRange as jest.Mock).mockResolvedValue([]);

      await contractService.handleOverdueContracts();

      expect(contractRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1', status: ContractStatus.OVERDUE }),
      );
      expect(contractRepository.save).not.toHaveBeenCalledWith(
        expect.objectContaining({ id: '2' }),
      );
    });

    it('should cancel next contract if affected by overdue contract', async () => {
      const now = new Date();
      const overdueContract = new Contract({
        id: '1',
        status: ContractStatus.ACTIVE,
        endDate: new Date(now.getTime() - 1000),
        vehicleId: '1',
      });
      const nextContract = new Contract({
        id: '2',
        status: ContractStatus.PENDING,
        startDate: new Date(now.getTime() - 500),
        vehicleId: '1',
      });

      (contractRepository.findAll as jest.Mock).mockResolvedValue([overdueContract]);
      (contractRepository.findByVehicleIdAndDateRange as jest.Mock).mockResolvedValue([nextContract]);

      await contractService.handleOverdueContracts();

      expect(contractRepository.save).toHaveBeenCalledTimes(2);
      expect(contractRepository.save).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ id: '1', status: ContractStatus.OVERDUE }),
      );
      expect(contractRepository.save).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ id: '2', status: ContractStatus.CANCELED }),
      );
    });
  });
});
