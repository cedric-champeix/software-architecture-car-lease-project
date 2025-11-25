import { Contract, ContractStatus } from 'src/entities/contract.entity';
import { VehicleStatus } from 'src/entities/vehicle.entity';
import type { ClientRepository } from 'src/repositories/client.repository';
import type { ContractRepository } from 'src/repositories/contract.repository';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';

export class CreateContractUseCase {
  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly clientRepository: ClientRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(input: {
    clientId: string;
    endDate: Date;
    startDate: Date;
    vehicleId: string;
  }): Promise<Contract> {
    const client = await this.clientRepository.findById(input.clientId);
    if (!client) {
      throw new Error('Client not found.');
    }

    const vehicle = await this.vehicleRepository.findById(input.vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found.');
    }

    if (vehicle.status === VehicleStatus.MAINTENANCE) {
      throw new Error('Vehicle is under maintenance and cannot be leased.');
    }

    const overlappingContracts =
      await this.contractRepository.findByVehicleIdAndDateRange(
        input.vehicleId,
        input.startDate,
        input.endDate,
      );

    if (overlappingContracts.length > 0) {
      throw new Error('Vehicle is already leased for the selected period.');
    }

    const contract = new Contract({
      ...input,
      status: ContractStatus.PENDING,
    });

    return this.contractRepository.save(contract);
  }
}
