import { UseCase } from 'src/common/use-cases';
import { ONE_DAY_IN_MS } from 'src/constants/constant';
import { UpdateContract } from 'src/entities/contract';
import { ContractStatus } from 'src/entities/contract/enum';
import type { ContractRepository } from 'src/repositories/contract.repository';

const AFFECTED_CONTRACTS_DATE_RANGE = ONE_DAY_IN_MS * 3;

export class HandleOverdueContractsUseCase extends UseCase<void, void> {
  constructor(private readonly contractRepository: ContractRepository) {
    super();
  }

  async execute(): Promise<void> {
    const contracts = await this.contractRepository.findAll({});

    const overdueContracts = contracts.filter(
      (contract) =>
        contract.status === ContractStatus.ACTIVE &&
        contract.endDate < new Date(),
    );

    overdueContracts.forEach(async ({ id, startDate, endDate, vehicleId }) => {
      const updateContract = new UpdateContract({
        status: ContractStatus.OVERDUE,
      });

      await this.contractRepository.update({ contract: updateContract, id });

      const affectedContracts =
        await this.contractRepository.findByVehicleIdAndDateRange({
          endDate: new Date(endDate.getTime() + AFFECTED_CONTRACTS_DATE_RANGE),
          startDate,
          vehicleId,
        });

      affectedContracts.forEach(async (affectedContract) => {
        if (affectedContract.id !== id) {
          const updateContract = new UpdateContract({
            status: ContractStatus.CANCELLED,
          });

          await this.contractRepository.update({
            contract: updateContract,
            id: affectedContract.id,
          });
        }
      });
    });
  }
}
