import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from 'src/domain/entities/vehicle.entity';
import { VehicleRepository } from 'src/domain/repositories/vehicle.repository';
import { VehicleModel } from '../schemas/vehicle.schema';

@Injectable()
export class VehicleMongooseRepository implements VehicleRepository {
  constructor(
    @InjectModel(VehicleModel.name)
    private readonly vehicleModel: Model<VehicleModel>,
  ) {}

  private toDomain(vehicleModel: VehicleModel): Vehicle {
    return new Vehicle({
      id: vehicleModel.id,
      make: vehicleModel.make,
      model: vehicleModel.get('model'),
      fuelType: vehicleModel.fuelType,
      color: vehicleModel.color,
      licensePlate: vehicleModel.licensePlate,
      acquiredDate: vehicleModel.acquiredDate,
      status: vehicleModel.status,
    });
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    return vehicle ? this.toDomain(vehicle) : null;
  }

  async findAll(): Promise<Vehicle[]> {
    const vehicles = await this.vehicleModel.find().exec();
    return vehicles.map((v) => this.toDomain(v));
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    const createdVehicle = new this.vehicleModel(vehicle);
    const saved = await createdVehicle.save();
    return this.toDomain(saved);
  }

  async deleteById(id: string): Promise<void> {
    await this.vehicleModel.findByIdAndDelete(id).exec();
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    const vehicle = await this.vehicleModel.findOne({ licensePlate }).exec();
    return vehicle ? this.toDomain(vehicle) : null;
  }
}
