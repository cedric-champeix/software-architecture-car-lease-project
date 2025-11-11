import { Injectable, Inject } from '@nestjs/common';
import { Contract, ContractStatus } from '../../entities/contract.entity';
import { ContractRepository } from '../../repositories/contract.repository';
import { VehicleRepository } from '../../repositories/vehicle.repository';
import type { ClientRepository } from '../../repositories/client.repository';
import { VehicleStatus } from '../../entities/vehicle.entity';

@Injectable()
export class CreateContractUseCase {
  constructor(
    @Inject('ContractRepository')
    private readonly contractRepository: ContractRepository,
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,
    @Inject('ClientRepository')
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: {
    vehicleId: string;
    clientId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<Contract> {
    const client = await this.clientRepository.findById({ id: input.clientId });
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
