import { UseCase } from '@lib/domain/common/use-cases';
import { ONE_YEAR_IN_MS } from '@lib/domain/constants/constant';
import { UpdateContract } from '@lib/domain/entities/contract';
import { ContractStatus } from '@lib/domain/entities/contract/enum';
import type { Vehicle } from '@lib/domain/entities/vehicle';
import { VehicleStatus } from '@lib/domain/entities/vehicle/enum';
import type { ContractRepository } from '@lib/domain/repositories/contract.repository';

export const MAINTENANCE_DATE_RANGE = new Date(
  new Date().getTime() + ONE_YEAR_IN_MS,
);

export class CancelContractsForVehicleInMaintenanceUseCase extends UseCase<
  Vehicle,
  void
> {
  constructor(private readonly contractRepository: ContractRepository) {
    super();
  }

  async execute(vehicle: Vehicle): Promise<void> {
    if (vehicle.status === VehicleStatus.MAINTENANCE) {
      const contracts =
        await this.contractRepository.findByVehicleIdAndDateRange({
          endDate: MAINTENANCE_DATE_RANGE,
          startDate: new Date(),
          vehicleId: vehicle.id,
        });

      for (const contract of contracts) {
        if (contract.status === ContractStatus.PENDING) {
          const updatedContract = new UpdateContract({
            status: ContractStatus.CANCELLED,
          });

          await this.contractRepository.update({
            contract: updatedContract,
            id: contract.id,
          });
        }
      }
    }
  }
}
