import type { FuelType, MotorizationType, VehicleStatus } from './enum';

export class CreateVehicle {
  make: string;
  model: string;
  fuelType: FuelType;
  motorizationType: MotorizationType;
  color: string;
  licensePlate: string;
  acquiredDate: Date;
  status: VehicleStatus;

  constructor(init: CreateVehicle) {
    Object.assign(this, init);
  }
}
