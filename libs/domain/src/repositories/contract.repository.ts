import type {
  Contract,
  CreateContract,
  UpdateContract,
} from 'src/entities/contract';

type FindContractByIdInput = { id: Contract['id'] };

type FindAllContractInput = {};

type FindContractByVehicleIdAndDateRangeInput = {
  vehicleId: Contract['vehicleId'];
  endDate?: Date;
  startDate?: Date;
};

type CreateContractInput = { contract: CreateContract };

type UpdateContractInput = { contract: UpdateContract; id: Contract['id'] };

type DeleteContractInput = { id: Contract['id'] };

export abstract class ContractRepository {
  abstract findById({ id }: FindContractByIdInput): Promise<Contract | null>;

  abstract findAll({}: FindAllContractInput): Promise<Contract[]>;

  abstract findByVehicleIdAndDateRange({
    vehicleId,
    startDate,
    endDate,
  }: FindContractByVehicleIdAndDateRangeInput): Promise<Contract[]>;

  abstract create({ contract }: CreateContractInput): Promise<Contract>;

  abstract update({ id, contract }: UpdateContractInput): Promise<Contract>;

  abstract deleteById({ id }: DeleteContractInput): Promise<boolean>;
}
