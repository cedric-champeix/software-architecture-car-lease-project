import type {
  Contract,
  CreateContract,
  UpdateContract,
} from '@lib/domain/entities/contract';

export type FindContractByIdInput = { id: Contract['id'] };

export type FindAllContractInput = Record<string, never>;

export type FindContractByVehicleIdAndDateRangeInput = {
  vehicleId: Contract['vehicleId'];
  endDate?: Date;
  startDate?: Date;
};

export type CreateContractInput = { contract: CreateContract };

export type UpdateContractInput = {
  contract: UpdateContract;
  id: Contract['id'];
};

export type DeleteContractInput = { id: Contract['id'] };

export abstract class ContractRepository {
  abstract findById({ id }: FindContractByIdInput): Promise<Contract | null>;

  abstract findAll(input: FindAllContractInput): Promise<Contract[]>;

  abstract findByVehicleIdAndDateRange({
    vehicleId,
    startDate,
    endDate,
  }: FindContractByVehicleIdAndDateRangeInput): Promise<Contract[]>;

  abstract create({ contract }: CreateContractInput): Promise<Contract>;

  abstract update({ id, contract }: UpdateContractInput): Promise<Contract>;

  abstract deleteById({ id }: DeleteContractInput): Promise<boolean>;
}
