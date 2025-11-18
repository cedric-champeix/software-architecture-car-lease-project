import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract } from 'src/domain/entities/contract.entity';
import { ContractRepository } from 'src/domain/repositories/contract.repository';

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

  async findById(id: string): Promise<Contract | null> {
    const contract = await this.contractModel.findById(id).exec();
    return contract ? this.toDomain(contract) : null;
  }

  async findAll(): Promise<Contract[]> {
    const contracts = await this.contractModel.find().exec();
    return contracts.map((c) => this.toDomain(c));
  }

  async save(contract: Contract): Promise<Contract> {
    const createdContract = new this.contractModel(contract);
    const saved = await createdContract.save();
    return this.toDomain(saved);
  }

  async deleteById(id: string): Promise<void> {
    await this.contractModel.findByIdAndDelete(id).exec();
  }

  async findByVehicleIdAndDateRange(
    vehicleId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Contract[]> {
    const contracts = await this.contractModel
      .find({
        $or: [{ endDate: { $gte: startDate }, startDate: { $lte: endDate } }],
        vehicleId,
      })
      .exec();
    return contracts.map((c) => this.toDomain(c));
  }
}
