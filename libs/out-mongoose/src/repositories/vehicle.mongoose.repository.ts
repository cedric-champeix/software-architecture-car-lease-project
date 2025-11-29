import { Vehicle } from '@lib/domain/entities/vehicle/vehicle.entity';
import {
  CreateVehicleInput,
  DeleteVehicleInput,
  FindAllVehicleInput,
  FindVehicleByIdInput,
  FindVehicleByLicensePlateInput,
  UpdateVehicleInput,
  VehicleRepository,
} from '@lib/domain/repositories/vehicle.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { VehicleDocument, VehicleModel } from '../schemas/vehicle.schema';

@Injectable()
export class VehicleMongooseRepository implements VehicleRepository {
  constructor(
    @InjectModel(VehicleModel.name)
    private readonly vehicleModel: Model<VehicleDocument>,
  ) {}

  private toDomain(vehicleModel: VehicleDocument): Vehicle {
    return new Vehicle({
      acquiredDate: vehicleModel.acquiredDate,
      color: vehicleModel.color,
      fuelType: vehicleModel.fuelType,
      id: vehicleModel._id.toString(),
      licensePlate: vehicleModel.licensePlate,
      make: vehicleModel.make,
      model: vehicleModel.model,
      motorizationType: vehicleModel.motorizationType,
      status: vehicleModel.status,
    });
  }

  async findById({ id }: FindVehicleByIdInput): Promise<Vehicle | null> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    return vehicle ? this.toDomain(vehicle) : null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findAll(_input: FindAllVehicleInput): Promise<Vehicle[]> {
    const vehicles = await this.vehicleModel.find().exec();
    return vehicles.map((v) => this.toDomain(v));
  }

  async create({ vehicle }: CreateVehicleInput): Promise<Vehicle> {
    const createdVehicle = new this.vehicleModel(vehicle);
    const saved = await createdVehicle.save();
    return this.toDomain(saved);
  }

  async update({ id, vehicle }: UpdateVehicleInput): Promise<Vehicle> {
    const updated = await this.vehicleModel
      .findByIdAndUpdate(id, vehicle, { new: true })
      .exec();
    if (!updated) {
      throw new Error('Vehicle not found');
    }
    return this.toDomain(updated);
  }

  async deleteById({ id }: DeleteVehicleInput): Promise<boolean> {
    const result = await this.vehicleModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async findByLicensePlate({
    licensePlate,
  }: FindVehicleByLicensePlateInput): Promise<Vehicle | null> {
    const vehicle = await this.vehicleModel.findOne({ licensePlate }).exec();
    return vehicle ? this.toDomain(vehicle) : null;
  }
}
