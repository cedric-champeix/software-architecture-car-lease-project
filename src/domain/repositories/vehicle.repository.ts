import { Vehicle } from '../entities/vehicle.entity';

export abstract class VehicleRepository {
  abstract findById(id: string): Promise<Vehicle | null>;
  abstract findAll(): Promise<Vehicle[]>;
  abstract save(vehicle: Vehicle): Promise<Vehicle>;
  abstract deleteById(id: string): Promise<void>;
  abstract findByLicensePlate(licensePlate: string): Promise<Vehicle | null>;
}
