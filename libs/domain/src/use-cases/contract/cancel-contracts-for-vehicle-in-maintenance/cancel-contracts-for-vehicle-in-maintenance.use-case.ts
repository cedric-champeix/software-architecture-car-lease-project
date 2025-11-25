import { ContractStatus } from 'src/entities/contract.entity';
import { type Vehicle, VehicleStatus } from 'src/entities/vehicle.entity';
import type { ContractRepository } from 'src/repositories/contract.repository';

export class CancelContractsForVehicleInMaintenanceUseCase {
  constructor(private readonly contractRepository: ContractRepository) {}

  async execute(vehicle: Vehicle): Promise<void> {
    if (vehicle.status === VehicleStatus.MAINTENANCE) {
      const contracts =
        await this.contractRepository.findByVehicleIdAndDateRange(
          vehicle.id,
          new Date(),
          new Date(new Date().getFullYear() + 10, 1, 1), // Far future date
        );

      for (const contract of contracts) {
        if (contract.status === ContractStatus.PENDING) {
          contract.status = ContractStatus.CANCELED;
          await this.contractRepository.save(contract);
        }
      }
    }
  }
}
