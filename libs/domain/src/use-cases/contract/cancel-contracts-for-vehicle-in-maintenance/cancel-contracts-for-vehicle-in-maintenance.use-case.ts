import { UseCase } from '../../../common/use-cases';
import { ONE_YEAR_IN_MS } from '../../../constants/constant';
import { UpdateContract } from '../../../entities/contract';
import { ContractStatus } from '../../../entities/contract/enum';
import { VehicleStatus } from '../../../entities/vehicle/enum';
import type { ContractRepository } from '../../../repositories/contract.repository';
import type { VehicleRepository } from '../../../repositories/vehicle.repository';

export const MAINTENANCE_DATE_RANGE = new Date(
  new Date().getTime() + ONE_YEAR_IN_MS,
);

export class CancelContractsForVehicleInMaintenanceUseCase extends UseCase<
  string,
  void
> {
  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {
    super();
  }

  async execute(vehicleId: string): Promise<void> {
    const vehicle = await this.vehicleRepository.findById({ id: vehicleId });

    if (!vehicle) {
      throw new Error('Vehicle not found.');
    }

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
