import { UseCase } from 'src/common/use-cases';
import type { Contract } from 'src/entities/contract/contract.entity';
import { CreateContract } from 'src/entities/contract/create-contract.entity';
import { ContractStatus } from 'src/entities/contract/enum';
import { VehicleStatus } from 'src/entities/vehicle/enum';
import type { ClientRepository } from 'src/repositories/client.repository';
import type { ContractRepository } from 'src/repositories/contract.repository';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';

export type CreateContractUseCaseInput = {
  clientId: string;
  endDate: Date;
  startDate: Date;
  vehicleId: string;
};

export class CreateContractUseCase extends UseCase<
  CreateContractUseCaseInput,
  Contract
> {
  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly clientRepository: ClientRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {
    super();
  }

  async execute(input: CreateContractUseCaseInput): Promise<Contract> {
    const client = await this.clientRepository.findById({ id: input.clientId });
    if (!client) {
      throw new Error('Client not found.');
    }

    const vehicle = await this.vehicleRepository.findById({
      id: input.vehicleId,
    });
    if (!vehicle) {
      throw new Error('Vehicle not found.');
    }

    if (vehicle.status === VehicleStatus.MAINTENANCE) {
      throw new Error('Vehicle is under maintenance and cannot be leased.');
    }

    const overlappingContracts =
      await this.contractRepository.findByVehicleIdAndDateRange({
        endDate: input.endDate,
        startDate: input.startDate,
        vehicleId: input.vehicleId,
      });

    if (overlappingContracts.length > 0) {
      throw new Error('Vehicle is already leased for the selected period.');
    }

    const contract = new CreateContract({
      ...input,
      status: ContractStatus.PENDING,
    });

    return this.contractRepository.create({ contract });
  }
}
