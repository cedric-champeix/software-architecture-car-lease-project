import { Inject, Injectable } from '@nestjs/common';

import { ContractStatus } from '../entities/contract.entity';
import { type Vehicle, VehicleStatus } from '../entities/vehicle.entity';
import type { ContractRepository } from '../repositories/contract.repository';

@Injectable()
export class ContractService {
  constructor(
    @Inject('ContractRepository')
    private readonly contractRepository: ContractRepository,
  ) {}

  async cancelContractsForVehicleInMaintenance(
    vehicle: Vehicle,
  ): Promise<void> {
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

  async handleOverdueContracts(): Promise<void> {
    const now = new Date();
    const contracts = await this.contractRepository.findAll();
    const overdueContracts = contracts.filter(
      (contract) =>
        contract.status === ContractStatus.ACTIVE && contract.endDate < now,
    );

    for (const contract of overdueContracts) {
      contract.status = ContractStatus.OVERDUE;
      await this.contractRepository.save(contract);

      const affectedContracts =
        await this.contractRepository.findByVehicleIdAndDateRange(
          contract.vehicleId,
          contract.endDate,
          new Date(now.getTime() + 1000 * 60 * 60 * 24 * 365), // 1 year in the future
        );

      for (const affectedContract of affectedContracts) {
        if (affectedContract.id !== contract.id) {
          affectedContract.status = ContractStatus.CANCELED;
          await this.contractRepository.save(affectedContract);
        }
      }
    }
  }
}
