import type { Contract } from '../entities/contract.entity';

export abstract class ContractRepository {
  abstract findById(id: string): Promise<Contract | null>;
  abstract findAll(): Promise<Contract[]>;
  abstract save(contract: Contract): Promise<Contract>;
  abstract deleteById(id: string): Promise<void>;
  abstract findByVehicleIdAndDateRange(
    vehicleId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Contract[]>;
}
