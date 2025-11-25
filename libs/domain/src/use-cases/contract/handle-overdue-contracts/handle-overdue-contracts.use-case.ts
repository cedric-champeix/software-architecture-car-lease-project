import { ContractStatus } from 'src/entities/contract.entity';
import type { ContractRepository } from 'src/repositories/contract.repository';

export class HandleOverdueContractsUseCase {
  constructor(private readonly contractRepository: ContractRepository) {}

  async execute(): Promise<void> {
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
