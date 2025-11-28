import { UseCase } from 'src/common/use-cases';
import { ONE_YEAR_IN_MS } from 'src/constants/constant';
import { UpdateContract } from 'src/entities/contract';
import { ContractStatus } from 'src/entities/contract/enum';
import type { Vehicle } from 'src/entities/vehicle';
import { VehicleStatus } from 'src/entities/vehicle/enum';
import type { ContractRepository } from 'src/repositories/contract.repository';

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

      contracts.forEach(async (contract) => {
        if (contract.status === ContractStatus.PENDING) {
          const updatedContract = new UpdateContract({
            status: ContractStatus.CANCELLED,
          });

          await this.contractRepository.update({
            id: contract.id,
            contract: updatedContract,
          });
        }
      });
    }
  }
}
