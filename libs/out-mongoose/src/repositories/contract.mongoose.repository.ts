import { Contract } from '@lib/domain/entities/contract/contract.entity';
import {
  ContractRepository,
  CreateContractInput,
  DeleteContractInput,
  FindAllContractInput,
  FindContractByIdInput,
  FindContractByVehicleIdAndDateRangeInput,
  UpdateContractInput,
} from '@lib/domain/repositories/contract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { ContractDocument, ContractModel } from '../schemas/contract.schema';

@Injectable()
export class ContractMongooseRepository implements ContractRepository {
  constructor(
    @InjectModel(ContractModel.name)
    private readonly contractModel: Model<ContractDocument>,
  ) {}

  private toDomain(contractModel: ContractDocument): Contract {
    return new Contract({
      clientId: contractModel.clientId,
      endDate: contractModel.endDate,
      id: contractModel._id.toString(),
      startDate: contractModel.startDate,
      status: contractModel.status,
      vehicleId: contractModel.vehicleId,
    });
  }

  async findById({ id }: FindContractByIdInput): Promise<Contract | null> {
    const contract = await this.contractModel.findById(id).exec();
    return contract ? this.toDomain(contract) : null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findAll(_input: FindAllContractInput): Promise<Contract[]> {
    const contracts = await this.contractModel.find().exec();
    return contracts.map((c) => this.toDomain(c));
  }

  async create({ contract }: CreateContractInput): Promise<Contract> {
    const createdContract = new this.contractModel(contract);
    const saved = await createdContract.save();
    return this.toDomain(saved);
  }

  async update({ id, contract }: UpdateContractInput): Promise<Contract> {
    const updated = await this.contractModel
      .findByIdAndUpdate(id, contract, { new: true })
      .exec();
    if (!updated) {
      throw new Error('Contract not found');
    }
    return this.toDomain(updated);
  }

  async deleteById({ id }: DeleteContractInput): Promise<boolean> {
    const result = await this.contractModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async findByVehicleIdAndDateRange({
    vehicleId,
    startDate,
    endDate,
  }: FindContractByVehicleIdAndDateRangeInput): Promise<Contract[]> {
    const query: FilterQuery<ContractModel> = { vehicleId };
    if (startDate && endDate) {
      query.$or = [
        { endDate: { $gte: startDate }, startDate: { $lte: endDate } },
      ];
    }
    const contracts = await this.contractModel.find(query).exec();
    return contracts.map((c) => this.toDomain(c));
  }
}
